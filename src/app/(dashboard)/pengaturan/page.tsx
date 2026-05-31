"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Settings, Shield, Database, Bell, AlertTriangle, Download, Upload, Check, Users } from "lucide-react";

import { PageHeader, FormField, SubmitButton } from "@/components/shared";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PengaturanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Fitur pengaturan akan segera hadir");
    setIsSubmitting(false);
  };

  const permissionsMatrix = [
    { module: "Lihat Dashboard", super: true, admin: true, ustadz: true },
    { module: "Input Hafalan", super: true, admin: true, ustadz: true },
    { module: "Edit Data Hafalan", super: true, admin: true, ustadz: false },
    { module: "Hapus Data Hafalan", super: true, admin: false, ustadz: false },
    { module: "Manajemen Santri", super: true, admin: true, ustadz: false },
    { module: "Pengaturan Sistem", super: true, admin: false, ustadz: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Pengaturan Sistem" 
        subtitle="Konfigurasi preferensi aplikasi dan hak akses"
      />

      <Tabs defaultValue="sistem" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 md:flex w-full md:w-auto p-1 bg-white dark:bg-dark border border-gray-100 dark:border-white/10 shadow-sm rounded-xl">
          <TabsTrigger value="sistem" className="gap-2 rounded-lg"><Settings className="w-4 h-4"/> Sistem</TabsTrigger>
          <TabsTrigger value="keamanan" className="gap-2 rounded-lg"><Shield className="w-4 h-4"/> Keamanan</TabsTrigger>
          <TabsTrigger value="backup" className="gap-2 rounded-lg"><Database className="w-4 h-4"/> Backup</TabsTrigger>
          <TabsTrigger value="role" className="gap-2 rounded-lg"><Users className="w-4 h-4"/> Role & Akses</TabsTrigger>
        </TabsList>

        <TabsContent value="sistem" className="space-y-6">
          <div className="card p-6 md:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Lembaga</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nama Lembaga / Pesantren" required>
                  <Input defaultValue="Pesantren Tahfidz HafalanQu" />
                </FormField>
                <FormField label="Tahun Ajaran Aktif">
                  <Input defaultValue="2025/2026 Ganjil" />
                </FormField>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 dark:bg-white/10"></div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Preferensi Regional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Zona Waktu">
                  <Select defaultValue="wib">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wib">WIB (Waktu Indonesia Barat)</SelectItem>
                      <SelectItem value="wita">WITA (Waktu Indonesia Tengah)</SelectItem>
                      <SelectItem value="wit">WIT (Waktu Indonesia Timur)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Bahasa Antarmuka">
                  <Select defaultValue="id">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 dark:bg-white/10"></div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Notifikasi
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
                  <div>
                    <Label className="text-base font-semibold">Notifikasi Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">Kirim ringkasan harian setoran hafalan ke email ustadz.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
                  <div>
                    <Label className="text-base font-semibold">Notifikasi WhatsApp</Label>
                    <p className="text-sm text-muted-foreground mt-1">Kirim otomatis hasil hafalan ke nomor HP orang tua (memerlukan integrasi API).</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <SubmitButton onClick={handleSave} isLoading={isSubmitting}>Simpan Pengaturan</SubmitButton>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="keamanan" className="space-y-6">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
              <Shield className="w-6 h-6 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">Keamanan Akun</h4>
                <p className="mt-1 text-blue-700/80">Pengaturan ini berlaku untuk akun Anda sendiri. Untuk mengubah keamanan pengguna lain, gunakan menu Manajemen Pengguna.</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <Label className="text-base font-semibold">Autentikasi Dua Faktor (2FA)</Label>
                <p className="text-sm text-muted-foreground mt-1">Tambahkan lapisan keamanan ekstra menggunakan Google Authenticator.</p>
              </div>
              <Button variant="outline" disabled>Aktifkan</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <Label className="text-base font-semibold">Sesi Aktif</Label>
                <p className="text-sm text-muted-foreground mt-1">Anda masuk pada 3 perangkat berbeda.</p>
              </div>
              <Button variant="outline" className="text-destructive hover:bg-red-50 hover:text-destructive" disabled>Keluar dari semua perangkat</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
              <div>
                <Label className="text-base font-semibold">Backup Otomatis Database</Label>
                <p className="text-sm text-muted-foreground mt-1">Sistem akan membackup data secara berkala ke cloud.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <FormField label="Interval Backup">
              <Select defaultValue="weekly">
                <SelectTrigger className="w-full md:w-1/2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <div className="w-full h-px bg-gray-100 dark:bg-white/10 my-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-2xl p-6 text-center">
                <Download className="w-10 h-10 mx-auto text-primary mb-4" />
                <h4 className="font-semibold text-lg mb-2">Export Data Manual</h4>
                <p className="text-sm text-muted-foreground mb-6">Unduh seluruh database dalam format SQL/JSON. Terakhir backup: 28 Mei 2026.</p>
                <Button className="w-full" disabled>Backup Sekarang</Button>
              </div>
              
              <div className="border rounded-2xl p-6 text-center">
                <Upload className="w-10 h-10 mx-auto text-info mb-4" />
                <h4 className="font-semibold text-lg mb-2">Restore Data</h4>
                <p className="text-sm text-muted-foreground mb-6">Kembalikan data dari file backup sebelumnya. Aksi ini akan menimpa data saat ini.</p>
                <Button variant="outline" className="w-full" disabled>Upload File Backup</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="role" className="space-y-6">
          <div className="card p-6 overflow-hidden">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Matriks Izin Role</h3>
              <p className="text-muted-foreground">Konfigurasi hak akses untuk setiap peran dalam sistem.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-50 dark:bg-white/[0.03] text-muted-foreground">
                  <tr>
                    <th className="h-12 px-4 border-r border-b font-semibold">Modul / Fitur</th>
                    <th className="h-12 px-4 border-r border-b font-semibold text-center w-32"><Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Super Admin</Badge></th>
                    <th className="h-12 px-4 border-r border-b font-semibold text-center w-32"><Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Admin</Badge></th>
                    <th className="h-12 px-4 border-b font-semibold text-center w-32"><Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Ustadz</Badge></th>
                  </tr>
                </thead>
                <tbody>
                  {permissionsMatrix.map((row, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.03]">
                      <td className="p-4 border-r font-medium text-gray-900 dark:text-gray-50">{row.module}</td>
                      <td className="p-4 border-r text-center">{row.super ? <Check className="w-5 h-5 mx-auto text-success" /> : <span className="text-gray-300">-</span>}</td>
                      <td className="p-4 border-r text-center">{row.admin ? <Check className="w-5 h-5 mx-auto text-success" /> : <span className="text-gray-300">-</span>}</td>
                      <td className="p-4 text-center">{row.ustadz ? <Check className="w-5 h-5 mx-auto text-success" /> : <span className="text-gray-300">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 bg-red-50/30">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-semibold text-lg">Zona Berbahaya</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Aksi di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => toast.success("Fitur ini sedang dinonaktifkan")}>Kosongkan Semua Data</Button>
          <Button variant="outline" className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => toast.success("Fitur hapus akun sedang dinonaktifkan")}>Hapus Akun Saya</Button>
        </div>
      </div>
    </motion.div>
  );
}
