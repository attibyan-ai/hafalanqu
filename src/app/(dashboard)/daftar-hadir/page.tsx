"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader, StatCard } from "@/components/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { attendanceMatrix } from "@/constants/mock-data";
import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Users, UserCheck, UserMinus, UserX } from "lucide-react";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function DaftarHadirPage() {
  const [selectedMonth, setSelectedMonth] = useState("5"); // Mei (1-indexed)
  const [selectedYear, setSelectedYear] = useState("2026");

  // Calculate days in month (mocking 28 days for February, 30/31 for others)
  const daysInMonth = 28; // Simplified for the mock data
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calculate stats from matrix
  const stats = useMemo(() => {
    let hadir = 0, izin = 0, sakit = 0, alpha = 0;
    attendanceMatrix.forEach(santri => {
      Object.values(santri.records).forEach(status => {
        if (status === "hadir") hadir++;
        if (status === "izin") izin++;
        if (status === "sakit") sakit++;
        if (status === "alpha") alpha++;
      });
    });
    return { hadir, izin, sakit, alpha };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader 
        title="Daftar Hadir" 
        subtitle="Rekap kehadiran santri bulanan"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Hadir" value={stats.hadir} icon={UserCheck} color="success" />
        <StatCard title="Total Izin" value={stats.izin} icon={Users} color="warning" />
        <StatCard title="Total Sakit" value={stats.sakit} icon={UserMinus} color="info" />
        <StatCard title="Total Alpha" value={stats.alpha} icon={UserX} color="danger" />
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-bold text-xl text-dark">Matriks Kehadiran</h3>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={`${i + 1}`}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="sticky left-0 bg-gray-50 z-10 px-4 py-3 text-left font-semibold text-dark min-w-[180px] border-r border-gray-100">Nama Santri</th>
                {days.map(day => (
                  <th key={day} className="px-2 py-3 font-semibold text-muted-foreground min-w-[40px] border-r border-gray-100 last:border-r-0">
                    {day}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-dark min-w-[80px] bg-primary-50">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {attendanceMatrix.map((santri, idx) => {
                const dates = Object.keys(santri.records).sort();
                let hadirCount = 0;
                
                return (
                  <tr key={santri.santriId} className={cn("border-b border-gray-100 hover:bg-gray-50/50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-gray-50/30")}>
                    <td className={cn("sticky left-0 z-10 px-4 py-3 text-left font-medium text-dark border-r border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                      {santri.santriNama}
                    </td>
                    
                    {days.map((day, i) => {
                      // Map day to the actual record date for mock data
                      const dateKey = dates[i % dates.length];
                      const status = santri.records[dateKey] || "hadir";
                      if (status === "hadir") hadirCount++;
                      
                      return (
                        <td key={day} className="px-1 py-3 border-r border-gray-100 last:border-r-0">
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn(
                                  "w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm cursor-help",
                                  getStatusColor(status)
                                )}>
                                  {status === "hadir" ? "✓" : status === "izin" ? "I" : status === "sakit" ? "S" : "✗"}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getStatusLabel(status)} ({day} {MONTHS[Number(selectedMonth)-1]})</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 font-bold text-primary bg-primary-50/30">
                      {Math.round((hadirCount / daysInMonth) * 100)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 justify-center text-sm border-t pt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="font-medium text-muted-foreground">Hadir (✓)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400"></div>
            <span className="font-medium text-muted-foreground">Izin (I)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <span className="font-medium text-muted-foreground">Sakit (S)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="font-medium text-muted-foreground">Alpha (✗)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
