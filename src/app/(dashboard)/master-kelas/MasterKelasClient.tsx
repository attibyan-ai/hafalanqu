"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, ClipboardList, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { createHalaqoh, updateHalaqoh, deleteHalaqoh } from "@/actions/halaqoh";
import { toast } from "sonner";
import { formatDateShort } from "@/lib/utils";

interface MasterKelasClientProps {
  halaqohs: Array<{
    id: string;
    nama: string;
    ustadzId: string | null;
    ustadz: { nama: string } | null;
    createdAt: Date;
  }>;
  ustadzList: Array<{
    id: string;
    nama: string;
  }>;
}

export default function MasterKelasClient({ halaqohs, ustadzList }: MasterKelasClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: "", nama: "", ustadzId: "unassigned" });

  const filteredHalaqoh = halaqohs.filter(h => 
    h.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.ustadz?.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (halaqoh?: any) => {
    if (halaqoh) {
      setFormData({ id: halaqoh.id, nama: halaqoh.nama, ustadzId: halaqoh.ustadzId || "unassigned" });
    } else {
      setFormData({ id: "", nama: "", ustadzId: "unassigned" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        nama: formData.nama,
        ustadzId: formData.ustadzId === "unassigned" ? undefined : formData.ustadzId
      };
      
      if (formData.id) {
        await updateHalaqoh(formData.id, payload);
        toast.success("Halaqoh berhasil diperbarui!");
      } else {
        await createHalaqoh(payload);
        toast.success("Halaqoh baru berhasil dibuat!");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan halaqoh");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus halaqoh ini?")) {
      try {
        await deleteHalaqoh(id);
        toast.success("Halaqoh berhasil dihapus!");
      } catch (error: any) {
        toast.error("Gagal menghapus halaqoh");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Halaqoh" 
        subtitle="Kelola data halaqoh dan guru pembimbingnya" 
      >
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Halaqoh
        </Button>
      </PageHeader>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama halaqoh atau guru..." 
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
                <th className="px-4 py-3 rounded-tl-xl">Nama Halaqoh</th>
                <th className="px-4 py-3">Guru Pembimbing</th>
                <th className="px-4 py-3">Tanggal Dibuat</th>
                <th className="px-4 py-3 rounded-tr-xl text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filteredHalaqoh.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Belum ada data halaqoh.
                  </td>
                </tr>
              ) : (
                filteredHalaqoh.map((halaqoh) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={halaqoh.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-dark">{halaqoh.nama}</td>
                    <td className="px-4 py-3">
                      {halaqoh.ustadz ? (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {halaqoh.ustadz.nama}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Belum ditentukan</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateShort(halaqoh.createdAt.toISOString())}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/master-kelas/${halaqoh.id}`}>
                          <Button variant="outline" size="sm" className="gap-2 h-8">
                            <Users className="w-4 h-4 text-emerald-600" />
                            <span className="hidden sm:inline">Kelola Santri</span>
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => handleOpenModal(halaqoh)}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(halaqoh.id)}>
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
            <DialogTitle>{formData.id ? "Edit Halaqoh" : "Tambah Halaqoh Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Halaqoh</Label>
              <Input required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Misal: Halaqoh Abu Bakar" />
            </div>
            <div className="space-y-2">
              <Label>Guru Pembimbing</Label>
              <Select value={formData.ustadzId} onValueChange={v => setFormData({...formData, ustadzId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Guru Pembimbing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Belum ditentukan</SelectItem>
                  {ustadzList.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan Halaqoh"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
