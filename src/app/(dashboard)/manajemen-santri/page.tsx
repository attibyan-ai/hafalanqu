import { getSantris } from "@/actions/santri";
import { getHalaqoh } from "@/actions/halaqoh";
import ManajemenSantriClient from "./ManajemenSantriClient";

export const dynamic = "force-dynamic";

export default async function ManajemenSantriPage() {
  const santriList = await getSantris();
  const halaqohs = await getHalaqoh();
  const halaqahNames = halaqohs.map(h => h.nama);

  return (
    <ManajemenSantriClient 
      initialData={santriList} 
      halaqahList={halaqahNames}
    />
  );
}
