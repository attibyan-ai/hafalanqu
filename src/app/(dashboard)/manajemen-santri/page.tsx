"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Eye, Pencil, Trash2, Search, Users } from "lucide-react";

import { 
  PageHeader, DataTable, SearchInput, FilterDropdown, FormField, SubmitButton 
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

import { santriList, halaqahList } from "@/constants/mock-data";
import { Santri } from "@/types";
import { getInitials } from "@/lib/utils";

const columns: ColumnDef<Santri>[] = [
  {
    id: "profil",
    header: "Santri",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-gray-100">
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback className="bg-primary-50 text-primary">{getInitials(row.original.nama)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-dark">{row.original.nama}</p>
          <p className="text-xs text-muted-foreground">{row.original.noHp}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "nis",
    header: "NIS",
    cell: ({ row }) => <span className="font-medium text-muted-foreground">{row.original.nis}</span>,
  },
  {
    accessorKey: "halaqah",
    header: "Halaqah",
    cell: ({ row }) => (
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
        {row.original.halaqah}
      </Badge>
    ),
  },
  {
    id: "progress",
    header: "Progress Hafalan",
    cell: ({ row }) => {
      const { progressJuz, targetJuz } = row.original;
      const percentage = Math.round((progressJuz / targetJuz) * 100);
      return (
        <div className="flex items-center gap-3 min-w-[150px]">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {progressJuz}/{targetJuz} Juz
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.original.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"} variant="outline">
        {row.original.status === "active" ? "Aktif" : "Tidak Aktif"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-info">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

const formSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nis: z.string().min(3, "NIS minimal 3 karakter"),
  halaqah: z.string().min(1, "Halaqah wajib dipilih"),
  noHp: z.string().min(10, "Nomor HP tidak valid"),
  alamat: z.string().optional(),
  targetJuz: z.string().min(1, "Target wajib diisi"),
});

export default function ManajemenSantriPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [halaqahFilter, setHalaqahFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const filteredData = santriList.filter(item => {
    if (halaqahFilter !== "all" && item.halaqah !== halaqahFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Data santri berhasil ditambahkan");
    setIsSubmitting(false);
    setIsAddOpen(false);
    reset();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-dark">Manajemen Santri</h1>
          <p className="mt-1 text-muted-foreground">Kelola data santri, halaqah, dan target hafalan</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-soft">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Santri
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Santri Baru</DialogTitle>
              <DialogDescription>
                Masukkan data santri baru. Klik simpan setelah selesai.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField label="Nama Lengkap" required error={errors.nama?.message}>
                <Input {...register("nama")} placeholder="Masukkan nama lengkap" />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="NIS" required error={errors.nis?.message}>
                  <Input {...register("nis")} placeholder="Nomor Induk" />
                </FormField>
                <FormField label="Target Juz" required error={errors.targetJuz?.message}>
                  <Input type="number" {...register("targetJuz")} placeholder="Target" />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Halaqah" required error={errors.halaqah?.message}>
                  <Select onValueChange={(v) => setValue("halaqah", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {halaqahList.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Nomor HP" required error={errors.noHp?.message}>
                  <Input {...register("noHp")} placeholder="08..." />
                </FormField>
              </div>

              <FormField label="Alamat Lengkap" error={errors.alamat?.message}>
                <Input {...register("alamat")} placeholder="Masukkan alamat..." />
              </FormField>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                <SubmitButton isLoading={isSubmitting}>Simpan Santri</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchInput 
            value={globalFilter} 
            onChange={setGlobalFilter} 
            placeholder="Cari nama, NIS..." 
            className="w-full md:w-80"
          />
          <div className="flex gap-4 flex-wrap">
            <FilterDropdown 
              label="Halaqah"
              value={halaqahFilter}
              onChange={setHalaqahFilter}
              options={halaqahList.map(h => ({ value: h, label: h }))}
            />
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "active", label: "Aktif" },
                { value: "inactive", label: "Tidak Aktif" },
              ]}
            />
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredData} 
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          emptyIcon={Users}
          emptyTitle="Data santri tidak ditemukan"
        />
      </div>
    </motion.div>
  );
}
