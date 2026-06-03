import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Peta rute aman dan role yang diizinkan mengaksesnya
const routeAccessRules = [
  // ================= ADMIN PAGES =================
  { prefix: "/manajemen-ustadz", allowedRoles: ["admin"] },
  { prefix: "/manajemen-santri", allowedRoles: ["admin"] },
  { prefix: "/master-kelas", allowedRoles: ["admin"] },
  { prefix: "/laporan-global", allowedRoles: ["admin"] },

  // ================= USTADZ PAGES =================
  { prefix: "/input-hafalan", allowedRoles: ["ustadz"] },
  
  // ================= USTADZ & ADMIN SHARED =================
  { prefix: "/riwayat-hafalan", allowedRoles: ["ustadz", "admin"] },
  { prefix: "/daftar-hadir", allowedRoles: ["ustadz", "admin"] },
  { prefix: "/tes-hafalan", allowedRoles: ["ustadz", "admin", "santri"] },

  // ================= SANTRI PAGES =================
  { prefix: "/target-hafalan", allowedRoles: ["santri"] },
  { prefix: "/riwayat-setoran", allowedRoles: ["santri"] },
  { prefix: "/grafik-perkembangan", allowedRoles: ["santri"] },

  // ================= WALI PAGES =================
  { prefix: "/laporan-anak", allowedRoles: ["wali"] },
  { prefix: "/riwayat-kehadiran", allowedRoles: ["wali"] },
  { prefix: "/pesan-pengumuman", allowedRoles: ["wali"] },

  // ================= SHARED PROTECTED PAGES =================
  { prefix: "/dashboard", allowedRoles: ["admin", "ustadz", "santri", "wali"] },
  { prefix: "/profil", allowedRoles: ["admin", "ustadz", "santri", "wali"] },
  { prefix: "/pengaturan", allowedRoles: ["admin", "ustadz", "santri", "wali"] },
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Jangan redirect API routes — return JSON 401 biar client terima JSON, bukan HTML
    if (pathname.startsWith("/api/") && !token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Jika pengguna tidak terautentikasi (NextAuth secara default menangani authorized)
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = (token.role as string) || "ustadz";

    // Cari aturan rute yang cocok dengan awalan path saat ini
    const matchedRule = routeAccessRules.find((rule) =>
      pathname.startsWith(rule.prefix)
    );

    // Jika rute dilindungi dan peran user TIDAK diizinkan
    if (matchedRule && !matchedRule.allowedRoles.includes(userRole)) {
      // Alihkan secara aman ke halaman dashboard utama milik pengguna
      const defaultRedirectPath = getDefaultPathForRole(userRole);
      return NextResponse.redirect(new URL(defaultRedirectPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Selalu jalankan middleware callback agar API routes bisa mengembalikan
      // JSON 401 sendiri. Kalau false di sini, NextAuth akan redirect ke /login
      // sebelum logic API di atas sempat berjalan.
      authorized: () => true,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Mendapatkan path default ketika terjadi kegagalan otorisasi rute
function getDefaultPathForRole(role: string): string {
  // Untuk menjaga pengalaman pengguna agar tidak 404 pada rute yang belum dibuat foldernya,
  // semua pengguna diorientasikan ke /dashboard yang mendukung tampilan dinamis sesuai peran.
  switch (role) {
    case "admin":
    case "ustadz":
    case "santri":
    case "wali":
      return "/dashboard";
    default:
      return "/login";
  }
}

export const config = {
  // Lindungi semua rute dashboard dan menu privat, kecualikan file publik & API auth
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|manifest.json|$).*)",
  ],
};
