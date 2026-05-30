"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSantris() {
  const santris = await prisma.santri.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hafalans: true,
    }
  });

  return santris.map((s) => {
    // Simplification for progress: sum of unique juz completed?
    // Let's just mock progress based on hafalans count for now.
    const progressJuz = Math.min(Math.floor(s.hafalans.length / 5), s.target);
    return {
      ...s,
      progressJuz,
      targetJuz: s.target,
      halaqah: s.kelas, // map kelas to halaqah for UI
      noHp: "-", // mock
    };
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
