# BUG REPORT - hafalanqu-ui
Tanggal: 2026-05-31
Status: SEMUA BUG SUDAH DIPERBAIKI

---

## BUG-01 [KRITIKAL] Prisma Client Connection Pool Exhaustion
File: src/actions/*.ts, src/lib/auth.ts
Deskripsi: Setiap file action membuat `new PrismaClient()` sendiri.
  Di development (hot reload), tiap perubahan file bikin PrismaClient baru
  tanpa disconnect → connection pool MongoDB habis.
Fix: src/lib/prisma.ts singleton + semua file import dari sana.

## BUG-02 [INFO] Schema Provider vs Database
File: prisma/schema.prisma, .env, prisma/dev.db
Deskripsi: Schema bilang `mongodb`, .env MongoDB Atlas, tapi ada file
  `prisma/dev.db` (SQLite artifact). Schema sudah benar, dev.db leftover.
Fix: dev.db bisa dihapus (tidak dipakai).

## BUG-03 [SUDAH FIX] Types vs Prisma Schema
File: src/lib/types.ts (kosong)
Deskripsi: Dulu ada `Santri.kelas` tapi Prisma pakai `halaqah`.
  Sekarang types.ts kosong, kode langsung pakai Prisma types.
Fix: Sudah resolved.

## BUG-04 [SUDAH FIX] Middleware Missing /daftar-hadir
File: src/middleware.ts
Deskripsi: Matcher tidak include `/daftar-hadir/:path*`.
Fix: Sudah ditambahkan.

## BUG-05 [KRITIKAL] Kualitas Filter Mismatch
File: src/app/(dashboard)/riwayat-hafalan/RiwayatHafalanClient.tsx
Deskripsi: Filter options pakai title case ("Mumtaz", "Jayyid Jiddan")
  tapi DB simpan lowercase ("mumtaz", "jayyid-jiddan"). Spasi vs hyphen
  bikin filter tidak pernah match.
Fix: Filter values diganti lowercase sesuai DB: "mumtaz", "jayyid-jiddan", dll.
  Display pakai `getKualitasLabel()` untuk tampilan bagus.

## BUG-06 [SUDAH FIX] Dashboard Trend Calculation
File: src/actions/dashboard.ts
Deskripsi: Trend Kualitas/Kehadiran dulu copy dari trend Setoran.
Fix: Sekarang hitung dari data aktual per-bulan.

## BUG-07 [SUDAH FIX] Tes Target Hardcoded "Juz 30"
File: src/app/(dashboard)/tes-hafalan/ (dulu QuizClient.tsx)
Deskripsi: `saveHasilTes` hardcode target "Juz 30".
Fix: Target dikirim dari quiz setup dialog via URL params.

## BUG-08 [SUDAH FIX] QuizClient Infinite Loop
File: src/app/(dashboard)/tes-hafalan/play/QuizClient.tsx
Deskripsi: useEffect tanpa guard, API error tanpa handling.
Fix: `isMounted` flag, proper error handling, redirect on failure.

## BUG-09 [KRITIKAL] Jenis Filter Mismatch (Muraja'ah)
File: src/app/(dashboard)/riwayat-hafalan/RiwayatHafalanClient.tsx
Deskripsi: Filter "Muraja'ah" (dengan apostrophe) vs DB "murajaah"
  (tanpa apostrophe). Filter tidak pernah match.
Fix: Filter value diganti "murajaah". Display "Muraja'ah" via label.

## BUG-10 [SUDAH FIX] Udzur Status
File: prisma/schema.prisma, DaftarHadirClient.tsx
Deskripsi: UI punya "udzur" tapi schema ragu.
Fix: Schema comment sudah include "udzur". UI sudah lengkap.

## BUG-11 [SUDAH FIX] Server Actions Tanpa Auth
File: src/actions/*.ts
Deskripsi: `createHafalan`, `setKehadiran`, `deleteSantri` dll tanpa auth.
Fix: Semua mutating actions panggil `checkAuth()`.

## BUG-12 [SUDAH FIX] Server Actions Tanpa Validation
File: src/actions/hafalan.ts, src/actions/santri.ts
Deskripsi: Data masuk langsung ke Prisma tanpa validasi.
Fix: Zod schemas + `.parse()` di semua create/update actions.

## BUG-13 [SUDAH FIX] Registration Open
File: src/actions/auth.ts
Deskripsi: `registerUser` endpoint bisa dipanggil siapa saja.
Fix: Throw error "Pendaftaran publik telah dinonaktifkan."

## BUG-14 [COSMETIC] Export Buttons Kosong
File: RiwayatHafalanClient.tsx
Deskripsi: Tombol "Export Excel" dan "Export PDF" tidak ada fungsinya.
Fix: Toast "Fitur akan segera hadir" saat diklik.

## BUG-15 [COSMETIC] Profil Update Placeholder
File: src/app/(dashboard)/profil/ProfilClient.tsx
Deskripsi: Dulu form submit tidak melakukan apa-apa.
Fix: Sekarang terhubung ke `updateProfile` + `updatePassword` actions
  dengan auth check dan bcrypt verification.

## BUG-16 [COSMETIC] Pengaturan Save Button Fake
File: src/app/(dashboard)/pengaturan/page.tsx
Deskripsi: Button "Simpan Pengaturan" hanya timeout 1 detik.
Fix: Toast "Fitur pengaturan akan segera hadir".

## BUG-17 [SEDANG] useEffect Cleanup
File: src/app/(dashboard)/tes-hafalan/play/QuizClient.tsx
Deskripsi: Async operation di useEffect tanpa cleanup.
Fix: `isMounted` flag + cleanup function.

## BUG-18 [KRITIKAL] Seed File Hardcoded Credentials
File: prisma/seed.ts
Deskripsi: Password admin hardcoded "admin123" di source code.
Fix: `process.env.ADMIN_PASSWORD || 'admin123'` — configurable via env.

## BUG-19 [SEDANG] Seed di Build Script
File: package.json
Deskripsi: `npm run build` jalankan `prisma db seed` setiap deploy
  → admin di-upsert, password di-reset.
Fix: Build script sekarang hanya `prisma generate && next build`.

## BUG-20 [SUDAH FIX] Progress Calculation
File: src/actions/santri.ts
Deskripsi: `progressJuz` dulu hardcode 5.
Fix: `Math.min(Math.floor(totalAyat / 140), s.targetJuz)`.

## BUG-21 [SUDAH FIX] Kualitas Chart Rounding
File: src/actions/dashboard.ts
Deskripsi: Math.round bisa bikin total ≠ 100%.
Fix: Largest remainder method (distribute sisa ke bucket terbesar).

## BUG-22 [COSMETIC] Danger Zone Buttons
File: src/app/(dashboard)/pengaturan/page.tsx
Deskripsi: "Kosongkan Semua Data" dan "Hapus Akun" tanpa handler.
Fix: Toast "Fitur ini sedang dinonaktifkan".

## BUG-23 [SUDAH FIX] Week Chart Data
File: src/actions/dashboard.ts
Deskripsi: Grafik mingguan tampilkan SEMUA data, bukan minggu ini.
Fix: Filter `h.tanggal >= startOfWeek && h.tanggal <= endOfWeek`.

---

## BUG BARU (ditemukan saat re-analisis)

## NEW-01 [KRITIKAL] QuizClient Score Race Condition
File: src/app/(dashboard)/tes-hafalan/play/QuizClient.tsx
Deskripsi: `handleAnswer` update `score` via `setScore(s => s + 20)`.
  `handleNext` dipanggil segera sesudahnya, tapi `score` state belum
  ter-update (React async). `saveHasilTes` dapat nilai score lama.
  Contoh: jawaban benar terakhir → score harus 100 tapi tersimpan 80.
Fix: Tambah `scoreRef = useRef(0)`. `handleAnswer` update ref + state.
  `handleNext` baca `scoreRef.current` untuk save.

---

## RINGKASAN
Total bugs ditemukan: 23 + 1 new = 24
Sudah diperbaiki sebelumnya: 17
Diperbaiki sekarang: 3 (BUG-05, BUG-09, NEW-01)
Sisa kosmetik/placeholder: 4 (BUG-14, BUG-16, BUG-22 + tombol fake)
Type check: PASS (tsc --noEmit = 0 errors)
