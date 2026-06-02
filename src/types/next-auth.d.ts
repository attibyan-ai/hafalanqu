import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      adminId: string;
    };
  }

  interface User {
    id: string;
    nama: string;
    email: string;
    role: string;
    adminId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    adminId: string;
  }
}
