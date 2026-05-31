"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { revalidatePath } from "next/cache";

// Kita gunakan bcryptjs atau hashing sejenis, tapi karena project ini minimal,
// dan sebelumnya create-admin memakai bcryptjs, kita cek apakah ada.
import bcrypt from "bcryptjs";

export async function getAkunByRole(role: string) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  return await prisma.user.findMany({
    where: { adminId, role },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
      halaqahs: { select: { nama: true } }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAkun(data: { nama: string; email: string; password?: string; role: string }) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  const defaultPassword = data.password || "123456";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await prisma.user.create({
    data: {
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      adminId,
    },
  });

  revalidatePath("/manajemen-ustadz");
  revalidatePath("/manajemen-santri");
}

export async function updateAkun(id: string, data: { nama: string; email: string; password?: string; role: string }) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  // Verifikasi kepemilikan
  const existing = await prisma.user.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error("Akses ditolak atau akun tidak ditemukan");

  const updateData: any = {
    nama: data.nama,
    email: data.email,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/manajemen-ustadz");
  revalidatePath("/manajemen-santri");
}

export async function deleteAkun(id: string) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const existing = await prisma.user.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error("Akses ditolak");

  await prisma.user.delete({ where: { id } });

  revalidatePath("/manajemen-ustadz");
  revalidatePath("/manajemen-santri");
}
