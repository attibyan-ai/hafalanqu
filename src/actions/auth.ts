"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function registerUser(data: { nama: string; email: string; password: string }) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { error: "Email sudah terdaftar!" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      role: "ustadz", // Default role
    },
  });

  return { success: true };
}
