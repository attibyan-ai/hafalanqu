"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";
import { z } from "zod";

export async function getRecentHafalan(limit = 10) {
  return await prisma.hafalan.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

const hafalanSchema = z.object({
  santriId: z.string().min(1),
  surah: z.string().min(1),
  ayatMulai: z.number().min(1),
  ayatAkhir: z.number().min(1),
  jenis: z.string().min(1),
  kualitas: z.string().min(1),
  catatan: z.string().optional(),
  tanggal: z.date().optional()
}).refine(data => data.ayatAkhir >= data.ayatMulai, {
  message: "Ayat akhir harus lebih besar atau sama dengan ayat mulai"
});

export async function createHafalan(data: { santriId: string; surah: string; ayatMulai: number; ayatAkhir: number; jenis: string; kualitas: string; catatan?: string; tanggal?: Date }) {
  await checkAuth();
  const parsed = hafalanSchema.parse(data);

  await prisma.hafalan.create({
    data: {
      santriId: parsed.santriId,
      surah: parsed.surah,
      ayatMulai: parsed.ayatMulai,
      ayatAkhir: parsed.ayatAkhir,
      jenis: parsed.jenis,
      kualitas: parsed.kualitas,
      catatan: parsed.catatan,
      tanggal: parsed.tanggal || new Date(),
    }
  });
  revalidatePath("/riwayat-hafalan");
  revalidatePath("/dashboard");
}

export async function deleteHafalan(id: string) {
  await checkAuth();
  await prisma.hafalan.delete({
    where: { id },
  });
  revalidatePath("/riwayat-hafalan");
}
