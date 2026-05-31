# UI/UX BUG REPORT - hafalanqu-ui
Tanggal: 2026-05-31

---

## BUG-UI-01 [KRITIKAL] Daftar Hadir: Hafalan Overwrite Manual Record
File: src/app/(dashboard)/daftar-hadir/DaftarHadirClient.tsx (line 49-57)
Deskripsi: Hafalan inference OVERWRITE data kehadiran manual.
  Jika santri di-set "sakit" secara manual tapi punya hafalan di hari
  yang sama, status "sakit" di-overwrite jadi "hadir".
  Comment bilang "overwrites if there is a manual record" — ini bug.
Status: ✅ SUDAH DIPERBAIKI — sekarang hanya fill yang kosong.

---

## BUG-UI-02 [SEDANG] StatCard: Trend Tanpa Label Unit
File: src/components/shared/StatCard.tsx (line 37-39)
Deskripsi: Trend hanya tampilkan angka "+5" atau "-3" tanpa "%"
  atau label konteks. User tidak tahu: +5 apa? Santri baru?
  Persentase? Poin?
Fix: Tambah suffix "%" karena trend dihitung sebagai persentase.
Status: ✅ SUDAH DIPERBAIKI

---

## BUG-UI-03 [SEDANG] Pie Chart: Semua Nol Render Kosong
File: src/app/(dashboard)/dashboard/DashboardClient.tsx (line 114-138)
Deskripsi: Saat belum ada data hafalan, Pie chart render dengan
  semua value 0%. Legend tetap muncul, chart area kosong.
  Tidak ada empty state message.
Fix: Tampilkan placeholder "Belum ada data" saat totalKualitas = 0.

---

## BUG-UI-04 [SEDANG] Input Hafalan: Surah Dropdown Tanpa Search
File: src/app/(dashboard)/input-hafalan/InputHafalanClient.tsx (line 189-194)
Deskripsi: 114 surah di dropdown tanpa search. User harus scroll
  panjang untuk cari surah. UX buruk untuk penggunaan sehari-hari.
Fix: Tambah search/filter di dalam SelectContent atau pakai
  Combobox pattern.

---

## BUG-UI-05 [SEDANG] Manajemen Santri: Halaqah Select Tanpa Validation
File: src/app/(dashboard)/manajemen-santri/ManajemenSantriClient.tsx (line 220-228)
Deskripsi: `<Select onValueChange>` tidak trigger validation react-hook-form.
  Jika user submit tanpa pilih halaqah, error tidak muncul di field
  (zod akan reject tapi UI tidak highlight field).
Fix: Tambah `setValue("halaqah", v, { shouldValidate: true })`.
Status: ✅ SUDAH DIPERBAIKI

---

## BUG-UI-06 [SEDANG] AppSidebar: AvatarImage src="" Selalu
File: src/components/shared/AppSidebar.tsx (line 136)
Deskripsi: `<AvatarImage src={""} />` — empty string, gambar tidak
  pernah tampil. Fallback selalu aktik.
Fix: Hapus AvatarImage atau gunakan `session?.user?.image`.

---

## BUG-UI-07 [SEDANG] Tes Hafalan: Kolom Durasi & Benar/Salah Kosong
File: src/app/(dashboard)/tes-hafalan/TesHafalanClient.tsx (line 151-191)
Deskripsi: Kolom "Benar/Salah" dan "Durasi" di tabel riwayat tes
  selalu tampilkan "-" karena data tidak di-track.
  Kolom-kolom ini misleading — user berharap ada data.
Fix: Sembunyikan kolom atau implement tracking.
Status: ✅ SUDAH DIPERBAIKI (kolom dihapus)

---

## BUG-UI-08 [SEDANG] Daftar Hadir: Tidak Ada Highlight Weekend/Jumat
File: src/app/(dashboard)/daftar-hadir/DaftarHadirClient.tsx
Deskripsi: Matriks kehadiran 31 kolom tanpa highlight hari Jumat
  (hari libur pesantren) atau weekend. User sulit identifikasi
  hari libur vs hari aktif.
Fix: Tambah background abu-abu atau label "L" untuk hari libur.

---

## BUG-UI-09 [SEDANG] Tidak Ada Error/Not-Found Pages
File: src/app/ (missing error.tsx, not-found.tsx)
Deskripsi: Tidak ada custom error boundary atau 404 page.
  Next.js default error page jelek dan tidak konsisten
  dengan desain aplikasi.
Fix: Tambah error.tsx dan not-found.tsx di src/app/.

---

## BUG-UI-10 [SEDANG] DataTable: Pagination Overflow di Mobile
File: src/components/shared/DataTable.tsx (line 127-171)
Deskripsi: Pagination bar ("Baris per halaman" + "Sebelumnya/
  Selanjutnya") bisa overflow di layar kecil. Select + 2 buttons
  dalam satu row tanpa wrap.
Fix: Stack vertikal di mobile atau sembunyikan "Baris per halaman".

---

## BUG-UI-11 [SEDANG] StatCard: Dark Mode Inconsistency
File: src/components/shared/StatCard.tsx (line 35)
Deskripsi: `text-dark` hardcoded. Di dark mode, text tidak terbaca.
  Banyak komponen lain juga pakai `text-dark`, `bg-white`, dll
  yang tidak adaptif ke dark mode.
Fix: Pakai semantic color tokens atau tambah dark: variants.
  Atau: disable dark mode sampai full support.

---

## BUG-UI-12 [SEDANG] Semua Halaman: No Keyboard Navigation di Dialog
File: Multiple (Dialog components)
Deskripsi: Dialog/dialog tidak trap focus dengan baik. Setelah
  dialog terbuka, Tab bisa keluar dari dialog ke background.
  Radix UI default seharusnya handle ini, tapi perlu verifikasi.
Fix: Test keyboard navigation di semua dialog.

---

## BUG-UI-13 [COSMETIC] Pengaturan: UsersIcon Inline SVG Hack
File: src/app/(dashboard)/pengaturan/page.tsx (line 243-263)
Deskripsi: `UsersIcon` didefinisikan inline sebagai SVG di bawah
  file karena tidak di-import dari lucide-react. Lucide punya
  `Users` icon yang sama.
Fix: Import `Users` from lucide-react, hapus inline SVG.
Status: ✅ SUDAH DIPERBAIKI

---

## BUG-UI-14 [COSMETIC] Mobile Navbar: "Menu" → Pengaturan
File: src/constants/navigation.ts (line 77-79)
Deskripsi: Mobile nav item "Menu" link ke `/pengaturan`.
  Label "Menu" misleading — user expect menu/hamburger, bukan
  settings page.
Fix: Ganti label jadi "Lainnya" atau "Setelan".
Status: ✅ SUDAH DIPERBAIKI ("Lainnya")

---

## BUG-UI-15 [COSMETIC] Manajemen Santri: Tombol Edit Tidak Ada
File: src/app/(dashboard)/manajemen-santri/ManajemenSantriClient.tsx (line 106-116)
Deskripsi: Kolom aksi hanya punya tombol Hapus (trash icon).
  Tidak ada tombol Edit untuk update data santri.
Fix: Tambah edit button + edit dialog/form.

---

## BUG-UI-16 [COSMETIC] Daftar Hadir: Tidak Bisa Filter per Halaqah
File: src/app/(dashboard)/daftar-hadir/DaftarHadirClient.tsx
Deskripsi: Matriks tampilkan SEMUA santri tanpa filter halaqah.
  Jika ada 100+ santri, tabel sangat panjang.
Fix: Tambah dropdown filter halaqah.

---

## BUG-UI-17 [COSMETIC] Dashboard: Chart Tidak Responsive di Tablet
File: src/app/(dashboard)/dashboard/DashboardClient.tsx (line 84-139)
Deskripsi: Grid `lg:grid-cols-2` — di tablet (md breakpoint),
  chart stack penuh. OK secara layout, tapi chart Recharts
  tidak resize dengan baik di layar sempit.
Fix: Tambah min-height pada ChartCard container.

---

## RINGKASAN
Total UI/UX bugs: 17
  KRITIKAL: 1 → ✅ sudah fix
  SEDANG: 10 → 4 sudah fix, 6 sisa
  COSMETIC: 6 → 2 sudah fix, 4 sisa

Sudah diperbaiki: 7
  UI-01: Hafalan overwrite manual record
  UI-02: Trend tanpa label %
  UI-05: Halaqah select tanpa validation
  UI-07: Kolom kosong di tabel tes
  UI-13: UsersIcon inline SVG
  UI-14: Mobile nav "Menu" → "Lainnya"

Sisa SEDANG (prioritas berikutnya):
  UI-03: Pie chart empty state
  UI-04: Surah dropdown search
  UI-06: Avatar src kosong
  UI-08: Weekend highlight
  UI-09: Error/404 pages
  UI-10: DataTable mobile overflow
  UI-11: Dark mode inconsistency
  UI-12: Dialog keyboard focus

Sisa COSMETIC:
  UI-15: Tombol edit santri
  UI-16: Filter halaqah di daftar hadir
  UI-17: Chart responsive tablet
