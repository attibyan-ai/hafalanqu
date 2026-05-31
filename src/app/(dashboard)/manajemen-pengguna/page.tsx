import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ShieldCheck } from "lucide-react";

export default function ManajemenPenggunaPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Akun" 
        subtitle="Kelola akun guru dan murid di lembaga Anda" 
      />
      <div className="card">
        <EmptyState 
          icon={ShieldCheck} 
          title="Segera Hadir" 
          description="Fitur Manajemen Akun sedang dalam tahap pengembangan." 
        />
      </div>
    </div>
  );
}
