import { getRecentHafalan } from "@/actions/hafalan";
import RiwayatHafalanClient from "./RiwayatHafalanClient";

export const dynamic = "force-dynamic";

export default async function RiwayatHafalanPage() {
  const hafalans = await getRecentHafalan(100);
  return <RiwayatHafalanClient initialData={hafalans} />;
}
