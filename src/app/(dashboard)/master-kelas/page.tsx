"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClipboardList } from "lucide-react";

export default function MasterKelasPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Halaqoh" 
        subtitle="Kelola data halaqoh dan pembimbing" 
      />
      <div className="card">
        <EmptyState 
          icon={ClipboardList} 
          title="Segera Hadir" 
          description="Fitur Manajemen Halaqoh sedang dalam tahap pengembangan." 
        />
      </div>
    </div>
  );
}
