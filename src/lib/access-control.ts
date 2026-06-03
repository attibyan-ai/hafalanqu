import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

const NO_ACCESS_OBJECT_ID = "000000000000000000000000";
const MANAGED_ACCOUNT_ROLES = new Set(["ustadz", "santri"]);

export function getSessionRole(session: Session) {
  return session.user.role;
}

export function getSessionAdminId(session: Session) {
  const adminId = session.user.adminId;
  if (!adminId) {
    throw new Error("Sesi tidak valid. Harap login ulang.");
  }
  return adminId;
}

export function requireAdmin(session: Session) {
  if (getSessionRole(session) !== "admin") {
    throw new Error("Hanya admin yang dapat mengakses fitur ini");
  }
}

export function requireRole(session: Session, allowedRoles: string[]) {
  if (!allowedRoles.includes(getSessionRole(session))) {
    throw new Error("Anda tidak memiliki akses ke fitur ini");
  }
}

export function assertManagedAccountRole(role: string) {
  if (!MANAGED_ACCOUNT_ROLES.has(role)) {
    throw new Error("Role akun tidak valid");
  }
}

export async function getSantriAccessWhere(session: Session) {
  const adminId = getSessionAdminId(session);
  const role = getSessionRole(session);

  if (role === "santri") {
    const nama = session.user.name?.trim();
    if (!nama) {
      throw new Error("Profil santri tidak valid. Harap hubungi admin.");
    }
    const matches = await prisma.santri.findMany({
      where: { adminId, nama },
      select: { id: true },
      take: 2,
    });

    if (matches.length !== 1) {
      throw new Error("Akun santri belum terhubung unik dengan data santri. Hubungi admin.");
    }

    return { adminId, id: matches[0].id };
  }

  if (role === "wali") {
    return { adminId, id: NO_ACCESS_OBJECT_ID };
  }

  return { adminId };
}
