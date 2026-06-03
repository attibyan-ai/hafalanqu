import { CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleNotice } from "@/components/shared/RoleNotice";

export default function RiwayatKehadiranPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Kehadiran" subtitle="Rekap kehadiran anak" />
      <RoleNotice
        icon={<CalendarCheck className="h-7 w-7" />}
        title="Data kehadiran belum terhubung"
        description="Akun wali belum memiliki relasi anak di database, sehingga riwayat kehadiran tidak ditampilkan agar data santri lain tetap aman."
      />
    </div>
  );
}
