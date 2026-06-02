import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  // Role check: hanya admin yang bisa akses
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  
  // Mengambil parameter dari URL Query String
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const nama = searchParams.get("nama");
  const secret = searchParams.get("secret");

  // Membaca kunci pengaman rahasia dari environment variable (.env)
  const SECURE_SECRET = process.env.NEXTAUTH_SECRET || "secret1234567890";

  // 1. Validasi kunci pengaman rahasia
  if (!secret || secret !== SECURE_SECRET) {
    return NextResponse.json(
      { error: "Akses Ditolak: Secret Key salah atau tidak dilampirkan!" },
      { status: 401 }
    );
  }

  // 2. Validasi kelengkapan parameter pendaftaran
  if (!email || !password || !nama) {
    return NextResponse.json(
      { error: "Gagal: Parameter 'email', 'password', dan 'nama' wajib diisi di URL!" },
      { status: 400 }
    );
  }

  try {
    // 3. Validasi keunikan email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: `Gagal: Email "${email}" sudah terdaftar sebelumnya!` },
        { status: 400 }
      );
    }

    // 4. Enkripsi password secara aman
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan admin baru ke database cloud
    const newAdmin = await prisma.user.create({
      data: {
        email,
        nama,
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Hore! Akun Admin Baru Berhasil Dibuat Langsung via Server Vercel!",
      data: {
        email: newAdmin.email,
        nama: newAdmin.nama,
        role: newAdmin.role,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan koneksi database internal", details: error.message },
      { status: 500 }
    );
  }
}
