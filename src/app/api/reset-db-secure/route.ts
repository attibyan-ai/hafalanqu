import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Role check: hanya admin yang bisa akses
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  const SECURE_SECRET = process.env.NEXTAUTH_SECRET || "secret1234567890";

  if (!secret || secret !== SECURE_SECRET) {
    return NextResponse.json(
      { error: "Akses Ditolak: Secret Key salah!" },
      { status: 401 }
    );
  }

  try {
    // Hapus semua data dari seluruh koleksi
    await prisma.hafalan.deleteMany({});
    await prisma.kehadiran.deleteMany({});
    await prisma.tes.deleteMany({});
    await prisma.santri.deleteMany({});
    await prisma.user.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "✅ Database berhasil di-reset! Semua data telah dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus data", details: error.message },
      { status: 500 }
    );
  }
}
