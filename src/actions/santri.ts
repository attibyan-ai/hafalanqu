"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSantris() {
  return await prisma.santri.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createSantri(data: { nama: string; nis: string; kelas: string; target: number }) {
  await prisma.santri.create({
    data,
  });
  revalidatePath("/manajemen-santri");
}

export async function updateSantri(id: string, data: { nama?: string; kelas?: string; target?: number; status?: string }) {
  await prisma.santri.update({
    where: { id },
    data,
  });
  revalidatePath("/manajemen-santri");
}

export async function deleteSantri(id: string) {
  await prisma.santri.delete({
    where: { id },
  });
  revalidatePath("/manajemen-santri");
}
