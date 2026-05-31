import { getRecentTes } from "@/actions/tes";
import { getSantris } from "@/actions/santri";
import TesHafalanClient from "./TesHafalanClient";

export const dynamic = "force-dynamic";

export default async function TesHafalanPage() {
  const [hasilTes, santris] = await Promise.all([
    getRecentTes(50),
    getSantris(),
  ]);
  return <TesHafalanClient initialData={hasilTes} santris={santris} />;
}
