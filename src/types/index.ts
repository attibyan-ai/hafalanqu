// ─── Santri ───
export interface Santri {
  id: string;
  nama: string;
  nis: string;
  halaqah: string;
  noHp: string;
  alamat: string;
  avatar?: string;
  targetJuz: number;
  progressJuz: number;
  joinedAt: string;
  status: "active" | "inactive";
}

// ─── Hafalan ───
export type JenisHafalan = "ziyadah" | "murajaah";

export type KualitasHafalan = "mumtaz" | "jayyid-jiddan" | "jayyid" | "maqbul" | "ghair-maqbul";

export interface Hafalan {
  id: string;
  santriId: string;
  santriNama: string;
  tanggal: string;
  surah: string;
  ayatMulai: number;
  ayatAkhir: number;
  jenis: JenisHafalan;
  kualitas: KualitasHafalan;
  catatan?: string;
  createdAt: string;
}

// ─── Attendance ───
export type StatusKehadiran = "hadir" | "izin" | "sakit" | "alpha";

export interface AttendanceRecord {
  santriId: string;
  santriNama: string;
  tanggal: string;
  status: StatusKehadiran;
}

export interface AttendanceMatrix {
  santriId: string;
  santriNama: string;
  records: Record<string, StatusKehadiran>;
}

// ─── Test ───
export type JenisTes = "sambung-setelah" | "sambung-sebelum" | "tebak-surah" | "susun-ulang";

export interface TesSetting {
  jenis: JenisTes;
  jumlahSoal: number;
  durasi: number; // in minutes
  surah?: string;
  juz?: number;
}

export interface HasilTes {
  id: string;
  santriId: string;
  santriNama: string;
  jenisTes: JenisTes;
  skor: number;
  totalSoal: number;
  benar: number;
  salah: number;
  tanggal: string;
  durasi: number; // seconds taken
}

// ─── User / Profile ───
export type UserRole = "super-admin" | "admin" | "ustadz";

export interface User {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  alamat: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
}

// ─── Dashboard ───
export interface DashboardStats {
  totalSantri: number;
  setoranHariIni: number;
  rataKualitas: number;
  kehadiran: number;
  trendSantri: number;
  trendSetoran: number;
  trendKualitas: number;
  trendKehadiran: number;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

export interface RecentActivity {
  id: string;
  santriNama: string;
  action: string;
  detail: string;
  timestamp: string;
  avatar?: string;
}

// ─── Navigation ───
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

// ─── Settings ───
export interface SystemSettings {
  namaLembaga: string;
  tahunAjaran: string;
  timezone: string;
  bahasa: string;
  notifikasiEmail: boolean;
  notifikasiPush: boolean;
  autoBackup: boolean;
  backupInterval: "daily" | "weekly" | "monthly";
}

// ─── Common ───
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface FilterState {
  search: string;
  [key: string]: string | string[] | undefined;
}
