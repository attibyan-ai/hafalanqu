import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}
