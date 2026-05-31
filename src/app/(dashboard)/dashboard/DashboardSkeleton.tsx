"use client";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-72 bg-gray-200/60 dark:bg-white/[0.06] rounded-xl"></div>
        <div className="h-4 w-48 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg"></div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-24 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg"></div>
                <div className="h-8 w-20 bg-gray-200/60 dark:bg-white/[0.06] rounded-xl"></div>
                <div className="h-3 w-16 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200/60 dark:bg-white/[0.06] rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="card p-6">
            <div className="h-5 w-40 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg mb-6"></div>
            <div className="h-64 bg-gray-200/60 dark:bg-white/[0.06] rounded-xl"></div>
          </div>
        ))}
      </div>

      {/* Activity + Ranking skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="card p-6">
            <div className="h-5 w-48 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200/60 dark:bg-white/[0.06] rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg"></div>
                    <div className="h-3 w-24 bg-gray-200/60 dark:bg-white/[0.06] rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
