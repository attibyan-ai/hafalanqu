"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(data: { nama: string; email: string; password: string }) {
  throw new Error("Pendaftaran publik dinonaktifkan. Akun Admin dibuat oleh pembuat web (hubungi 085888892326 atau pptqttibyanlaren@gmail.com). Akun Guru & Murid dibuat oleh Admin.");
}
