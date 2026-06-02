import { getLaporanGlobal } from "@/actions/laporan";
import LaporanGlobalClient from "./LaporanGlobalClient";

export const dynamic = "force-dynamic";

export default async function LaporanGlobalPage() {
  const laporanData = await getLaporanGlobal();
  
  return <LaporanGlobalClient initialData={laporanData} />;
}
