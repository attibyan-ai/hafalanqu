import { getAkun } from "@/actions/akun";
import AkunClient from "./AkunClient";

export const dynamic = "force-dynamic";

export default async function ManajemenPenggunaPage() {
  const akuns = await getAkun();
  return <AkunClient akuns={akuns} />;
}
