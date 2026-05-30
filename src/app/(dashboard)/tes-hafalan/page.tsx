import { getRecentTes } from "@/actions/tes";
import TesHafalanClient from "./TesHafalanClient";

export const dynamic = "force-dynamic";

export default async function TesHafalanPage() {
  const hasilTes = await getRecentTes(50);
  return <TesHafalanClient initialData={hasilTes} />;
}
