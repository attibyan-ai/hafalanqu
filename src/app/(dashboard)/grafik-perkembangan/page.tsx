import { LineChart } from "lucide-react";
import { getRecentHafalan } from "@/actions/hafalan";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleNotice } from "@/components/shared/RoleNotice";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const dynamic = "force-dynamic";

export default async function GrafikPerkembanganPage() {
  let hafalans;
  try {
    hafalans = await getRecentHafalan(100);
  } catch (error: any) {
    return (
      <div className="space-y-6">
        <PageHeader title="Grafik Perkembangan" subtitle="Perkembangan setoran hafalan pribadi" />
        <RoleNotice
          icon={<LineChart className="h-7 w-7" />}
          title="Grafik belum tersedia"
          description={error.message || "Data perkembangan belum bisa ditampilkan untuk akun ini."}
        />
      </div>
    );
  }

  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
      ayat: 0,
      setoran: 0,
    };
  });

  const bucketMap = new Map(buckets.map((item) => [item.key, item]));
  hafalans.forEach((item) => {
    const tanggal = new Date(item.tanggal);
    const bucket = bucketMap.get(`${tanggal.getFullYear()}-${tanggal.getMonth()}`);
    if (!bucket) return;
    bucket.setoran += 1;
    bucket.ayat += Math.max(0, item.ayatAkhir - item.ayatMulai + 1);
  });

  const maxAyat = Math.max(1, ...buckets.map((item) => item.ayat));
  const totalAyat = buckets.reduce((sum, item) => sum + item.ayat, 0);
  const totalSetoran = buckets.reduce((sum, item) => sum + item.setoran, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Grafik Perkembangan" subtitle="Perkembangan setoran hafalan pribadi" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Ayat 6 Bulan</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{totalAyat}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Setoran 6 Bulan</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{totalSetoran}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-gray-50">Ayat per Bulan</h2>
        <div className="space-y-4">
          {buckets.map((item) => {
            const width = Math.round((item.ayat / maxAyat) * 100);
            return (
              <div key={item.key} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3 text-sm">
                <span className="font-medium text-muted-foreground">{item.label}</span>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                </div>
                <span className="text-right font-semibold text-gray-900 dark:text-gray-50">{item.ayat}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
