import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getKualitasColor(kualitas: string): string {
  const colors: Record<string, string> = {
    mumtaz: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "jayyid-jiddan": "bg-blue-100 text-blue-700 border-blue-200",
    jayyid: "bg-sky-100 text-sky-700 border-sky-200",
    maqbul: "bg-amber-100 text-amber-700 border-amber-200",
    "ghair-maqbul": "bg-red-100 text-red-700 border-red-200",
  };
  return colors[kualitas] || "bg-gray-100 text-gray-700 border-gray-200";
}

export function getKualitasLabel(kualitas: string): string {
  const labels: Record<string, string> = {
    mumtaz: "Mumtaz",
    "jayyid-jiddan": "Jayyid Jiddan",
    jayyid: "Jayyid",
    maqbul: "Maqbul",
    "ghair-maqbul": "Ghair Maqbul",
  };
  return labels[kualitas] || kualitas;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    hadir: "bg-emerald-500",
    izin: "bg-amber-400",
    sakit: "bg-blue-400",
    udzur: "bg-purple-400",
    alpha: "bg-red-500",
  };
  return colors[status] || "bg-gray-400";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    hadir: "Hadir",
    izin: "Izin",
    sakit: "Sakit",
    udzur: "Udzur",
    alpha: "Alpha",
  };
  return labels[status] || status;
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    "super-admin": "bg-purple-100 text-purple-700 border-purple-200",
    admin: "bg-blue-100 text-blue-700 border-blue-200",
    ustadz: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return colors[role] || "bg-gray-100 text-gray-700 border-gray-200";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    "super-admin": "Super Admin",
    admin: "Admin",
    ustadz: "Ustadz",
  };
  return labels[role] || role;
}
