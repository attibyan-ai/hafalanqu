import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProfilClient from "./ProfilClient";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  return <ProfilClient user={session?.user} />;
}
