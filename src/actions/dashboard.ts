"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";

export async function getDashboardStats() {
  const session = await checkAuth();
  const adminId = (session.user as any).adminId;

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const startOfWeek = new Date(today);
  const utcDay = today.getUTCDay();
  startOfWeek.setUTCDate(today.getUTCDate() - utcDay + (utcDay === 0 ? -6 : 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  // Parallel: all independent queries at once
  const [
    totalSantri,
    setoranHariIni,
    hafalans,
    kehadirans,
    hafalansToday,
    recentActivities,
    santrisWithHafalans,
    newSantriThisMonth,
    newSantriLastMonth,
    setoranThisMonth,
    setoranLastMonth,
  ] = await Promise.all([
    prisma.santri.count({ where: { status: "active", adminId } }),
    prisma.hafalan.count({ where: { createdAt: { gte: today }, santri: { adminId } } }),
    prisma.hafalan.findMany({ where: { createdAt: { gte: startOfLastMonth }, santri: { adminId } } }),
    prisma.kehadiran.findMany({ where: { tanggal: { gte: today }, santri: { adminId } } }),
    prisma.hafalan.findMany({ where: { createdAt: { gte: today }, santri: { adminId } } }),
    prisma.hafalan.findMany({
      where: { santri: { adminId } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { santri: true },
    }),
    prisma.santri.findMany({
      where: { status: "active", adminId },
      include: { hafalans: true },
    }),
    prisma.santri.count({ where: { createdAt: { gte: startOfThisMonth }, adminId } }),
    prisma.santri.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }, adminId } }),
    prisma.hafalan.count({ where: { createdAt: { gte: startOfThisMonth }, santri: { adminId } } }),
    prisma.hafalan.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }, santri: { adminId } } }),
  ]);

  // Rata-rata kualitas
  let mumtazCount = 0;
  hafalans.forEach((h) => {
    const kualitas = h.kualitas.toLowerCase();
    if (kualitas === "mumtaz" || kualitas === "jayyid jiddan" || kualitas === "jayyid-jiddan") {
      mumtazCount++;
    }
  });
  const rataKualitas = hafalans.length > 0 ? Math.round((mumtazCount / hafalans.length) * 100) : 0;

  // Kehadiran
  const hadirSet = new Set<string>();
  kehadirans.forEach(k => {
    if (k.status.toLowerCase() === "hadir") hadirSet.add(k.santriId);
  });
  hafalansToday.forEach(h => hadirSet.add(h.santriId));
  const kehadiranPercent = totalSantri > 0 ? Math.round((hadirSet.size / totalSantri) * 100) : 0;

  // Recent activities
  const activities = recentActivities.map(h => ({
    id: h.id,
    santriNama: h.santri.nama,
    action: h.jenis.toLowerCase() === "ziyadah" ? "Setoran Ziyadah" : "Setoran Muraja'ah",
    detail: `${h.surah} Ayat ${h.ayatMulai}-${h.ayatAkhir} (${h.kualitas})`,
    timestamp: h.createdAt.toISOString(),
    avatar: null,
  }));

  // Top santri
  const topSantri = santrisWithHafalans
    .map(s => {
      const totalAyat = s.hafalans.reduce((sum, h) => sum + Math.max(0, h.ayatAkhir - h.ayatMulai + 1), 0);
      return { id: s.id, nama: s.nama, ayat: totalAyat, skor: totalAyat * 10 };
    })
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 5)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  // Chart data
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
    if (h.tanggal >= startOfWeek && h.tanggal <= endOfWeek) {
      const day = h.tanggal.getUTCDay();
      const jenis = h.jenis.toLowerCase();
      if (jenis === "ziyadah") hafalanChartData[day].ziyadah += 1;
      else hafalanChartData[day].murajaah += 1;
    }

    const kualitas = h.kualitas.toLowerCase();
    if (kualitas === "mumtaz") kualitasChartData[0].value += 1;
    else if (kualitas === "jayyid-jiddan" || kualitas === "jayyid jiddan") kualitasChartData[1].value += 1;
    else if (kualitas === "jayyid") kualitasChartData[2].value += 1;
    else if (kualitas === "maqbul") kualitasChartData[3].value += 1;
    else kualitasChartData[4].value += 1;
  });

  // Percentages
  const totalKualitas = kualitasChartData.reduce((acc, curr) => acc + curr.value, 0);
  if (totalKualitas > 0) {
    let exactVals = kualitasChartData.map(item => (item.value / totalKualitas) * 100);
    let floorVals = exactVals.map(Math.floor);
    let sumFloor = floorVals.reduce((a, b) => a + b, 0);
    let remainders = exactVals.map((val, idx) => ({ idx, rem: val - floorVals[idx] }));
    remainders.sort((a, b) => b.rem - a.rem);
    let diff = 100 - sumFloor;
    for (let i = 0; i < diff; i++) floorVals[remainders[i].idx] += 1;
    kualitasChartData.forEach((item, idx) => { item.value = floorVals[idx]; });
  }

  // Trends
  const trendSantri = newSantriLastMonth === 0 ? (newSantriThisMonth > 0 ? 100 : 0) : Math.round(((newSantriThisMonth - newSantriLastMonth) / newSantriLastMonth) * 100);
  const trendSetoran = setoranLastMonth === 0 ? (setoranThisMonth > 0 ? 100 : 0) : Math.round(((setoranThisMonth - setoranLastMonth) / setoranLastMonth) * 100);

  const hafalansThisMonth = hafalans.filter(h => h.createdAt >= startOfThisMonth);
  const hafalansLastMonth = hafalans.filter(h => h.createdAt >= startOfLastMonth && h.createdAt < startOfThisMonth);
  const isGood = (k: string) => k === "mumtaz" || k === "jayyid jiddan" || k === "jayyid-jiddan";
  const ratKualitasThis = hafalansThisMonth.length > 0 ? hafalansThisMonth.filter(h => isGood(h.kualitas.toLowerCase())).length / hafalansThisMonth.length : 0;
  const ratKualitasLast = hafalansLastMonth.length > 0 ? hafalansLastMonth.filter(h => isGood(h.kualitas.toLowerCase())).length / hafalansLastMonth.length : 0;
  const trendKualitas = ratKualitasLast === 0 ? (ratKualitasThis > 0 ? 100 : 0) : Math.round(((ratKualitasThis - ratKualitasLast) / ratKualitasLast) * 100);

  const shiftedHafalanChart = [...hafalanChartData.slice(1), hafalanChartData[0]];

  return {
    totalSantri,
    setoranHariIni,
    rataKualitas,
    kehadiran: kehadiranPercent,
    trendSantri,
    trendSetoran,
    trendKualitas,
    trendKehadiran: trendSetoran,
    recentActivities: activities,
    topSantri,
    hafalanChartData: shiftedHafalanChart,
    kualitasChartData,
  };
}
