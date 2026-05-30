import { getRecentHafalan } from "@/actions/hafalan";
import RiwayatHafalanClient from "./RiwayatHafalanClient";

export const dynamic = "force-dynamic";

export default async function RiwayatHafalanPage() {
  // Ambil data hafalan dari database, mungkin lebih dari 10 (misal 100 untuk riwayat)
  const hafalans = await getRecentHafalan(100);
  return <RiwayatHafalanClient initialData={hafalans} />;
}
