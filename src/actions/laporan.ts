"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { requireAdmin } from "@/lib/access-control";

export type LaporanItem = {
  id: string;
  type: "hafalan" | "kehadiran" | "tes";
  santriNama: string;
  halaqah: string;
  tanggal: Date;
  detailSingkat: string;
  kualitasAtauStatus: string;
  createdAt: Date;
};

export async function getLaporanGlobal(): Promise<LaporanItem[]> {
  const session = await checkAuth();
  requireAdmin(session);

  const adminId = (session.user as any).adminId;

  // We need to fetch all activities for Santri belonging to this admin
  const santriList = await prisma.santri.findMany({
    where: { adminId },
    select: {
      id: true,
      nama: true,
      halaqah: true,
    }
  });

  const santriIds = santriList.map(s => s.id);
  const santriMap = new Map(santriList.map(s => [s.id, s]));

  if (santriIds.length === 0) return [];

  const [hafalans, kehadirans, tesList] = await Promise.all([
    prisma.hafalan.findMany({
      where: { santriId: { in: santriIds } },
      orderBy: { tanggal: "desc" },
      take: 200,
    }),
    prisma.kehadiran.findMany({
      where: { santriId: { in: santriIds } },
      orderBy: { tanggal: "desc" },
      take: 200,
    }),
    prisma.tes.findMany({
      where: { santriId: { in: santriIds } },
      orderBy: { tanggal: "desc" },
      take: 200,
    })
  ]);

  const hasil: LaporanItem[] = [];

  hafalans.forEach(h => {
    const s = santriMap.get(h.santriId);
    if (!s) return;
    hasil.push({
      id: `hafalan-${h.id}`,
      type: "hafalan",
      santriNama: s.nama,
      halaqah: s.halaqah,
      tanggal: h.tanggal,
      detailSingkat: `${h.jenis === "ziyadah" ? "Ziyadah" : "Murajaah"} Surah ${h.surah} Ayat ${h.ayatMulai}-${h.ayatAkhir}`,
      kualitasAtauStatus: h.kualitas,
      createdAt: h.createdAt,
    });
  });

  kehadirans.forEach(k => {
    const s = santriMap.get(k.santriId);
    if (!s) return;
    hasil.push({
      id: `hadir-${k.id}`,
      type: "kehadiran",
      santriNama: s.nama,
      halaqah: s.halaqah,
      tanggal: k.tanggal,
      detailSingkat: `Absensi Kehadiran`,
      kualitasAtauStatus: k.status, // hadir, sakit, izin, dll
      createdAt: k.createdAt,
    });
  });

  tesList.forEach(t => {
    const s = santriMap.get(t.santriId);
    if (!s) return;
    hasil.push({
      id: `tes-${t.id}`,
      type: "tes",
      santriNama: s.nama,
      halaqah: s.halaqah,
      tanggal: t.tanggal,
      detailSingkat: `Ujian ${t.jenis} (${t.target}) Nilai: ${t.nilai}`,
      kualitasAtauStatus: t.status, // lulus, mengulang
      createdAt: t.createdAt,
    });
  });

  // Urutkan dari yang terbaru (berdasarkan tanggal aktivitas)
  hasil.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());

  // Ambil 500 data terbaru agar halaman tidak terlalu lambat
  return hasil.slice(0, 500);
}
