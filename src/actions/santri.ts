"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";
import { getSantriAccessWhere, requireAdmin } from "@/lib/access-control";
import { z } from "zod";

export async function getSantris() {
  const session = await checkAuth();
  const santriWhere = await getSantriAccessWhere(session);

  const santris = await prisma.santri.findMany({
    where: santriWhere,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { hafalans: true } },
      hafalans: {
        select: {
          ayatMulai: true,
          ayatAkhir: true,
        },
      },
    },
  });

  return santris.map((s) => {
    const totalAyat = s.hafalans.reduce((sum, h) => sum + Math.max(0, h.ayatAkhir - h.ayatMulai + 1), 0);
    const progressJuz = Math.min(Math.floor(totalAyat / 140), s.targetJuz);
    return {
      id: s.id,
      nama: s.nama,
      halaqah: s.halaqah,
      targetJuz: s.targetJuz,
      status: s.status,
      noHp: s.noHp || "-",
      alamat: s.alamat || "-",
      avatar: s.avatar || "",
      createdAt: s.createdAt,
      progressJuz,
      totalAyat,
      totalSetoran: s._count.hafalans,
    };
  });
}

export async function getSantrisByHalaqoh(halaqohName: string) {
  const session = await checkAuth();
  const santriWhere = await getSantriAccessWhere(session);

  const santris = await prisma.santri.findMany({
    where: { ...santriWhere, halaqah: halaqohName },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { hafalans: true } },
      hafalans: {
        select: {
          ayatMulai: true,
          ayatAkhir: true,
        },
      },
    },
  });

  return santris.map((s) => {
    const totalAyat = s.hafalans.reduce((sum, h) => sum + Math.max(0, h.ayatAkhir - h.ayatMulai + 1), 0);
    const progressJuz = Math.min(Math.floor(totalAyat / 140), s.targetJuz);
    return {
      id: s.id,
      nama: s.nama,
      halaqah: s.halaqah,
      targetJuz: s.targetJuz,
      status: s.status,
      noHp: s.noHp || "-",
      alamat: s.alamat || "-",
      avatar: s.avatar || "",
      createdAt: s.createdAt,
      progressJuz,
      totalAyat,
      totalSetoran: s._count.hafalans,
    };
  });
}

const santriSchema = z.object({
  nama: z.string().min(3),
  halaqah: z.string().min(1),
  targetJuz: z.number().min(1).max(30),
});

export async function createSantri(data: { nama: string; halaqah: string; targetJuz: number }) {
  const session = await checkAuth();
  requireAdmin(session);

  const adminId = (session.user as any).adminId;

  const parsed = santriSchema.parse(data);
  await prisma.santri.create({
    data: {
      ...parsed,
      adminId,
    },
  });
  revalidatePath("/master-kelas", "layout");
}

const updateSantriSchema = z.object({
  nama: z.string().min(3).optional(),
  halaqah: z.string().min(1).optional(),
  targetJuz: z.number().min(1).max(30).optional(),
  status: z.string().optional(),
});

export async function updateSantri(id: string, data: { nama?: string; halaqah?: string; targetJuz?: number; status?: string }) {
  const session = await checkAuth();
  requireAdmin(session);

  const adminId = (session.user as any).adminId;

  const parsed = updateSantriSchema.parse(data);
  await prisma.santri.update({
    where: { id, adminId },
    data: parsed,
  });
  revalidatePath("/master-kelas", "layout");
}

export async function deleteSantri(id: string) {
  const session = await checkAuth();
  requireAdmin(session);

  const adminId = (session.user as any).adminId;

  await prisma.santri.delete({
    where: { id, adminId },
  });
  revalidatePath("/master-kelas", "layout");
}
