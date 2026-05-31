import { getAkunByRole } from "@/actions/akun";
import AkunClient from "./AkunClient";

export const dynamic = "force-dynamic";

export default async function ManajemenUstadzPage() {
  const ustadzList = await getAkunByRole("ustadz");

  return (
    <AkunClient 
      akuns={ustadzList} 
      title="Manajemen Ustadz"
      subtitle="Kelola akun akses untuk para ustadz/guru"
      defaultRole="ustadz"
    />
  );
}
