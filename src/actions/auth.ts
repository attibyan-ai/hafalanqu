"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(data: { nama: string; email: string; password: string }) {
  throw new Error("Pendaftaran publik telah dinonaktifkan. Hubungi administrator.");
}
