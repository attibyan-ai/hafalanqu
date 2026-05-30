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
    const kualitas = h.kualitas.toLowerCase();
    if (kualitas === "mumtaz" || kualitas === "jayyid jiddan" || kualitas === "jayyid-jiddan") {
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
  
  const hadirCount = kehadirans.filter(k => k.status.toLowerCase() === "hadir").length;
  const kehadiranPercent = kehadirans.length > 0 ? Math.round((hadirCount / kehadirans.length) * 100) : 0;

  const recentActivities = await prisma.hafalan.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { santri: true },
  }).then(hafalans => hafalans.map(h => ({
    id: h.id,
    santriNama: h.santri.nama,
    action: h.jenis.toLowerCase() === "ziyadah" ? "Setoran Ziyadah" : "Setoran Muraja'ah",
    detail: `${h.surah} Ayat ${h.ayatMulai}-${h.ayatAkhir} (${h.kualitas})`,
    timestamp: h.createdAt.toISOString(),
    avatar: null
  })));

  const santris = await prisma.santri.findMany({
    include: { hafalans: true }
  });

  const topSantri = santris
    .map(s => {
      // Simplification: assume 1 juz = ~20 pages or similar. Just using target for now.
      return {
        id: s.id,
        nama: s.nama,
        juz: s.target,
        skor: s.hafalans.length * 10,
      };
    })
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 5)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  // Calculate real chart data
  const hafalanChartData = [
    { name: 'Min', ziyadah: 0, murajaah: 0 },
    { name: 'Sen', ziyadah: 0, murajaah: 0 },
    { name: 'Sel', ziyadah: 0, murajaah: 0 },
    { name: 'Rab', ziyadah: 0, murajaah: 0 },
    { name: 'Kam', ziyadah: 0, murajaah: 0 },
    { name: 'Jum', ziyadah: 0, murajaah: 0 },
    { name: 'Sab', ziyadah: 0, murajaah: 0 },
  ];

  const kualitasChartData = [
    { name: 'Mumtaz', value: 0, fill: '#0F7B53' },
    { name: 'Jayyid Jiddan', value: 0, fill: '#3B82F6' },
    { name: 'Jayyid', value: 0, fill: '#0EA5E9' },
    { name: 'Maqbul', value: 0, fill: '#F59E0B' },
    { name: 'Ghair Maqbul', value: 0, fill: '#EF4444' },
  ];

  hafalans.forEach((h) => {
    // 1. Fill hafalanChartData
    const day = h.tanggal.getDay(); // 0 is Sunday
    const jenis = h.jenis.toLowerCase();
    if (jenis === "ziyadah") {
      hafalanChartData[day].ziyadah += 1;
    } else {
      hafalanChartData[day].murajaah += 1;
    }

    // 2. Fill kualitasChartData
    const kualitas = h.kualitas.toLowerCase();
    if (kualitas === "mumtaz") kualitasChartData[0].value += 1;
    else if (kualitas === "jayyid jiddan" || kualitas === "jayyid-jiddan") kualitasChartData[1].value += 1;
    else if (kualitas === "jayyid") kualitasChartData[2].value += 1;
    else if (kualitas === "maqbul") kualitasChartData[3].value += 1;
    else kualitasChartData[4].value += 1;
  });

  // Reorder chart data to start from Monday to Sunday for UI consistency (if needed)
  // Let's shift Sunday (index 0) to the end
  const shiftedHafalanChart = [...hafalanChartData.slice(1), hafalanChartData[0]];

  return {
    totalSantri,
    setoranHariIni,
    rataKualitas,
    kehadiran: kehadiranPercent,
    trendSantri: 0,
    trendSetoran: 0,
    trendKualitas: 0,
    trendKehadiran: 0,
    recentActivities,
    topSantri,
    hafalanChartData: shiftedHafalanChart,
    kualitasChartData,
  };
}
