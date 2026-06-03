"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/checkAuth";
import { getSantriAccessWhere } from "@/lib/access-control";

export async function getRecentTes(limit = 10) {
  const session = await checkAuth();
  const santriWhere = await getSantriAccessWhere(session);

  return await prisma.tes.findMany({
    where: { santri: santriWhere },
    take: Math.min(Math.max(limit, 1), 100),
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}

export async function saveHasilTes(santriId: string, jenis: string, nilai: number, target: string) {
  const session = await checkAuth();
  const santriWhere = await getSantriAccessWhere(session);

  const santri = await prisma.santri.findFirst({
    where: { id: santriId, ...santriWhere },
  });
  if (!santri) throw new Error("Unauthorized santri");

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
