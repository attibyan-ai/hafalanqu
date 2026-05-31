import { getHalaqohById } from "@/actions/halaqoh";
import { getSantrisByHalaqoh } from "@/actions/santri";
import HalaqohDetailClient from "./HalaqohDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HalaqohDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const halaqoh = await getHalaqohById(id);
    const santris = await getSantrisByHalaqoh(halaqoh.nama);
    
    return <HalaqohDetailClient halaqoh={halaqoh} initialData={santris} />;
  } catch (error) {
    return notFound();
  }
}
