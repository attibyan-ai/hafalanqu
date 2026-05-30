"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getRecentTes(limit = 10) {
  return await prisma.tes.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

export async function saveHasilTes(santriId: string, jenis: string, nilai: number) {
  const tes = await prisma.tes.create({
    data: {
      santriId,
      jenis,
      nilai,
      tanggal: new Date(),
    }
  });

  revalidatePath("/tes-hafalan");
  revalidatePath("/dashboard");
  return tes;
}
