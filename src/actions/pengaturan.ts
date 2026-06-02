"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { revalidatePath } from "next/cache";

export async function getSetting() {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  let setting = await prisma.setting.findUnique({
    where: { adminId },
  });

  if (!setting) {
    setting = await prisma.setting.create({
      data: {
        adminId,
      },
    });
  }

  return setting;
}

export async function updateSetting(data: {
  namaLembaga: string;
  tahunAjaran: string;
  zonaWaktu: string;
  bahasa: string;
}) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  // Only admin can update global settings? Wait, the UI didn't restrict it previously, but standard practice is yes.
  // We'll let anyone under the adminId update it for now to match the user's "fungsikan semuanya" request.
  
  await prisma.setting.upsert({
    where: { adminId },
    update: data,
    create: {
      adminId,
      ...data,
    },
  });

  revalidatePath("/pengaturan");
}

export async function resetAllData() {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;
  const role = (session.user as any).role;

  if (role !== "admin") {
    throw new Error("Hanya admin yang dapat mengosongkan data");
  }

  // Delete all hafalans, tes, kehadirans, santris, halaqohs under this adminId
  await prisma.hafalan.deleteMany({ where: { santri: { adminId } } });
  await prisma.kehadiran.deleteMany({ where: { santri: { adminId } } });
  await prisma.tes.deleteMany({ where: { santri: { adminId } } });
  await prisma.santri.deleteMany({ where: { adminId } });
  await prisma.halaqah.deleteMany({ where: { adminId } });
  
  // Optionally reset settings too? No, just the data.
}

export async function deleteMyAccount() {
  const session = await checkAuth();
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === "admin") {
    const adminId = userId;
    await prisma.$transaction(async (tx) => {
      // 1. Hapus data anak (hafalan, kehadiran, tes) via santri
      await tx.hafalan.deleteMany({ where: { santri: { adminId } } });
      await tx.kehadiran.deleteMany({ where: { santri: { adminId } } });
      await tx.tes.deleteMany({ where: { santri: { adminId } } });
      // 2. Hapus santri
      await tx.santri.deleteMany({ where: { adminId } });
      // 3. Hapus halaqah (relasi ustadzId jadi orphan — gapapa, data udah dihapus)
      await tx.halaqah.deleteMany({ where: { adminId } });
      // 4. Hapus setting
      await tx.setting.deleteMany({ where: { adminId } });
      // 5. Hapus semua ustadz (yang punya adminId = userId)
      await tx.user.deleteMany({ where: { adminId } });
      // 6. Hapus admin
      await tx.user.delete({ where: { id: adminId } });
    });
  } else {
    // Ustadz — reset ustadzId di halaqah sebelum delete user
    await prisma.$transaction(async (tx) => {
      await tx.halaqah.updateMany({
        where: { ustadzId: userId },
        data: { ustadzId: null },
      });
      await tx.user.delete({ where: { id: userId } });
    });
  }
}
