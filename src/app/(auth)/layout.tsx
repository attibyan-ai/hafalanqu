export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
