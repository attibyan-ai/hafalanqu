import {
  LayoutDashboard,
  BookOpen,
  History,
  CalendarCheck,
  GraduationCap,
  Users,
  User,
  Settings,
  ShieldCheck,
  BookOpenCheck,
  ClipboardList,
  FileBarChart2,
  Bell,
  LineChart,
} from "lucide-react";

export type UserRole = "admin" | "ustadz" | "santri" | "wali";

export interface NavigationItem {
  label: string;
  href: string;
  icon: any;
  allowedRoles: UserRole[];
}

export const navigationItems: readonly NavigationItem[] = [
  // Dashboard untuk semua role
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "ustadz", "santri", "wali"],
  },

  // Menu Admin
  {
    label: "Manajemen Ustadz",
    href: "/manajemen-ustadz",
    icon: ShieldCheck,
    allowedRoles: ["admin"],
  },
  {
    label: "Manajemen Santri",
    href: "/manajemen-santri",
    icon: Users,
    allowedRoles: ["admin"],
  },
  {
    label: "Manajemen Halaqoh",
    href: "/master-kelas",
    icon: ClipboardList,
    allowedRoles: ["admin"],
  },
  {
    label: "Laporan Global",
    href: "/laporan-global",
    icon: FileBarChart2,
    allowedRoles: ["admin"],
  },

  // Menu Ustadz / Admin / Santri Shared
  {
    label: "Input Hafalan",
    href: "/input-hafalan",
    icon: BookOpen,
    allowedRoles: ["ustadz"],
  },
  {
    label: "Riwayat Hafalan",
    href: "/riwayat-hafalan",
    icon: History,
    allowedRoles: ["ustadz"],
  },
  {
    label: "Daftar Hadir",
    href: "/daftar-hadir",
    icon: CalendarCheck,
    allowedRoles: ["ustadz"],
  },
  {
    label: "Tes Hafalan",
    href: "/tes-hafalan",
    icon: GraduationCap,
    allowedRoles: ["ustadz", "santri"],
  },

  // Menu Santri
  {
    label: "Pencapaian Hafalan",
    href: "/target-hafalan",
    icon: BookOpenCheck,
    allowedRoles: ["santri"],
  },
  {
    label: "Riwayat Setoran",
    href: "/riwayat-setoran",
    icon: History,
    allowedRoles: ["santri"],
  },
  {
    label: "Grafik Perkembangan",
    href: "/grafik-perkembangan",
    icon: LineChart,
    allowedRoles: ["santri"],
  },

  // Menu Wali
  {
    label: "Laporan Hafalan Anak",
    href: "/laporan-anak",
    icon: FileBarChart2,
    allowedRoles: ["wali"],
  },
  {
    label: "Riwayat Kehadiran",
    href: "/riwayat-kehadiran",
    icon: CalendarCheck,
    allowedRoles: ["wali"],
  },
  {
    label: "Pesan & Pengumuman",
    href: "/pesan-pengumuman",
    icon: Bell,
    allowedRoles: ["wali"],
  },

  // General Shared Menus
  {
    label: "Profil",
    href: "/profil",
    icon: User,
    allowedRoles: ["admin", "ustadz", "santri", "wali"],
  },
  {
    label: "Pengaturan",
    href: "/pengaturan",
    icon: Settings,
    allowedRoles: ["admin", "ustadz", "santri", "wali"],
  },
];

export const mobileNavItems: readonly NavigationItem[] = [
  {
    label: "Beranda",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "ustadz", "santri", "wali"],
  },
  {
    label: "Hafalan",
    href: "/input-hafalan",
    icon: BookOpen,
    allowedRoles: ["ustadz"],
  },
  {
    label: "Pencapaian",
    href: "/target-hafalan",
    icon: BookOpenCheck,
    allowedRoles: ["santri"],
  },
  {
    label: "Laporan Anak",
    href: "/laporan-anak",
    icon: FileBarChart2,
    allowedRoles: ["wali"],
  },
  {
    label: "Absen",
    href: "/daftar-hadir",
    icon: CalendarCheck,
    allowedRoles: ["ustadz"],
  },
  {
    label: "Profil",
    href: "/profil",
    icon: User,
    allowedRoles: ["admin", "ustadz", "santri", "wali"],
  },
];
