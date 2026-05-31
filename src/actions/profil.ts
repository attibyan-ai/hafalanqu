"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/checkAuth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { nama: string; email: string; noHp?: string; alamat?: string }) {
  const session = await checkAuth();
  
  // Update DB
  await prisma.user.update({
    where: { email: session.user?.email || "" },
    data: {
      nama: data.nama,
      email: data.email,
      noHp: data.noHp,
      alamat: data.alamat,
    }
  });
  
  revalidatePath("/profil");
}

export async function updatePassword(oldPass: string, newPass: string) {
  const session = await checkAuth();
  
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" }
  });
  
  if (!user) throw new Error("User not found");
  
  const isValid = await bcrypt.compare(oldPass, user.password);
  if (!isValid) {
    throw new Error("Password lama salah");
  }
  
  const hashedPassword = await bcrypt.hash(newPass, 10);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
}
