import { PageHeader, CardSkeleton, ChartSkeleton } from "@/components/shared";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-gray-200/60 dark:bg-white/[0.06] rounded-xl animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200/60 dark:bg-white/[0.06] rounded-xl animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
