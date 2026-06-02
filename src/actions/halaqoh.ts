"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { revalidatePath } from "next/cache";

export async function getHalaqoh() {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  return await prisma.halaqah.findMany({
    where: { adminId },
    include: {
      ustadz: { select: { nama: true } }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getHalaqohById(id: string) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const halaqoh = await prisma.halaqah.findFirst({
    where: { id, adminId },
    include: {
      ustadz: { select: { nama: true } }
    },
  });

  if (!halaqoh) throw new Error("Halaqoh tidak ditemukan");
  return halaqoh;
}

export async function createHalaqoh(data: { nama: string; ustadzId?: string }) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const existing = await prisma.halaqah.findFirst({ where: { nama: data.nama, adminId } });
  if (existing) {
    throw new Error("Nama halaqoh sudah ada");
  }

  await prisma.halaqah.create({
    data: {
      nama: data.nama,
      ustadzId: data.ustadzId || null,
      adminId,
    },
  });

  revalidatePath("/master-kelas");
}

export async function updateHalaqoh(id: string, data: { nama: string; ustadzId?: string }) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const existing = await prisma.halaqah.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error("Akses ditolak atau halaqoh tidak ditemukan");

  await prisma.halaqah.update({
    where: { id },
    data: {
      nama: data.nama,
      ustadzId: data.ustadzId || null,
    },
  });

  // Jika nama halaqoh berubah, kita juga bisa memperbarui string `halaqah` pada semua santri terkait
  // (Meskipun sebaiknya memakai ID, tapi karena schema Santri pakai string `halaqah`, kita update)
  if (data.nama !== existing.nama) {
    await prisma.santri.updateMany({
      where: { halaqah: existing.nama, adminId },
      data: { halaqah: data.nama },
    });
  }

  revalidatePath("/master-kelas");
}

export async function deleteHalaqoh(id: string) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const existing = await prisma.halaqah.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error("Akses ditolak");

  // Reset santri yang terkait ke "Umum" sebelum hapus halaqah
  await prisma.santri.updateMany({
    where: { halaqah: existing.nama, adminId },
    data: { halaqah: "Umum" },
  });

  await prisma.halaqah.delete({ where: { id } });

  revalidatePath("/master-kelas");
}
