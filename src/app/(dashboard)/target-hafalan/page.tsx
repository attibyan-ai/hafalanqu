import { BookOpenCheck, Layers3, Percent, Target } from "lucide-react";
import { getSantris } from "@/actions/santri";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleNotice } from "@/components/shared/RoleNotice";

export const dynamic = "force-dynamic";

export default async function TargetHafalanPage() {
  let santris;
  try {
    santris = await getSantris();
  } catch (error: any) {
    return (
      <div className="space-y-6">
        <PageHeader title="Pencapaian Hafalan" subtitle="Ringkasan target dan capaian hafalan" />
        <RoleNotice
          icon={<BookOpenCheck className="h-7 w-7" />}
          title="Data santri belum terhubung"
          description={error.message || "Akun ini belum memiliki data santri yang bisa ditampilkan."}
        />
      </div>
    );
  }

  const santri = santris[0];
  if (!santri) {
    return (
      <div className="space-y-6">
        <PageHeader title="Pencapaian Hafalan" subtitle="Ringkasan target dan capaian hafalan" />
        <RoleNotice
          icon={<BookOpenCheck className="h-7 w-7" />}
          title="Belum ada data hafalan"
          description="Data pencapaian akan muncul setelah admin menghubungkan akun dengan data santri."
        />
      </div>
    );
  }

  const progressPercent = santri.targetJuz > 0
    ? Math.min(100, Math.round((santri.progressJuz / santri.targetJuz) * 100))
    : 0;

  const stats = [
    { label: "Target Juz", value: santri.targetJuz, icon: Target },
    { label: "Capaian Juz", value: santri.progressJuz, icon: BookOpenCheck },
    { label: "Total Ayat", value: santri.totalAyat, icon: Layers3 },
    { label: "Progres", value: `${progressPercent}%`, icon: Percent },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pencapaian Hafalan"
        subtitle={`Ringkasan capaian ${santri.nama}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Progres Target</h2>
            <p className="text-sm text-muted-foreground">{santri.halaqah} - status {santri.status}</p>
          </div>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary">
            {progressPercent}%
          </span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
