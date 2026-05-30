"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getRecentHafalan(limit = 10) {
  return await prisma.hafalan.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

export async function createHafalan(data: { santriId: string; surah: string; ayatMulai: number; ayatAkhir: number; jenis: string; kualitas: string; catatan?: string; tanggal?: Date }) {
  await prisma.hafalan.create({
    data: {
      santriId: data.santriId,
      surah: data.surah,
      ayatMulai: data.ayatMulai,
      ayatAkhir: data.ayatAkhir,
      jenis: data.jenis,
      kualitas: data.kualitas,
      catatan: data.catatan,
      tanggal: data.tanggal || new Date(),
    }
  });
  revalidatePath("/riwayat-hafalan");
  revalidatePath("/dashboard");
}

export async function deleteHafalan(id: string) {
  await prisma.hafalan.delete({
    where: { id },
  });
  revalidatePath("/riwayat-hafalan");
}
