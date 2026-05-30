"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getKehadirans(limit = 500) {
  return await prisma.kehadiran.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

export async function setKehadiran(santriId: string, tanggal: Date, status: string) {
  // Normalize date to start of day
  const targetDate = new Date(tanggal);
  targetDate.setHours(0, 0, 0, 0);

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
