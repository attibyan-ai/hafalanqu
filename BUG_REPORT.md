╔══════════════════════════════════════════════════════════════╗
║                   BUG REPORT — HAFALANQU-UI                  ║
║                   Generated: 02 Juni 2026                     ║
╚══════════════════════════════════════════════════════════════╝

Project: Next.js 15 App Router + Prisma 5.22 + MongoDB Atlas
Total: 23 issues (4 critical, 6 high, 9 medium, 4 low)

═══════════════════════════════════════
  CRITICAL — 4 issues
═══════════════════════════════════════

[BUG-01] Middleware tidak proteksi `/api/*` selain auth
   File: src/middleware.ts:93
   Problem: Matcher hanya exclude `/api/auth/` — tapi middleware punya `authorized: ({ token }) => !!token` yang redirect ke `/login` (HTML). API routes lain (`/api/*`) kena redirect HTML, bukan JSON 401.
   Impact: Jika ada API route publik atau third-party integration di masa depan, mereka terima HTML bukan JSON. Error hard to debug.
   Fix: Tambah pengecekan `if (pathname.startsWith('/api/')) return NextResponse.next()` di middleware callback, atau exclude semua `/api/` dari matcher.

[BUG-02] `super-admin` role dead code di utils tapi tak ada di schema/types
   File: src/lib/utils.ts:104-119, prisma/schema.prisma:15, src/types/index.ts:77
   Problem: `getRoleBadgeColor()` dan `getRoleLabel()` handle `"super-admin"`. Tapi schema cuma `admin | ustadz`. Type `UserRole = "admin" | "ustadz"`. Middleware rules juga tak punya `super-admin`.
   Impact: Dead code. Jika ada user dengan role `super-admin` di DB, label tampil "Super Admin" — tapi middleware tak punya akses route untuk role ini, jadi user terkunci.
   Fix: Hapus `super-admin` dari utils, atau tambah ke schema + types + middleware jika memang intended.

[BUG-03] `deleteMyAccount` admin hapus SEMUA data tanpa cascade terstruktur
   File: src/actions/pengaturan.ts:69-89
   Problem: Admin delete account → `deleteMany({ where: { adminId } })` pada Hafalan, Kehadiran, Tes, Santri, Halaqah, Setting, User (ustadz), lalu User (admin). Urutan hapus mungkin gagal karena relasi Prisma. Juga, jika ada data ustadz dengan relasi Halaqah, `user.deleteMany` bisa error karena FK constraint (MongoDB).
   Impact: Satu klik dari admin bisa nuke seluruh sistem. Cascade tidak teruji dengan MongoDB.
   Fix: Gunakan transaction dengan urutan hapus yang benar: child records dulu (hafalan, kehadiran, tes) → santri → halaqah → setting → user (ustadz) → user (admin).

[BUG-04] Admin bisa buat admin lain (privilege escalation)
   File: src/actions/akun.ts:29-63, 66-103
   Problem: `createAkun` dan `updateAkun` menerima `data.role` dari form tanpa validasi. Admin bisa create user dengan `role: "admin"`. Juga di `updateAkun`, role bisa diubah seenaknya.
   Impact: Eskalasi privilege. Satu admin bisa buat admin lain tanpa batas. Jika ada insider threat, dampak besar.
   Fix: Tambah guard — hanya role tertentu yang bisa create admin. Atau set role langsung tanpa bisa diubah dari form. Gunakan Zod schema yang filter role.

═══════════════════════════════════════
  HIGH — 6 issues
═══════════════════════════════════════

[BUG-05] `trendKehadiran` copas dari `trendSetoran`
   File: src/actions/dashboard.ts:216
   Problem: `trendKehadiran: trendSetoran` — kehadiran trend selalu sama dengan setoran trend. Tidak pernah dihitung sendiri.
   Impact: Statistik dashboard menyesatkan. User lihat trend kehadiran padahal itu sebenarnya trend setoran.
   Fix: Hitung trend kehadiran dari data kehadiran bulan ini vs bulan lalu, sama seperti trendSetoran.

[BUG-06] `deleteHalaqoh` tak update santri terkait
   File: src/actions/halaqoh.ts:82-92
   Problem: Delete halaqah → santri dengan `halaqah: existing.nama` masih pointing ke nama halaqoh yang sudah dihapus.
   Impact: Filter/sort by halaqah jadi ambigu. UI di daftar hadir, laporan, dashboard menampilkan nama halaqoh yang sudah tak ada.
   Fix: Tambah `prisma.santri.updateMany({ where: { halaqah: existing.nama, adminId }, data: { halaqah: 'Umum' } })` sebelum delete.

[BUG-07] `adminId` type declaration tak lengkap di next-auth.d.ts
   File: src/types/next-auth.d.ts:22-26, src/lib/auth.ts:43, src/lib/checkAuth.ts:9
   Problem: JWT dan Session interface cuma punya `id`, `role` — tapi `adminId` di-set via `as any`. TypeScript tidak validasi.
   Impact: Dev experience buruk. `(session.user as any).adminId` di 10+ tempat. Jika ada rename field, kompiler tak tangkap.
   Fix: Tambah `adminId?: string` ke JWT dan Session interfaces di next-auth.d.ts. Hapus semua `as any`.

[BUG-08] `createAkun` default password `"123456"` untuk akun baru
   File: src/actions/akun.ts:38
   Problem: Default password `"123456"` saat akun dibuat tanpa password explicit. Ustadz/santri tidak tahu password mereka kecuali dikomunikasikan manual.
   Impact: Security risk — password lemah, default known. Juga tak ada force change password saat first login.
   Fix: Generate random password minimal 8 chars, atau wajibkan admin input password minimal 8 chars.

[BUG-09] API route `/api/create-admin-secure` dan `/api/reset-db-secure` tanpa permission granular check
   File: src/app/api/create-admin-secure/route.ts, src/app/api/reset-db-secure/route.ts
   Problem: Hanya dilindungi middleware (perlu login). Tapi route ini mungkin dipanggil oleh ustadz biasa — middleware cek token, bukan role. Jika ada route yang butuh admin-only, middleware harus cek role juga.
   Impact: Ustadz biasa bisa akses endpoint admin-only jika terautentikasi.
   Fix: Tambah role check di route handler: `const session = await getServerSession(authOptions); if (session?.user?.role !== 'admin') return new Response('Forbidden', { status: 403 })`.

[BUG-10] Quiz: `sambung-setelah` dan `sambung-sebelum` bisa kasih < 4 pilihan jawaban
   File: src/app/(dashboard)/tes-hafalan/play/QuizClient.tsx:96-101, 125-130
   Problem: Options di-generate dari ayat dalam juz/surah yang sama. Jika juz punya < 4 ayat unik (atau beda surah), jumlah options < 4. UI tetap render dengan grid 4 kolom — ada cell kosong.
   Impact: User bisa tebak dari jumlah options yang sedikit. Kurang fair.
   Fix: Fallback ke random ayat dari API global jika options < 4, atau cukup tampilkan options yang ada dengan label pilihan.

═══════════════════════════════════════
  MEDIUM — 9 issues
═══════════════════════════════════════

[BUG-11] `InputHafalanClient` stepper tidak validasi `kualitas` saat pindah step 2 → 3
   File: src/app/(dashboard)/input-hafalan/InputHafalanClient.tsx:50-58
   Problem: `handleNext` step 2 trigger fields `["jenis", "surah", "ayatMulai", "ayatAkhir"]`. Step 3 (kualitas, catatan) tidak tervalidasi sampai submit final. User bisa klik "Next" ke step 3 tanpa pilih kualitas.
   Impact: User frustrasi — submit baru tau ada validasi gagal. Harus balik ke step 3 lagi.
   Fix: Validasi step 3 fields saat `currentStep === 2` juga: `fieldsToValidate = [...fieldsToValidate, "kualitas"]`.

[BUG-12] `getRecentHafalan(limit)` tanpa batas atas
   File: src/actions/hafalan.ts:8-19
   Problem: Parameter `limit` bisa diisi angka besar (misal 999999). Prisma `take: limit` tanpa validasi.
   Impact: Performance issue — bisa load ribuan record dalam satu query. Memory pressure.
   Fix: `take: Math.min(limit, 100)`.

[BUG-13] Quiz: `tebak-surah` options mungkin cuma 1 surah name
   File: src/app/(dashboard)/tes-hafalan/play/QuizClient.tsx:155-158
   Problem: Wrong options diambil dari `ayahs[random].surah.name` dalam juz/surah yang sama. Jika seluruh juz cuma dari 1 surah (misal Juz 30 punya banyak surah — fine. Tapi target Surah Al-Fatihah cuma 7 ayat → semua options nama surah sama).
   Impact: Tebak surah jadi meaningless — semua pilihan sama.
   Fix: Ambil wrong options dari daftar ALL surah names (114 surah), bukan dari range target.

[BUG-14] `checkAuth()` cari user by email, bukan ID
   File: src/lib/checkAuth.ts:10
   Problem: `prisma.user.findUnique({ where: { email } })` — jika email berubah via `updateProfile`, adminId jadi null, throw error "Sesi tidak valid". User harus logout/login.
   Impact: User yang update email langsung error di dashboard. Harus logout.
   Fix: Simpan `adminId` di JWT token waktu login dan pakai dari session, jangan query ulang by email. Atau tambah fallback: cari user by `id` dari session.

[BUG-15] Daftar tahun hanya 2025 dan 2026 (hardcoded)
   File: src/app/(dashboard)/daftar-hadir/DaftarHadirClient.tsx:169-171
   Problem: Year selector cuma 2025 dan 2026. Di 2027, user tak bisa lihat data.
   Impact: Maintenance burden. Setiap tahun harus update kode.
   Fix: Generate year list dinamis: `Array.from({length: 3}, (_, i) => currentYear - 2 + i + 1)` atau dari data.

[BUG-16] Quiz: score pakai `scoreRef.current` pas `handleNext` — nilai bisa stale
   File: src/app/(dashboard)/tes-hafalan/play/QuizClient.tsx:199-201, 216
   Problem: `scoreRef.current` diupdate di `handleAnswer` (line 200) dan dibaca di `handleNext` (line 216). Race condition minimum (semua synchronous event handler) — tapi pakai ref untuk "persistence" di re-render agak fragile.
   Impact: Jika ada future refactor ke async state update, score bisa 0 saat save.
   Fix: Simpan final score di variable lokal: `const finalScore = scoreRef.current; await saveHasilTes(..., finalScore);`.

[BUG-17] `InputHafalanClient` reset form tak reset `santriId` dan `tanggal`
   File: src/app/(dashboard)/input-hafalan/InputHafalanClient.tsx:79-84
   Problem: On submit success, form reset `surah`, `ayatMulai`, `ayatAkhir`, `kualitas`, `catatan` — tapi `santriId` dan `tanggal` tetap. User mungkin lupa dan submit data ke santri yang salah di entry berikutnya.
   Impact: Data integrity risk — setoran bisa masuk ke santri yang salah.
   Fix: Reset `santriId` juga, atau tanya konfirmasi "Input untuk santri yang sama lagi?"

[BUG-18] RiwayatHafalanClient export button cuma toast (fake)
   File: src/app/(dashboard)/riwayat-hafalan/RiwayatHafalanClient.tsx:133
   Problem: Tombol "Export Excel" dan "Export PDF" cuma show toast "Fitur akan segera hadir". Tapi LaporanGlobalClient punya export Excel yang real.
   Impact: User berekspektasi export, dapat toast.
   Fix: Implementasi export untuk riwayat hafalan, atau hapus tombol sampai siap.

[BUG-19] `formatDateShort` di DaftarHadirClient panggil tanpa argument `bahasa`
   File: src/app/(dashboard)/daftar-hadir/DaftarHadirClient.tsx:238
   Problem: Tooltip panggil `MONTHS[Number(selectedMonth)-1]` — ini langsung dari array, bukan dari formatDate. Fine. Tapi ada implicit dependency: month names hardcoded di `MONTHS` array, tidak pakai locale.
   Impact: Jika user ganti bahasa ke English atau Arabic, nama bulan tetap Indonesia.
   Fix: Gunakan `formatDate` atau `intl.DateTimeFormat` untuk nama bulan, bukan hardcoded array.

═══════════════════════════════════════
  LOW — 4 issues
═══════════════════════════════════════

[BUG-20] Dead import `bcrypt` di actions/auth.ts
   File: src/actions/auth.ts:4
   Problem: `import bcrypt from "bcryptjs"` — tidak dipakai. `registerUser` cuma throw error.
   Impact: Tidak ada (tree-shake mungkin buang). Tapi warning linter.
   Fix: Hapus import.

[BUG-21] Landing page duplicate class `max-w-4xl` override `max-w-7xl`
   File: src/app/(landing)/page.tsx:100
   Problem: `<div className="max-w-7xl ... max-w-4xl ...">` — `max-w-4xl` menang, hero section lebih sempit dari konten lain.
   Impact: Visual inconsistency — hero lebih narrow dari sections di bawahnya.
   Fix: Hapus `max-w-4xl` atau `max-w-7xl` (pilih satu).

[BUG-22] Link footer landing page semua ke `#`
   File: src/app/(landing)/page.tsx:321-335
   Problem: "Panduan", "API", "Tentang Kami", "Kontak", "Kebijakan Privasi", "Syarat & Ketentuan" → `href="#"`.
   Impact: Dead links. User klik, scroll ke atas.
   Fix: Ganti dengan halaman yang valid, atau hapus sampai siap.

[BUG-23] Route `/master-surat` di middleware tapi tak ada folder/page
   File: src/middleware.ts:9
   Problem: `{ prefix: "/master-surat", allowedRoles: ["admin"] }` — tapi tidak ada `src/app/(dashboard)/master-surat/`. 404 jika admin akses.
   Impact: Admin bisa lihat link di sidebar (?) → 404. Tapi sidebar mungkin tidak include route ini.
   Fix: Hapus dari middleware rules atau buat halaman.

═══════════════════════════════════════
  POSITIVE NOTES
═══════════════════════════════════════

- Most bugs from previous audit (May 2026) sudah fixed: middleware file naming, checkAuth pada read actions, schema nullability, kualitas chart string matching, profil lookup by ID, Zod validation untuk update santri.
- Prisma singleton pattern sudah benar (globalThis cache).
- DaftarHadir: infer from hafalan tidak overwrite manual records — good data priority logic.
- getDashboardStats pakai Promise.all untuk parallel queries — good performance practice.
- Semua server actions konsisten pakai checkAuth().
- formatDate functions pakai Intl.DateTimeFormat — proper localization.
