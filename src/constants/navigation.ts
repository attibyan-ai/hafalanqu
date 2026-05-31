import {
  LayoutDashboard,
  BookOpen,
  History,
  CalendarCheck,
  GraduationCap,
  Users,
  User,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Input Hafalan",
    href: "/input-hafalan",
    icon: BookOpen,
  },
  {
    label: "Riwayat Hafalan",
    href: "/riwayat-hafalan",
    icon: History,
  },
  {
    label: "Daftar Hadir",
    href: "/daftar-hadir",
    icon: CalendarCheck,
  },
  {
    label: "Tes Hafalan",
    href: "/tes-hafalan",
    icon: GraduationCap,
  },
  {
    label: "Manajemen Santri",
    href: "/manajemen-santri",
    icon: Users,
  },
  {
    label: "Profil",
    href: "/profil",
    icon: User,
  },
  {
    label: "Pengaturan",
    href: "/pengaturan",
    icon: Settings,
  },
] as const;

export const mobileNavItems = [
  {
    label: "Beranda",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Hafalan",
    href: "/input-hafalan",
    icon: BookOpen,
  },
  {
    label: "Absen",
    href: "/daftar-hadir",
    icon: CalendarCheck,
  },
  {
    label: "Santri",
    href: "/manajemen-santri",
    icon: Users,
  },
  {
    label: "Menu",
    href: "/pengaturan",
    icon: Settings,
  },
] as const;
