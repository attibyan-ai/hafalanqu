import { FileBarChart2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleNotice } from "@/components/shared/RoleNotice";

export default function LaporanAnakPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Hafalan Anak" subtitle="Ringkasan perkembangan hafalan anak" />
      <RoleNotice
        icon={<FileBarChart2 className="h-7 w-7" />}
        title="Data anak belum terhubung"
        description="Akun wali belum memiliki relasi anak di database, sehingga laporan tidak ditampilkan agar data santri lain tetap aman."
      />
    </div>
  );
}
