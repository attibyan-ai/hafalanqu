import { getSantris } from "@/actions/santri";
import ManajemenSantriClient from "./ManajemenSantriClient";

export const dynamic = "force-dynamic";

export default async function ManajemenSantriPage() {
  const santris = await getSantris();

  return <ManajemenSantriClient initialData={santris} />;
}
