"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { revalidatePath } from "next/cache";
import { assertManagedAccountRole, requireAdmin } from "@/lib/access-control";

// Kita gunakan bcryptjs atau hashing sejenis, tapi karena project ini minimal,
// dan sebelumnya create-admin memakai bcryptjs, kita cek apakah ada.
import bcrypt from "bcryptjs";

export async function getAkunByRole(role: string) {
  const session = await checkAuth();
  requireAdmin(session);
  assertManagedAccountRole(role);

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

export async function createAkun(data: { nama: string; email: string; password?: string; role: string; halaqah?: string }) {
  const session = await checkAuth();
  requireAdmin(session);
  assertManagedAccountRole(data.role);

  const adminId = (session.user as any).adminId;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  if (!data.password || data.password.length < 8) {
    throw new Error("Password minimal 8 karakter");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      adminId,
    },
  });

  if (data.role === "santri" && data.halaqah) {
    await prisma.santri.create({
      data: {
        nama: data.nama,
        halaqah: data.halaqah,
        targetJuz: 30,
        adminId,
      }
    });
  }

  revalidatePath("/manajemen-ustadz");
  revalidatePath("/manajemen-santri");
}

export async function updateAkun(id: string, data: { nama: string; email: string; password?: string; role: string; halaqah?: string }) {
  const session = await checkAuth();
  requireAdmin(session);
  assertManagedAccountRole(data.role);

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

  if (data.role === "santri" && data.halaqah) {
    // Attempt to find santri by name and adminId, since we didn't link them by ID
    const santri = await prisma.santri.findFirst({
      where: { nama: existing.nama, adminId }
    });
    if (santri) {
      await prisma.santri.update({
        where: { id: santri.id },
        data: { halaqah: data.halaqah, nama: data.nama }
      });
    }
  }

  revalidatePath("/manajemen-ustadz");
  revalidatePath("/manajemen-santri");
}

export async function deleteAkun(id: string) {
  const session = await checkAuth();
  requireAdmin(session);

  const adminId = (session.user as any).adminId;

  const existing = await prisma.user.findFirst({ where: { id, adminId } });
  if (!existing) throw new Error("Akses ditolak");

  await prisma.user.delete({ where: { id } });

  revalidatePath("/manajemen-ustadz");
  revalidatePath("/manajemen-santri");
}
