"use server";

import { PrismaClient } from "@prisma/client";
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
