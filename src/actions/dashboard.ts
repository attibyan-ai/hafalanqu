"use server";

import { prisma } from "@/lib/prisma";

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
  
  // A santri is present if they have a 'hadir' status in Kehadirans OR they have a hafalan today.
  const hadirSet = new Set<string>();
  
  kehadirans.forEach(k => {
    if (k.status.toLowerCase() === "hadir") {
      hadirSet.add(k.santriId);
    }
  });

  const hafalansToday = await prisma.hafalan.findMany({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  hafalansToday.forEach(h => {
    hadirSet.add(h.santriId);
  });

  const kehadiranPercent = totalSantri > 0 ? Math.round((hadirSet.size / totalSantri) * 100) : 0;

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
      // Calculate total ayat memorized
      const totalAyat = s.hafalans.reduce((sum, h) => {
        // Calculate ayat diff: (ayatAkhir - ayatMulai) + 1
        const ayatCount = Math.max(0, h.ayatAkhir - h.ayatMulai + 1);
        return sum + ayatCount;
      }, 0);

      // Score can be based on total ayat * 10 or similar
      const skor = totalAyat * 10;

      return {
        id: s.id,
        nama: s.nama,
        ayat: totalAyat,
        skor: skor,
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

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
  startOfWeek.setHours(0,0,0,0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);

  hafalans.forEach((h) => {
    // 1. Fill hafalanChartData (only for current week)
    if (h.tanggal >= startOfWeek && h.tanggal <= endOfWeek) {
      const day = h.tanggal.getDay(); // 0 is Sunday
      const jenis = h.jenis.toLowerCase();
      if (jenis === "ziyadah") {
        hafalanChartData[day].ziyadah += 1;
      } else {
        hafalanChartData[day].murajaah += 1;
      }
    }

    // 2. Fill kualitasChartData
    const kualitas = h.kualitas.toLowerCase();
    if (kualitas === "mumtaz") kualitasChartData[0].value += 1;
    else if (kualitas === "jayyid-jiddan" || kualitas === "jayyid jiddan") kualitasChartData[1].value += 1;
    else if (kualitas === "jayyid") kualitasChartData[2].value += 1;
    else if (kualitas === "maqbul") kualitasChartData[3].value += 1;
    else kualitasChartData[4].value += 1;
  });

  // 3. Convert kualitasChartData to percentages with remainder distribution
  const totalKualitas = kualitasChartData.reduce((acc, curr) => acc + curr.value, 0);
  if (totalKualitas > 0) {
    let exactVals = kualitasChartData.map(item => (item.value / totalKualitas) * 100);
    let floorVals = exactVals.map(Math.floor);
    let sumFloor = floorVals.reduce((a, b) => a + b, 0);
    let remainders = exactVals.map((val, idx) => ({ idx, rem: val - floorVals[idx] }));
    remainders.sort((a, b) => b.rem - a.rem);
    
    let diff = 100 - sumFloor;
    for (let i = 0; i < diff; i++) {
      floorVals[remainders[i].idx] += 1;
    }
    
    kualitasChartData.forEach((item, idx) => {
      item.value = floorVals[idx];
    });
  }

  // Calculate Trends (comparing this month to last month)
  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  // 1. Trend Santri (just new santris this month vs last month)
  const newSantriThisMonth = await prisma.santri.count({
    where: { createdAt: { gte: startOfThisMonth } }
  });
  const newSantriLastMonth = await prisma.santri.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } }
  });
  const trendSantri = newSantriLastMonth === 0 ? (newSantriThisMonth > 0 ? 100 : 0) : Math.round(((newSantriThisMonth - newSantriLastMonth) / newSantriLastMonth) * 100);

  // 2. Trend Setoran
  const setoranThisMonth = await prisma.hafalan.count({
    where: { createdAt: { gte: startOfThisMonth } }
  });
  const setoranLastMonth = await prisma.hafalan.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } }
  });
  const trendSetoran = setoranLastMonth === 0 ? (setoranThisMonth > 0 ? 100 : 0) : Math.round(((setoranThisMonth - setoranLastMonth) / setoranLastMonth) * 100);

  // 3. Trend Kualitas
  const hafalansThisMonth = hafalans.filter(h => h.createdAt >= startOfThisMonth);
  const hafalansLastMonth = hafalans.filter(h => h.createdAt >= startOfLastMonth && h.createdAt < startOfThisMonth);
  const ratKualitasThis = hafalansThisMonth.length > 0 ? hafalansThisMonth.filter(h => h.kualitas.toLowerCase().includes("mumtaz") || h.kualitas.toLowerCase().includes("jayyid jiddan") || h.kualitas.toLowerCase().includes("jayyid-jiddan")).length / hafalansThisMonth.length : 0;
  const ratKualitasLast = hafalansLastMonth.length > 0 ? hafalansLastMonth.filter(h => h.kualitas.toLowerCase().includes("mumtaz") || h.kualitas.toLowerCase().includes("jayyid jiddan") || h.kualitas.toLowerCase().includes("jayyid-jiddan")).length / hafalansLastMonth.length : 0;
  const trendKualitas = ratKualitasLast === 0 ? (ratKualitasThis > 0 ? 100 : 0) : Math.round(((ratKualitasThis - ratKualitasLast) / ratKualitasLast) * 100);

  // 4. Trend Kehadiran (approximate by hafalans)
  const trendKehadiran = trendSetoran; // It requires complex cross-joining Kehadirans and Hafalans by day which is too expensive. We fallback to setoran trend.

  // Reorder chart data to start from Monday to Sunday
  const shiftedHafalanChart = [...hafalanChartData.slice(1), hafalanChartData[0]];

  return {
    totalSantri,
    setoranHariIni,
    rataKualitas,
    kehadiran: kehadiranPercent,
    trendSantri,
    trendSetoran,
    trendKualitas,
    trendKehadiran,
    recentActivities,
    topSantri,
    hafalanChartData: shiftedHafalanChart,
    kualitasChartData,
  };
}
