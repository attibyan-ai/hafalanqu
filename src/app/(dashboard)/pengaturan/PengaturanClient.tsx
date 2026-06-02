"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertTriangle, Globe, MapPin, Building, CalendarDays } from "lucide-react";
import { signOut } from "next-auth/react";

import { PageHeader, FormField, SubmitButton, ConfirmDialog } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateSetting, resetAllData, deleteMyAccount } from "@/actions/pengaturan";

export default function PengaturanClient({ setting }: { setting: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isDanger: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    isDanger: true,
    onConfirm: () => {},
  });

  const [formData, setFormData] = useState({
    namaLembaga: setting?.namaLembaga || "Pesantren Tahfidz HafalanQu",
    tahunAjaran: setting?.tahunAjaran || "2025/2026 Ganjil",
    zonaWaktu: setting?.zonaWaktu || "wib",
    bahasa: setting?.bahasa || "id",
    notifWa: setting?.notifWa || false,
  });

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateSetting(formData);
      toast.success("Pengaturan berhasil disimpan");
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan pengaturan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Kosongkan Semua Data",
      description: "PERINGATAN: Semua data santri, hafalan, kehadiran, dan tes akan dihapus secara permanen. Anda yakin?",
      isDanger: true,
      onConfirm: async () => {
        try {
          await resetAllData();
          toast.success("Semua data berhasil dikosongkan");
        } catch (e: any) {
          toast.error(e.message || "Gagal mengosongkan data");
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteAccount = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Akun Saya",
      description: "PERINGATAN Keras: Akun Anda akan dihapus permanen. Jika Anda admin, seluruh sistem dan data untuk lembaga Anda akan terhapus. Lanjutkan?",
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteMyAccount();
          toast.success("Akun berhasil dihapus");
          signOut({ callbackUrl: "/login" });
        } catch (e: any) {
          toast.error(e.message || "Gagal menghapus akun");
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Pengaturan Sistem" 
        subtitle="Konfigurasi preferensi aplikasi dan profil lembaga"
      />

      <div className="card p-6 md:p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Informasi Lembaga
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nama Lembaga / Pesantren" required>
              <Input 
                value={formData.namaLembaga} 
                onChange={(e) => setFormData({ ...formData, namaLembaga: e.target.value })} 
              />
            </FormField>
            <FormField label="Tahun Ajaran Aktif">
              <Input 
                value={formData.tahunAjaran} 
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })} 
              />
            </FormField>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/10"></div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> Preferensi Regional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Zona Waktu">
              <Select value={formData.zonaWaktu} onValueChange={(val) => setFormData({ ...formData, zonaWaktu: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wib">WIB (Waktu Indonesia Barat)</SelectItem>
                  <SelectItem value="wita">WITA (Waktu Indonesia Tengah)</SelectItem>
                  <SelectItem value="wit">WIT (Waktu Indonesia Timur)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Bahasa Antarmuka">
              <Select value={formData.bahasa} onValueChange={(val) => setFormData({ ...formData, bahasa: val })}>
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
            <AlertTriangle className="w-5 h-5 text-green-600" /> Notifikasi
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
              <div>
                <Label className="text-base font-semibold">Notifikasi WhatsApp</Label>
                <p className="text-sm text-muted-foreground mt-1">Kirim otomatis hasil hafalan ke nomor HP orang tua (memerlukan integrasi API WhatsApp Gateway).</p>
              </div>
              <Switch checked={formData.notifWa} onCheckedChange={(val) => setFormData({ ...formData, notifWa: val })} />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <SubmitButton onClick={handleSave} isLoading={isSubmitting}>Simpan Pengaturan</SubmitButton>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 bg-red-50/30">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-semibold text-lg">Zona Berbahaya</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Aksi di bawah ini bersifat permanen dan tidak dapat dibatalkan. Harap berhati-hati.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleReset}>Kosongkan Semua Data</Button>
          <Button variant="outline" className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleDeleteAccount}>Hapus Akun Saya</Button>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        isDanger={confirmDialog.isDanger}
        confirmText="Ya, Saya Yakin"
      />
    </motion.div>
  );
}
