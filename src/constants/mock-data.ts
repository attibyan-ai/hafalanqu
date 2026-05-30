import type {
  Santri,
  Hafalan,
  AttendanceMatrix,
  HasilTes,
  RecentActivity,
  DashboardStats,
  ChartDataPoint,
  User,
} from "@/types";

// ─── Current User ───
export const currentUser: User = {
  id: "u1",
  nama: "Ustadz Ahmad Fauzi",
  email: "ahmad.fauzi@hafalanqu.id",
  noHp: "081234567890",
  alamat: "Jl. Masjid Agung No. 12, Bandung",
  role: "ustadz",
  joinedAt: "2024-08-15",
};

// ─── Santri ───
export const santriList: Santri[] = [
  { id: "s1", nama: "Ahmad Fauzan", nis: "00124", halaqah: "Tahfidz 1", noHp: "081111111111", alamat: "Jl. Kenanga 5", avatar: undefined, targetJuz: 10, progressJuz: 8, joinedAt: "2024-01-15", status: "active" },
  { id: "s2", nama: "Muhammad Iqbal", nis: "00125", halaqah: "Tahfidz 2", noHp: "081222222222", alamat: "Jl. Melati 12", avatar: undefined, targetJuz: 5, progressJuz: 4, joinedAt: "2024-02-10", status: "active" },
  { id: "s3", nama: "Fatimah Azzahra", nis: "00126", halaqah: "Tahfidz 1", noHp: "081333333333", alamat: "Jl. Dahlia 3", avatar: undefined, targetJuz: 15, progressJuz: 12, joinedAt: "2023-08-20", status: "active" },
  { id: "s4", nama: "Aisyah Putri", nis: "00127", halaqah: "Tahfidz 3", noHp: "081444444444", alamat: "Jl. Anggrek 7", avatar: undefined, targetJuz: 8, progressJuz: 6, joinedAt: "2024-03-01", status: "active" },
  { id: "s5", nama: "Umar Abdillah", nis: "00128", halaqah: "Tahfidz 2", noHp: "081555555555", alamat: "Jl. Cempaka 21", avatar: undefined, targetJuz: 12, progressJuz: 9, joinedAt: "2023-09-10", status: "active" },
  { id: "s6", nama: "Khadijah Nurul", nis: "00129", halaqah: "Tahfidz 1", noHp: "081666666666", alamat: "Jl. Mawar 15", avatar: undefined, targetJuz: 20, progressJuz: 15, joinedAt: "2023-06-05", status: "active" },
  { id: "s7", nama: "Abdullah Hakim", nis: "00130", halaqah: "Tahfidz 3", noHp: "081777777777", alamat: "Jl. Tulip 9", avatar: undefined, targetJuz: 6, progressJuz: 3, joinedAt: "2024-05-20", status: "active" },
  { id: "s8", nama: "Zainab Husna", nis: "00131", halaqah: "Tahfidz 2", noHp: "081888888888", alamat: "Jl. Sakura 4", avatar: undefined, targetJuz: 10, progressJuz: 7, joinedAt: "2024-01-08", status: "inactive" },
  { id: "s9", nama: "Bilal Ramadhan", nis: "00132", halaqah: "Tahfidz 1", noHp: "081999999999", alamat: "Jl. Bougenville 18", avatar: undefined, targetJuz: 30, progressJuz: 22, joinedAt: "2022-09-01", status: "active" },
  { id: "s10", nama: "Maryam Salsabila", nis: "00133", halaqah: "Tahfidz 3", noHp: "082000000000", alamat: "Jl. Flamboyan 6", avatar: undefined, targetJuz: 8, progressJuz: 5, joinedAt: "2024-04-12", status: "active" },
];

// ─── Surah list ───
export const surahList = [
  "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr",
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan",
  "Asy-Syu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir",
  "Ya Sin", "As-Saffat", "Sad", "Az-Zumar", "Gafir",
  "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman",
  "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Tagabun", "At-Talaq",
  "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah",
  "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj",
  "At-Tariq", "Al-A'la", "Al-Gasyiyah", "Al-Fajr", "Al-Balad",
  "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin",
  "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
  "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil",
  "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr",
  "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas",
];

// ─── Hafalan History ───
export const hafalanList: Hafalan[] = [
  { id: "h1", santriId: "s1", santriNama: "Ahmad Fauzan", tanggal: "2026-05-28", surah: "Al-Baqarah", ayatMulai: 1, ayatAkhir: 10, jenis: "ziyadah", kualitas: "mumtaz", catatan: "Sangat lancar, tajwid baik", createdAt: "2026-05-28T08:00:00" },
  { id: "h2", santriId: "s3", santriNama: "Fatimah Azzahra", tanggal: "2026-05-28", surah: "Ali 'Imran", ayatMulai: 50, ayatAkhir: 65, jenis: "ziyadah", kualitas: "jayyid-jiddan", catatan: "Perlu perbaikan makhorijul huruf", createdAt: "2026-05-28T08:30:00" },
  { id: "h3", santriId: "s2", santriNama: "Muhammad Iqbal", tanggal: "2026-05-27", surah: "An-Nisa", ayatMulai: 1, ayatAkhir: 15, jenis: "murajaah", kualitas: "jayyid", catatan: "Masih ada beberapa kesalahan", createdAt: "2026-05-27T09:00:00" },
  { id: "h4", santriId: "s5", santriNama: "Umar Abdillah", tanggal: "2026-05-27", surah: "Al-Kahf", ayatMulai: 1, ayatAkhir: 20, jenis: "ziyadah", kualitas: "mumtaz", createdAt: "2026-05-27T09:30:00" },
  { id: "h5", santriId: "s4", santriNama: "Aisyah Putri", tanggal: "2026-05-26", surah: "Maryam", ayatMulai: 1, ayatAkhir: 25, jenis: "ziyadah", kualitas: "jayyid-jiddan", catatan: "Baik secara keseluruhan", createdAt: "2026-05-26T08:15:00" },
  { id: "h6", santriId: "s6", santriNama: "Khadijah Nurul", tanggal: "2026-05-26", surah: "Taha", ayatMulai: 1, ayatAkhir: 30, jenis: "murajaah", kualitas: "mumtaz", createdAt: "2026-05-26T08:45:00" },
  { id: "h7", santriId: "s9", santriNama: "Bilal Ramadhan", tanggal: "2026-05-25", surah: "Ya Sin", ayatMulai: 1, ayatAkhir: 40, jenis: "ziyadah", kualitas: "jayyid", catatan: "Kecepatan perlu diperbaiki", createdAt: "2026-05-25T07:30:00" },
  { id: "h8", santriId: "s7", santriNama: "Abdullah Hakim", tanggal: "2026-05-25", surah: "Al-Mulk", ayatMulai: 1, ayatAkhir: 30, jenis: "ziyadah", kualitas: "maqbul", catatan: "Perlu banyak latihan", createdAt: "2026-05-25T08:00:00" },
  { id: "h9", santriId: "s10", santriNama: "Maryam Salsabila", tanggal: "2026-05-24", surah: "Ar-Rahman", ayatMulai: 1, ayatAkhir: 30, jenis: "murajaah", kualitas: "jayyid-jiddan", createdAt: "2026-05-24T09:00:00" },
  { id: "h10", santriId: "s1", santriNama: "Ahmad Fauzan", tanggal: "2026-05-24", surah: "Al-Baqarah", ayatMulai: 11, ayatAkhir: 25, jenis: "ziyadah", kualitas: "mumtaz", createdAt: "2026-05-24T09:30:00" },
  { id: "h11", santriId: "s3", santriNama: "Fatimah Azzahra", tanggal: "2026-05-23", surah: "Ali 'Imran", ayatMulai: 66, ayatAkhir: 80, jenis: "ziyadah", kualitas: "mumtaz", createdAt: "2026-05-23T08:00:00" },
  { id: "h12", santriId: "s5", santriNama: "Umar Abdillah", tanggal: "2026-05-23", surah: "Al-Kahf", ayatMulai: 21, ayatAkhir: 40, jenis: "ziyadah", kualitas: "jayyid-jiddan", createdAt: "2026-05-23T08:30:00" },
];

// ─── Dashboard Stats ───
export const dashboardStats: DashboardStats = {
  totalSantri: 128,
  setoranHariIni: 24,
  rataKualitas: 85,
  kehadiran: 94,
  trendSantri: 12,
  trendSetoran: 8,
  trendKualitas: 3,
  trendKehadiran: 2,
};

// ─── Chart Data ───
export const hafalanChartData: ChartDataPoint[] = [
  { name: "Sen", ziyadah: 12, murajaah: 8 },
  { name: "Sel", ziyadah: 15, murajaah: 10 },
  { name: "Rab", ziyadah: 8, murajaah: 12 },
  { name: "Kam", ziyadah: 18, murajaah: 14 },
  { name: "Jum", ziyadah: 22, murajaah: 16 },
  { name: "Sab", ziyadah: 10, murajaah: 6 },
  { name: "Min", ziyadah: 5, murajaah: 3 },
];

export const kualitasChartData: ChartDataPoint[] = [
  { name: "Mumtaz", value: 35, fill: "#10B981" },
  { name: "Jayyid Jiddan", value: 28, fill: "#3B82F6" },
  { name: "Jayyid", value: 20, fill: "#0EA5E9" },
  { name: "Maqbul", value: 12, fill: "#F59E0B" },
  { name: "Ghair Maqbul", value: 5, fill: "#EF4444" },
];

export const monthlyHafalanData: ChartDataPoint[] = [
  { name: "Jan", total: 85 },
  { name: "Feb", total: 92 },
  { name: "Mar", total: 78 },
  { name: "Apr", total: 110 },
  { name: "Mei", total: 124 },
  { name: "Jun", total: 98 },
];

// ─── Recent Activity ───
export const recentActivities: RecentActivity[] = [
  { id: "a1", santriNama: "Ahmad Fauzan", action: "Setoran Ziyadah", detail: "Al-Baqarah: 1-10 • Mumtaz", timestamp: "2026-05-28T08:00:00" },
  { id: "a2", santriNama: "Fatimah Azzahra", action: "Setoran Ziyadah", detail: "Ali 'Imran: 50-65 • Jayyid Jiddan", timestamp: "2026-05-28T08:30:00" },
  { id: "a3", santriNama: "Umar Abdillah", action: "Tes Harian", detail: "Skor: 92/100", timestamp: "2026-05-28T09:00:00" },
  { id: "a4", santriNama: "Khadijah Nurul", action: "Murajaah", detail: "Taha: 1-30 • Mumtaz", timestamp: "2026-05-27T08:45:00" },
  { id: "a5", santriNama: "Bilal Ramadhan", action: "Setoran Ziyadah", detail: "Ya Sin: 1-40 • Jayyid", timestamp: "2026-05-27T07:30:00" },
];

// ─── Top Santri ───
export const topSantri = [
  { rank: 1, nama: "Bilal Ramadhan", juz: 22, skor: 96 },
  { rank: 2, nama: "Khadijah Nurul", juz: 15, skor: 94 },
  { rank: 3, nama: "Fatimah Azzahra", juz: 12, skor: 92 },
  { rank: 4, nama: "Umar Abdillah", juz: 9, skor: 90 },
  { rank: 5, nama: "Ahmad Fauzan", juz: 8, skor: 88 },
];

// ─── Attendance Matrix ───
const generateAttendanceRecords = (startDate: string, days: number): Record<string, "hadir" | "izin" | "sakit" | "alpha"> => {
  const records: Record<string, "hadir" | "izin" | "sakit" | "alpha"> = {};
  const statuses: ("hadir" | "izin" | "sakit" | "alpha")[] = ["hadir", "izin", "sakit", "alpha"];
  const weights = [0.85, 0.05, 0.05, 0.05];

  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0) continue; // Skip Sunday

    const rand = Math.random();
    let cumulative = 0;
    let status: "hadir" | "izin" | "sakit" | "alpha" = "hadir";
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (rand <= cumulative) {
        status = statuses[j];
        break;
      }
    }

    const key = date.toISOString().split("T")[0];
    records[key] = status;
  }
  return records;
};

export const attendanceMatrix: AttendanceMatrix[] = santriList
  .filter((s) => s.status === "active")
  .map((s) => ({
    santriId: s.id,
    santriNama: s.nama,
    records: generateAttendanceRecords("2026-05-01", 28),
  }));

// ─── Test Results ───
export const hasilTesList: HasilTes[] = [
  { id: "t1", santriId: "s1", santriNama: "Ahmad Fauzan", jenisTes: "sambung-setelah", skor: 92, totalSoal: 10, benar: 9, salah: 1, tanggal: "2026-05-28", durasi: 420 },
  { id: "t2", santriId: "s3", santriNama: "Fatimah Azzahra", jenisTes: "tebak-surah", skor: 88, totalSoal: 10, benar: 8, salah: 2, tanggal: "2026-05-27", durasi: 380 },
  { id: "t3", santriId: "s5", santriNama: "Umar Abdillah", jenisTes: "sambung-sebelum", skor: 95, totalSoal: 10, benar: 9, salah: 1, tanggal: "2026-05-26", durasi: 350 },
  { id: "t4", santriId: "s9", santriNama: "Bilal Ramadhan", jenisTes: "susun-ulang", skor: 100, totalSoal: 10, benar: 10, salah: 0, tanggal: "2026-05-25", durasi: 300 },
  { id: "t5", santriId: "s6", santriNama: "Khadijah Nurul", jenisTes: "sambung-setelah", skor: 85, totalSoal: 10, benar: 8, salah: 2, tanggal: "2026-05-24", durasi: 450 },
];

// ─── Halaqah ───
export const halaqahList = ["Tahfidz 1", "Tahfidz 2", "Tahfidz 3", "Tahfidz Lanjutan"];
