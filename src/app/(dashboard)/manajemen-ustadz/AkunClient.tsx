"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { createAkun, updateAkun, deleteAkun } from "@/actions/akun";
import { toast } from "sonner";
import { formatDateShort } from "@/lib/utils";

interface AkunClientProps {
  akuns: Array<{
    id: string;
    nama: string;
    email: string;
    role: string;
    createdAt: Date;
    halaqahs: Array<{ nama: string }>;
  }>;
  title: string;
  subtitle: string;
  defaultRole: string;
}

export default function AkunClient({ akuns, title, subtitle, defaultRole }: AkunClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: "", nama: "", email: "", password: "", role: defaultRole });

  const filteredAkun = akuns.filter(a => 
    a.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (akun?: any) => {
    if (akun) {
      setFormData({ id: akun.id, nama: akun.nama, email: akun.email, password: "", role: akun.role });
    } else {
      setFormData({ id: "", nama: "", email: "", password: "", role: defaultRole });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await updateAkun(formData.id, formData);
        toast.success("Akun berhasil diperbarui!");
      } else {
        await createAkun(formData);
        toast.success("Akun baru berhasil dibuat!");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      try {
        await deleteAkun(id);
        toast.success("Akun berhasil dihapus!");
      } catch (error: any) {
        toast.error("Gagal menghapus akun");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
      >
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Akun
        </Button>
      </PageHeader>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 font-medium border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Nama Lengkap</th>
                <th className="px-4 py-3">Email / Username</th>
                <th className="px-4 py-3">Tanggal Dibuat</th>
                <th className="px-4 py-3 rounded-tr-xl text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filteredAkun.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Belum ada data akun.
                  </td>
                </tr>
              ) : (
                filteredAkun.map((akun) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={akun.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-dark">{akun.nama}</td>
                    <td className="px-4 py-3">{akun.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateShort(akun.createdAt.toISOString())}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenModal(akun)}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(akun.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Akun" : "Tambah Akun Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Masukkan nama..." />
            </div>
            <div className="space-y-2">
              <Label>Email / Username</Label>
              <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@contoh.com" />
            </div>
            <div className="space-y-2">
              <Label>Password {formData.id && "(Kosongkan jika tidak ingin diubah)"}</Label>
              <Input type="password" required={!formData.id} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="******" />
            </div>
            <div className="space-y-2 hidden">
              <Label>Peran (Role)</Label>
              <Input value={formData.role} readOnly />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan Akun"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
