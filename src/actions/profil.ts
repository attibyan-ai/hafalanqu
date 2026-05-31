"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  noHp: z.string().optional(),
  alamat: z.string().optional(),
});

const updatePasswordSchema = z.object({
  oldPass: z.string().min(1, "Password lama wajib diisi"),
  newPass: z.string().min(8, "Password baru minimal 8 karakter"),
});

export async function updateProfile(data: { nama: string; email: string; noHp?: string; alamat?: string }) {
  const session = await checkAuth();
  const parsed = updateProfileSchema.parse(data);
  
  // Use user ID from session, not email
  const userId = (session.user as any)?.id;
  if (!userId) throw new Error("User ID not found in session");
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      nama: parsed.nama,
      email: parsed.email,
      noHp: parsed.noHp,
      alamat: parsed.alamat,
    }
  });
  
  revalidatePath("/profil");
}

export async function updatePassword(oldPass: string, newPass: string) {
  const session = await checkAuth();
  const parsed = updatePasswordSchema.parse({ oldPass, newPass });
  
  const userId = (session.user as any)?.id;
  if (!userId) throw new Error("User ID not found in session");
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) throw new Error("User not found");
  
  const isValid = await bcrypt.compare(parsed.oldPass, user.password);
  if (!isValid) {
    throw new Error("Password lama salah");
  }
  
  const hashedPassword = await bcrypt.hash(parsed.newPass, 10);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
}
