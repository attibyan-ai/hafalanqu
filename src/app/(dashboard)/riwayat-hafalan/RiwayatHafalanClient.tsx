"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader, DataTable, SearchInput, FilterDropdown } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDate, getKualitasColor, getKualitasLabel } from "@/lib/utils";
import { deleteHafalan } from "@/actions/hafalan";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

interface HafalanData {
  id: string;
  tanggal: Date;
  santriNama: string;
  surah: string;
  ayatMulai: number;
  ayatAkhir: number;
  jenis: string;
  kualitas: string;
}

const columns = (
  onDelete: (id: string) => void, 
  locale: string, 
  timezone: string
): ColumnDef<HafalanData>[] => [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => <span className="font-medium">{formatDate(row.original.tanggal.toISOString(), locale, timezone)}</span>,
  },
  {
    accessorKey: "santriNama",
    header: "Santri",
    cell: ({ row }) => <span className="font-semibold text-dark">{row.original.santriNama}</span>,
  },
  {
    accessorKey: "surah",
    header: "Surah",
  },
  {
    id: "ayat",
    header: "Ayat",
    cell: ({ row }) => `${row.original.ayatMulai} - ${row.original.ayatAkhir}`,
  },
  {
    accessorKey: "jenis",
    header: "Jenis",
    cell: ({ row }) => (
      <Badge variant={row.original.jenis.toLowerCase() === "ziyadah" ? "default" : "secondary"}>
        {row.original.jenis === "ziyadah" ? "Ziyadah" : "Muraja'ah"}
      </Badge>
    ),
  },
  {
    accessorKey: "kualitas",
    header: "Kualitas",
    cell: ({ row }) => (
      <Badge className={getKualitasColor(row.original.kualitas)} variant="outline">
        {getKualitasLabel(row.original.kualitas)}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(row.original.id)} aria-label="Hapus riwayat hafalan">
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    ),
  },
];

export default function RiwayatHafalanClient({ initialData }: { initialData: any[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [kualitasFilter, setKualitasFilter] = useState("all");
  
  const { bahasa, zonaWaktu } = useSettings();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedData: HafalanData[] = initialData.map(h => ({
    id: h.id,
    tanggal: h.tanggal,
    santriNama: h.santri?.nama || "Unknown",
    surah: h.surah,
    ayatMulai: h.ayatMulai,
    ayatAkhir: h.ayatAkhir,
    jenis: h.jenis,
    kualitas: h.kualitas,
  }));

  const filteredData = formattedData.filter(item => {
    if (jenisFilter !== "all" && item.jenis.toLowerCase() !== jenisFilter.toLowerCase()) return false;
    if (kualitasFilter !== "all" && item.kualitas.toLowerCase() !== kualitasFilter.toLowerCase()) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteHafalan(deleteId);
      toast.success("Riwayat hafalan berhasil dihapus");
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus riwayat hafalan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader 
        title="Riwayat Hafalan" 
        subtitle="Lihat dan kelola seluruh riwayat setoran hafalan santri"
      />

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchInput 
            value={globalFilter} 
            onChange={setGlobalFilter} 
            placeholder="Cari santri, surah..." 
            className="w-full md:w-80"
          />
          <div className="flex gap-4 flex-wrap">
            <FilterDropdown 
              label="Jenis Hafalan"
              value={jenisFilter}
              onChange={setJenisFilter}
              options={[
                { value: "ziyadah", label: "Ziyadah" },
                { value: "murajaah", label: "Muraja'ah" },
              ]}
            />
            <FilterDropdown 
              label="Kualitas"
              value={kualitasFilter}
              onChange={setKualitasFilter}
              options={[
                { value: "mumtaz", label: "Mumtaz" },
                { value: "jayyid-jiddan", label: "Jayyid Jiddan" },
                { value: "jayyid", label: "Jayyid" },
                { value: "maqbul", label: "Maqbul" },
                { value: "ghair-maqbul", label: "Ghair Maqbul" },
              ]}
            />
          </div>
        </div>

        <DataTable 
          columns={columns(handleDelete, bahasa, zonaWaktu)} 
          data={filteredData} 
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px] text-center p-8">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Hapus Riwayat Hafalan</DialogTitle>
            <DialogDescription className="text-center text-base">
              Apakah Anda yakin ingin menghapus data riwayat hafalan ini?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-center mt-6">
            <Button variant="outline" className="w-full" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="destructive" className="w-full" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
