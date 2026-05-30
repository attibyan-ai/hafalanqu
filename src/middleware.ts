import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/input-hafalan/:path*",
    "/manajemen-santri/:path*",
    "/pengaturan/:path*",
    "/profil/:path*",
    "/riwayat-hafalan/:path*",
    "/tes-hafalan/:path*",
  ],
};
