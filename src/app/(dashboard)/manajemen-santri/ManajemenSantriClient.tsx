"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Eye, Pencil, Trash2 } from "lucide-react";
import { SearchInput, FilterDropdown, DataTable } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { ColumnDef } from "@tanstack/react-table";
import { createSantri, deleteSantri } from "@/actions/santri";
import { useSearchParams, useRouter } from "next/navigation";

interface SantriData {
  id: string;
  nama: string;
  nis: string;
  halaqah: string;
  progressJuz: number;
  targetJuz: number;
  status: string;
  avatar?: string | null;
}

const columns = (onDelete: (id: string) => void): ColumnDef<SantriData>[] => [
  {
    accessorKey: "nama",
    header: "Nama Santri",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-gray-100 dark:border-white/10">
          {row.original.avatar && <AvatarImage src={row.original.avatar} />}
          <AvatarFallback className="bg-primary-50 text-primary">{getInitials(row.original.nama)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-50">{row.original.nama}</p>
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
      const percentage = targetJuz > 0 ? Math.round((progressJuz / targetJuz) * 100) : 0;
      return (
        <div className="flex items-center gap-3 min-w-[150px]">
          <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
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
      <Badge className={row.original.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/30" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10"} variant="outline">
        {row.original.status === "active" ? "Aktif" : "Tidak Aktif"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(row.original.id)} aria-label="Hapus santri">
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    ),
  },
];

const formSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nis: z.string().min(3, "NIS minimal 3 karakter"),
  halaqah: z.string().min(1, "Halaqah wajib dipilih"),
  targetJuz: z.string().min(1, "Target wajib diisi"),
});

export default function ManajemenSantriClient({ initialData, halaqahList }: { initialData: SantriData[], halaqahList: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const queryHalaqoh = searchParams.get("halaqoh");
  
  const [globalFilter, setGlobalFilter] = useState("");
  const [halaqahFilter, setHalaqahFilter] = useState(queryHalaqoh || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      halaqah: queryHalaqoh || ""
    }
  });

  // Sync state if query string changes (e.g. going back/forward)
  useEffect(() => {
    if (queryHalaqoh) {
      setHalaqahFilter(queryHalaqoh);
      setValue("halaqah", queryHalaqoh);
    }
  }, [queryHalaqoh, setValue]);

  const handleHalaqahFilterChange = (val: string) => {
    setHalaqahFilter(val);
    
    // Update URL without reloading page
    const newParams = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      newParams.delete("halaqoh");
    } else {
      newParams.set("halaqoh", val);
    }
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const filteredData = initialData.filter(item => {
    if (halaqahFilter !== "all" && item.halaqah !== halaqahFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteSantri(deleteId);
      toast.success("Santri berhasil dihapus");
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus santri");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createSantri({
        nama: data.nama,
        nis: data.nis,
        halaqah: data.halaqah,
        targetJuz: parseInt(data.targetJuz),
      });
      toast.success("Data santri berhasil ditambahkan");
      setIsAddOpen(false);
      reset({ halaqah: halaqahFilter !== "all" ? halaqahFilter : "" });
    } catch (error) {
      toast.error("Gagal menambahkan santri. Mungkin NIS sudah ada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Manajemen Santri</h1>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Halaqah" required error={errors.halaqah?.message}>
                  <Select value={watch("halaqah")} onValueChange={(v) => setValue("halaqah", v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {halaqahList.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

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
          <div className="grid grid-cols-2 md:flex gap-2 md:gap-4 w-full md:w-auto">
            <FilterDropdown 
              label="Halaqah"
              value={halaqahFilter}
              onChange={handleHalaqahFilterChange}
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
          columns={columns(handleDelete)} 
          data={filteredData} 
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          emptyIcon={Users}
          emptyTitle="Data santri tidak ditemukan"
        />
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="sm:max-w-[400px] text-center p-8">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">Hapus Santri</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Apakah Anda yakin ingin menghapus santri ini? Data hafalan dan kehadiran yang terhubung juga akan terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <AlertDialogCancel className="w-full sm:w-auto" disabled={isDeleting}>
              Batal
            </AlertDialogCancel>
            <Button variant="destructive" className="w-full sm:w-auto" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
