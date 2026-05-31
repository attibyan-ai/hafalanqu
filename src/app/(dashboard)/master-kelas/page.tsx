import { getHalaqoh } from "@/actions/halaqoh";
import { getAkun } from "@/actions/akun";
import MasterKelasClient from "./MasterKelasClient";

export const dynamic = "force-dynamic";

export default async function MasterKelasPage() {
  const halaqohs = await getHalaqoh();
  const akuns = await getAkun();
  const ustadzList = akuns.filter(a => a.role === "ustadz");
  
  return <MasterKelasClient halaqohs={halaqohs} ustadzList={ustadzList} />;
}
