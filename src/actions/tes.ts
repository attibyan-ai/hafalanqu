"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";

export async function getRecentTes(limit = 10) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  return await prisma.tes.findMany({
    where: { santri: { adminId } },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

export async function saveHasilTes(santriId: string, jenis: string, nilai: number, target: string) {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const santri = await prisma.santri.findUnique({ where: { id: santriId } });
  if (!santri || santri.adminId !== adminId) throw new Error("Unauthorized santri");

  const tes = await prisma.tes.create({
    data: {
      santriId,
      jenis,
      nilai,
      tanggal: new Date(),
      target: target,
      penguji: "Sistem Otomatis",
      status: nilai >= 70 ? "lulus" : "mengulang",
    }
  });

  revalidatePath("/tes-hafalan");
  revalidatePath("/dashboard");
  return tes;
}
