"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText, Calendar, CheckSquare, Download, Activity } from "lucide-react";
import { PageHeader, SearchInput, FilterDropdown } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import type { LaporanItem } from "@/actions/laporan";
import * as XLSX from "xlsx";

interface LaporanGlobalClientProps {
  initialData: LaporanItem[];
}

export default function LaporanGlobalClient({ initialData }: LaporanGlobalClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredData = initialData.filter(item => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.santriNama.toLowerCase().includes(q) ||
        item.halaqah.toLowerCase().includes(q)
      );
    }
    
    return true;
  });

  const getIcon = (type: string) => {
    if (type === "hafalan") return <FileText className="w-5 h-5 text-emerald-600" />;
    if (type === "kehadiran") return <Calendar className="w-5 h-5 text-blue-600" />;
    if (type === "tes") return <CheckSquare className="w-5 h-5 text-amber-600" />;
    return <Activity className="w-5 h-5 text-gray-600" />;
  };

  const getBadgeColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("mumtaz") || s.includes("hadir") || s.includes("lulus")) return "bg-emerald-100 text-emerald-700";
    if (s.includes("jayyid")) return "bg-blue-100 text-blue-700";
    if (s.includes("izin") || s.includes("sakit") || s.includes("maqbul")) return "bg-amber-100 text-amber-700";
    if (s.includes("alfa") || s.includes("mengulang") || s.includes("ghair")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const exportToExcel = () => {
    const exportData = filteredData.map(item => ({
      "Tanggal": formatDateShort(new Date(item.tanggal).toISOString()),
      "Tipe Aktivitas": item.type.toUpperCase(),
      "Halaqah": item.halaqah,
      "Nama Santri": item.santriNama,
      "Detail": item.detailSingkat,
      "Status/Predikat": item.kualitasAtauStatus
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Global");
    
    XLSX.writeFile(workbook, `Laporan_Global_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan Global" 
        subtitle="Lihat semua riwayat aktivitas dari seluruh halaqoh secara lengkap" 
      >
        <Button onClick={exportToExcel} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Ekspor Excel
        </Button>
      </PageHeader>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari nama santri atau halaqoh..."
            className="w-full md:w-80"
          />
          <div className="w-full md:w-auto">
            <FilterDropdown 
              label="Tipe Aktivitas"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "hafalan", label: "Hafalan" },
                { value: "kehadiran", label: "Kehadiran" },
                { value: "tes", label: "Tes Ujian" },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 font-medium border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl w-12"></th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Nama Santri</th>
                <th className="px-4 py-3">Halaqah</th>
                <th className="px-4 py-3">Aktivitas</th>
                <th className="px-4 py-3 rounded-tr-xl">Status/Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    Belum ada data aktivitas yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.2 }}
                    key={item.id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                        {getIcon(item.type)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark">{formatDateShort(new Date(item.tanggal).toISOString())}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-dark">{item.santriNama}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.halaqah}</td>
                    <td className="px-4 py-3 max-w-xs truncate" title={item.detailSingkat}>
                      {item.detailSingkat}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${getBadgeColor(item.kualitasAtauStatus)} capitalize border-transparent font-semibold`}>
                        {item.kualitasAtauStatus.replace("-", " ")}
                      </Badge>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
