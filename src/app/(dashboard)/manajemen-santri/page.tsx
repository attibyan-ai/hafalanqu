import { getAkunByRole } from "@/actions/akun";
import AkunClient from "./AkunClient";

export const dynamic = "force-dynamic";

export default async function ManajemenSantriPage() {
  const santriList = await getAkunByRole("santri");

  return (
    <AkunClient 
      akuns={santriList} 
      title="Manajemen Akun Santri"
      subtitle="Kelola akun akses login untuk para santri"
      defaultRole="santri"
    />
  );
}
