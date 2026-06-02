import { getAkunByRole } from "@/actions/akun";
import { getHalaqoh } from "@/actions/halaqoh";
import AkunClient from "./AkunClient";

export const dynamic = "force-dynamic";

export default async function ManajemenSantriPage() {
  const santriList = await getAkunByRole("santri");
  const halaqohList = await getHalaqoh();

  return (
    <AkunClient 
      akuns={santriList} 
      title="Manajemen Akun Santri"
      subtitle="Kelola akun akses login untuk para santri"
      defaultRole="santri"
      halaqohList={halaqohList.map(h => h.nama)}
    />
  );
}
