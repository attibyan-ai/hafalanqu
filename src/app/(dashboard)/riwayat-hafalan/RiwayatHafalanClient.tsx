"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Download } from "lucide-react";
import { PageHeader, DataTable, SearchInput, FilterDropdown } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getKualitasColor, getKualitasLabel } from "@/lib/utils";
import { deleteHafalan } from "@/actions/hafalan";
import { toast } from "sonner";

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

const columns = (onDelete: (id: string) => void): ColumnDef<HafalanData>[] => [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => <span className="font-medium">{formatDate(row.original.tanggal.toISOString())}</span>,
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
      <Badge variant={row.original.jenis === "Ziyadah" ? "default" : "secondary"}>
        {row.original.jenis}
      </Badge>
    ),
  },
  {
    accessorKey: "kualitas",
    header: "Kualitas",
    cell: ({ row }) => (
      <Badge className={getKualitasColor(row.original.kualitas)} variant="outline">
        {row.original.kualitas}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(row.original.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function RiwayatHafalanClient({ initialData }: { initialData: any[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [kualitasFilter, setKualitasFilter] = useState("all");

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

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus riwayat hafalan ini?")) {
      try {
        await deleteHafalan(id);
        toast.success("Riwayat hafalan berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus riwayat hafalan");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader 
        title="Riwayat Hafalan" 
        subtitle="Lihat dan kelola seluruh riwayat setoran hafalan santri"
      >
        <Button variant="outline" className="hidden sm:flex">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </PageHeader>

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
                { value: "Ziyadah", label: "Ziyadah" },
                { value: "Muraja'ah", label: "Muraja'ah" },
              ]}
            />
            <FilterDropdown 
              label="Kualitas"
              value={kualitasFilter}
              onChange={setKualitasFilter}
              options={[
                { value: "Mumtaz", label: "Mumtaz" },
                { value: "Jayyid Jiddan", label: "Jayyid Jiddan" },
                { value: "Jayyid", label: "Jayyid" },
                { value: "Maqbul", label: "Maqbul" },
                { value: "Ghair Maqbul", label: "Ghair Maqbul" },
              ]}
            />
          </div>
        </div>

        <DataTable 
          columns={columns(handleDelete)} 
          data={filteredData} 
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </motion.div>
  );
}
