import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProfilClient from "./ProfilClient";
import { prisma } from "@/lib/prisma";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  
  let dbUser = null;
  if (session?.user && (session.user as any).id) {
    dbUser = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });
  }

  return <ProfilClient user={dbUser || session?.user} />;
}
