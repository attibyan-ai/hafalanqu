import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function methodNotAllowed() {
  return NextResponse.json(
    { error: "Gunakan POST dengan secret di body atau header, bukan query URL." },
    { status: 405 }
  );
}

async function readSecret(req: NextRequest) {
  const headerSecret = req.headers.get("x-reset-secret");
  if (headerSecret) return headerSecret;

  try {
    const body = await req.json();
    return typeof body?.secret === "string" ? body.secret : null;
  } catch {
    return null;
  }
}

export async function GET() {
  return methodNotAllowed();
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const secureSecret = process.env.RESET_DB_SECRET;
  if (!secureSecret) {
    return NextResponse.json(
      { error: "RESET_DB_SECRET belum dikonfigurasi di server." },
      { status: 503 }
    );
  }

  const secret = await readSecret(req);
  if (!secret || secret !== secureSecret) {
    return NextResponse.json(
      { error: "Akses Ditolak: Secret Key salah!" },
      { status: 401 }
    );
  }

  const adminId = (session.user as any).id;

  try {
    await prisma.hafalan.deleteMany({ where: { santri: { adminId } } });
    await prisma.kehadiran.deleteMany({ where: { santri: { adminId } } });
    await prisma.tes.deleteMany({ where: { santri: { adminId } } });
    await prisma.santri.deleteMany({ where: { adminId } });
    await prisma.halaqah.deleteMany({ where: { adminId } });
    await prisma.setting.deleteMany({ where: { adminId } });
    await prisma.user.deleteMany({ where: { adminId } });

    return NextResponse.json({
      success: true,
      message: "Data lembaga berhasil di-reset. Akun admin utama tidak dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus data", details: error.message },
      { status: 500 }
    );
  }
}
