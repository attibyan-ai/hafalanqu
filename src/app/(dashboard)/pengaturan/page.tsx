import { getSetting } from "@/actions/pengaturan";
import PengaturanClient from "./PengaturanClient";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const setting = await getSetting();
  
  return <PengaturanClient setting={setting} />;
}
