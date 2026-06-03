import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error('ADMIN_PASSWORD minimal 8 karakter wajib diset sebelum menjalankan seed.');
  }

  const password = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hafalanqu.com' },
    update: {},
    create: {
      email: 'admin@hafalanqu.com',
      nama: 'Admin HafalanQu',
      password,
      role: 'admin',
    },
  })

  console.log(`Admin seed ready: ${admin.email}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
