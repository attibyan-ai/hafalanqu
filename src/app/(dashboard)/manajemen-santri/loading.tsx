import { PageHeader, TableSkeleton } from "@/components/shared";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen Santri" subtitle="Memuat data..." />
      <TableSkeleton />
    </div>
  );
}
