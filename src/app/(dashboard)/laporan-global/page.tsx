"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { FileBarChart2 } from "lucide-react";

export default function LaporanGlobalPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan Global" 
        subtitle="Lihat laporan performa seluruh santri di lembaga" 
      />
      <div className="card">
        <EmptyState 
          icon={FileBarChart2} 
          title="Segera Hadir" 
          description="Fitur Laporan Global sedang dalam tahap pengembangan." 
        />
      </div>
    </div>
  );
}
