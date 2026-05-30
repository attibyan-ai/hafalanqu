import { getSantris } from "@/actions/santri";
import InputHafalanClient from "./InputHafalanClient";

export const dynamic = "force-dynamic";

export default async function InputHafalanPage() {
  const santris = await getSantris();
  return <InputHafalanClient initialSantris={santris} />;
}
