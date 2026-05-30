"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getKehadirans(limit = 100) {
  return await prisma.kehadiran.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      santri: true,
    },
  });
}
