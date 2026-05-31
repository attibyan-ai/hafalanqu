export default function Loading() {
  return (
    <div className="w-full h-[80vh] flex flex-col gap-6 animate-pulse p-4">
      <div className="h-20 w-1/3 bg-gray-200/60 dark:bg-white/[0.06] rounded-2xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200/60 dark:bg-white/[0.06] rounded-2xl"></div>
        ))}
      </div>
      <div className="h-96 w-full bg-gray-200/60 dark:bg-white/[0.06] rounded-2xl mt-4"></div>
    </div>
  );
}
