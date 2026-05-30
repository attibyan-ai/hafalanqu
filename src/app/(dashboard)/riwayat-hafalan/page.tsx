"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Download } from "lucide-react";
import { PageHeader, DataTable, SearchInput, FilterDropdown } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hafalanList } from "@/constants/mock-data";
import { Hafalan } from "@/types";
import { formatDate, getKualitasColor, getKualitasLabel } from "@/lib/utils";

const columns: ColumnDef<Hafalan>[] = [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => <span className="font-medium">{formatDate(row.original.tanggal)}</span>,
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
      <Badge variant={row.original.jenis === "ziyadah" ? "default" : "secondary"}>
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

export default function RiwayatHafalanPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [kualitasFilter, setKualitasFilter] = useState("all");

  const filteredData = hafalanList.filter(item => {
    if (jenisFilter !== "all" && item.jenis !== jenisFilter) return false;
    if (kualitasFilter !== "all" && item.kualitas !== kualitasFilter) return false;
    return true;
  });

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
          columns={columns} 
          data={filteredData} 
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </motion.div>
  );
}
