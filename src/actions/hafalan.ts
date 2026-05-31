"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";
import { z } from "zod";

export async function getRecentHafalan(limit = 10) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  return await prisma.hafalan.findMany({
    where: { santri: { adminId } },
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
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const parsed = hafalanSchema.parse(data);

  const santri = await prisma.santri.findUnique({ where: { id: parsed.santriId } });
  if (!santri || santri.adminId !== adminId) throw new Error("Unauthorized santri");

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
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const hafalan = await prisma.hafalan.findUnique({ where: { id }, include: { santri: true } });
  if (!hafalan || hafalan.santri?.adminId !== adminId) throw new Error("Unauthorized");

  await prisma.hafalan.delete({
    where: { id },
  });
  revalidatePath("/riwayat-hafalan");
}
