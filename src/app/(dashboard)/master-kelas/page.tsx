import { getHalaqoh } from "@/actions/halaqoh";
import { getAkunByRole } from "@/actions/akun";
import MasterKelasClient from "./MasterKelasClient";

export const dynamic = "force-dynamic";

export default async function MasterKelasPage() {
  const halaqohs = await getHalaqoh();
  const ustadzList = await getAkunByRole("ustadz");
  
  return <MasterKelasClient halaqohs={halaqohs} ustadzList={ustadzList} />;
}
