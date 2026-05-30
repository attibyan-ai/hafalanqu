"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  const totalSantri = await prisma.santri.count({
    where: { status: "active" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const setoranHariIni = await prisma.hafalan.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const hafalans = await prisma.hafalan.findMany();
  let mumtazCount = 0;
  hafalans.forEach((h) => {
    if (h.kualitas === "mumtaz" || h.kualitas === "jayyid-jiddan") {
      mumtazCount++;
    }
  });

  const rataKualitas = hafalans.length > 0 ? Math.round((mumtazCount / hafalans.length) * 100) : 0;

  const kehadirans = await prisma.kehadiran.findMany({
    where: {
      tanggal: {
        gte: today,
      },
    },
  });
  
  const hadirCount = kehadirans.filter(k => k.status === "hadir").length;
  const kehadiranPercent = kehadirans.length > 0 ? Math.round((hadirCount / kehadirans.length) * 100) : 100;

  return {
    totalSantri,
    setoranHariIni,
    rataKualitas,
    kehadiran: kehadiranPercent,
    trendSantri: 0,
    trendSetoran: 0,
    trendKualitas: 0,
    trendKehadiran: 0,
  };
}
