"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";

export async function getKehadirans(limit = 500) {
  return await prisma.kehadiran.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

export async function setKehadiran(santriId: string, tanggalStr: string, status: string) {
  await checkAuth();
  // Use YYYY-MM-DD string to ensure date is parsed as UTC midnight
  const targetDate = new Date(tanggalStr);

  // Find existing record for that day
  const existing = await prisma.kehadiran.findFirst({
    where: {
      santriId,
      tanggal: {
        gte: targetDate,
        lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  });

  if (existing) {
    await prisma.kehadiran.update({
      where: { id: existing.id },
      data: { status }
    });
  } else {
    await prisma.kehadiran.create({
      data: {
        santriId,
        tanggal: targetDate,
        status
      }
    });
  }
  revalidatePath("/daftar-hadir");
  revalidatePath("/dashboard");
}

export async function deleteKehadiran(santriId: string, tanggalStr: string) {
  await checkAuth();
  const targetDate = new Date(tanggalStr);
  const existing = await prisma.kehadiran.findFirst({
    where: {
      santriId,
      tanggal: {
        gte: targetDate,
        lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  });

  if (existing) {
    await prisma.kehadiran.delete({
      where: { id: existing.id }
    });
  }
  revalidatePath("/daftar-hadir");
  revalidatePath("/dashboard");
}
