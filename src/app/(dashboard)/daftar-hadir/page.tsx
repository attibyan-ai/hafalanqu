import { getKehadirans } from "@/actions/kehadiran";
import { getSantris } from "@/actions/santri";
import DaftarHadirClient from "./DaftarHadirClient";

export const dynamic = "force-dynamic";

export default async function DaftarHadirPage() {
  const [kehadirans, santris] = await Promise.all([
    getKehadirans(),
    getSantris()
  ]);
  return <DaftarHadirClient initialData={kehadirans} santris={santris} />;
}
