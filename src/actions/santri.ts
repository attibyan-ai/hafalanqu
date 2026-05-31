"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";
import { z } from "zod";

export async function getSantris() {
  const santris = await prisma.santri.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hafalans: true,
    }
  });

  return santris.map((s) => {
    const totalAyat = s.hafalans.reduce((sum, h) => sum + Math.max(0, h.ayatAkhir - h.ayatMulai + 1), 0);
    const progressJuz = Math.min(Math.floor(totalAyat / 140), s.targetJuz);
    return {
      ...s,
      progressJuz,
      targetJuz: s.targetJuz,
      halaqah: s.halaqah,
      noHp: s.noHp || "-",
      alamat: s.alamat || "-",
      avatar: s.avatar || "",
    };
  });
}

const santriSchema = z.object({
  nama: z.string().min(3),
  nis: z.string().min(3),
  halaqah: z.string().min(1),
  targetJuz: z.number().min(1).max(30),
});

export async function createSantri(data: { nama: string; nis: string; halaqah: string; targetJuz: number }) {
  await checkAuth();
  const parsed = santriSchema.parse(data);
  await prisma.santri.create({
    data: parsed,
  });
  revalidatePath("/manajemen-santri");
}

export async function updateSantri(id: string, data: { nama?: string; halaqah?: string; targetJuz?: number; status?: string }) {
  await checkAuth();
  await prisma.santri.update({
    where: { id },
    data,
  });
  revalidatePath("/manajemen-santri");
}

export async function deleteSantri(id: string) {
  await checkAuth();
  await prisma.santri.delete({
    where: { id },
  });
  revalidatePath("/manajemen-santri");
}
