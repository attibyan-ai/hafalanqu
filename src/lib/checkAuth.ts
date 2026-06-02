import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  if (!session.user.adminId) {
    // Cari user by ID dulu (lebih reliable daripada email)
    let dbUser = null;
    if (session.user.id) {
      dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    }
    // Fallback ke email kalo ID gak ketemu
    if (!dbUser && session.user?.email) {
      dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (dbUser) {
      (session.user as any).adminId = dbUser.role === "admin" ? dbUser.id : (dbUser.adminId || dbUser.id);
    }
  }

  // Guard against undefined adminId to prevent Prisma fetching ALL records
  if (!(session.user as any).adminId) {
    throw new Error("Sesi tidak valid atau kadaluarsa. Harap logout dan login ulang.");
  }

  return session;
}
