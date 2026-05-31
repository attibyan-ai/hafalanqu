import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Mengambil argumen dari baris perintah (CLI)
  const args = process.argv.slice(2);
  const [email, password, nama] = args;

  if (!email || !password || !nama) {
    console.log("\n==================================================================");
    console.log("❌ ERROR: Parameter Pendaftaran Admin Kurang Lengkap!");
    console.log("==================================================================");
    console.log("👉 Cara Penggunaan:");
    console.log("   npx tsx scripts/create-admin.ts <email> <password> <nama>");
    console.log("\n👉 Contoh Pembuatan Akun:");
    console.log('   npx tsx scripts/create-admin.ts admin.darulquran@gmail.com "rahasia123" "Admin Darul Quran"');
    console.log("==================================================================\n");
    process.exit(1);
  }

  try {
    // 1. Validasi keunikan email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`\n❌ ERROR: Email "${email}" sudah terdaftar di database! Silakan gunakan email unik lainnya.\n`);
      process.exit(1);
    }

    // 2. Hash password secara aman
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan data admin baru ke database
    const newAdmin = await prisma.user.create({
      data: {
        email,
        nama,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("\n==========================================");
    console.log("✅ SUKSES: Akun Admin Baru Berhasil Dibuat!");
    console.log("==========================================");
    console.log(`📧 Email : ${newAdmin.email}`);
    console.log(`👤 Nama  : ${newAdmin.nama}`);
    console.log(`🔑 Role  : ${newAdmin.role}`);
    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ Terjadi kesalahan teknis saat mengakses database:", error, "\n");
  } finally {
    await prisma.$disconnect();
  }
}

main();
