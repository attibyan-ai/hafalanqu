import { getKehadirans } from "@/actions/kehadiran";
import { getSantris } from "@/actions/santri";
import { prisma } from "@/lib/prisma";
import DaftarHadirClient from "./DaftarHadirClient";

export const dynamic = "force-dynamic";

export default async function DaftarHadirPage() {
  const [kehadirans, santris, hafalans] = await Promise.all([
    getKehadirans(),
    getSantris(),
    prisma.hafalan.findMany({
      orderBy: { createdAt: "desc" },
    })
  ]);
  return <DaftarHadirClient initialData={kehadirans} santris={santris} hafalans={hafalans} />;
}
