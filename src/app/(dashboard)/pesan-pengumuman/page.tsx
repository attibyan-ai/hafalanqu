import { Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleNotice } from "@/components/shared/RoleNotice";

export default function PesanPengumumanPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pesan & Pengumuman" subtitle="Informasi dari lembaga" />
      <RoleNotice
        icon={<Bell className="h-7 w-7" />}
        title="Belum ada pengumuman"
        description="Pengumuman untuk wali akan muncul setelah modul pesan ditambahkan oleh admin lembaga."
      />
    </div>
  );
}
