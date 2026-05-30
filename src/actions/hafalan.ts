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

export async function createHafalan(data: { santriId: string; surah: string; ayatMulai: number; ayatSelesai: number; halaman: number; jenis: string; kualitas: string; kelancaran: number; tajwid: number; makhraj: number; catatan: string }) {
  await prisma.hafalan.create({
    data,
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
