import { History } from "lucide-react";
import { getRecentHafalan } from "@/actions/hafalan";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleNotice } from "@/components/shared/RoleNotice";
import { formatDateShort, getKualitasColor, getKualitasLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RiwayatSetoranPage() {
  let hafalans;
  try {
    hafalans = await getRecentHafalan(100);
  } catch (error: any) {
    return (
      <div className="space-y-6">
        <PageHeader title="Riwayat Setoran" subtitle="Daftar setoran hafalan pribadi" />
        <RoleNotice
          icon={<History className="h-7 w-7" />}
          title="Riwayat belum tersedia"
          description={error.message || "Data setoran belum bisa ditampilkan untuk akun ini."}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Setoran" subtitle="Daftar setoran hafalan pribadi" />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50/80 text-muted-foreground dark:bg-white/[0.03]">
              <tr>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Surah</th>
                <th className="px-4 py-3 font-semibold">Ayat</th>
                <th className="px-4 py-3 font-semibold">Jenis</th>
                <th className="px-4 py-3 font-semibold">Kualitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {hafalans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Belum ada setoran hafalan.
                  </td>
                </tr>
              ) : (
                hafalans.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-50">
                      {formatDateShort(item.tanggal.toISOString())}
                    </td>
                    <td className="px-4 py-3">{item.surah}</td>
                    <td className="px-4 py-3">{item.ayatMulai} - {item.ayatAkhir}</td>
                    <td className="px-4 py-3 capitalize">{item.jenis.replace("-", " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getKualitasColor(item.kualitas)}`}>
                        {getKualitasLabel(item.kualitas)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
