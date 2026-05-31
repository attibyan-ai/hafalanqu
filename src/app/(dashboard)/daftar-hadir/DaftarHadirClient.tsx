"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PageHeader, StatCard, SubmitButton, FormField } from "@/components/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Users, UserCheck, UserMinus, UserX, Trash2 } from "lucide-react";
import { setKehadiran, deleteKehadiran } from "@/actions/kehadiran";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function DaftarHadirClient({ initialData, santris, hafalans }: { initialData: any[], santris: any[], hafalans: any[] }) {
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ santriId: string, santriNama: string, day: number, status: string } | null>(null);
  const [formStatus, setFormStatus] = useState("hadir");

  const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group kehadiran by santriId and day
  const matrix = useMemo(() => {
    const data: Record<string, Record<string, string>> = {};
    santris.forEach(s => { data[s.id] = {}; });
    
    // 1. Manually set kehadiran
    initialData.forEach(k => {
      const date = new Date(k.tanggal);
      if (date.getMonth() + 1 === parseInt(selectedMonth) && date.getFullYear() === parseInt(selectedYear)) {
        if (data[k.santriId]) {
          data[k.santriId][date.getDate()] = k.status;
        }
      }
    });

    // 2. Infer from hafalans (overwrites if there is a manual record, or fills empty)
    hafalans?.forEach(h => {
      const date = new Date(h.tanggal);
      if (date.getMonth() + 1 === parseInt(selectedMonth) && date.getFullYear() === parseInt(selectedYear)) {
        if (data[h.santriId]) {
          data[h.santriId][date.getDate()] = "hadir";
        }
      }
    });

    return data;
  }, [initialData, selectedMonth, selectedYear, santris, hafalans]);

  const stats = useMemo(() => {
    let hadir = 0, izin = 0, sakit = 0, udzur = 0, alpha = 0;
    Object.values(matrix).forEach(records => {
      Object.values(records).forEach(status => {
        if (status === "hadir") hadir++;
        else if (status === "izin") izin++;
        else if (status === "sakit") sakit++;
        else if (status === "udzur") udzur++;
        else if (status === "alpha") alpha++;
      });
    });
    return { hadir, izin, sakit, udzur, alpha };
  }, [matrix]);

  const handleCellClick = (santriId: string, santriNama: string, day: number, status: string) => {
    setSelectedCell({ santriId, santriNama, day, status: status || "hadir" });
    setFormStatus(status || "hadir");
    setIsDialogOpen(true);
  };

  const checkHasHafalan = () => {
    if (!selectedCell) return false;
    return hafalans?.some(h => {
      if (h.santriId !== selectedCell.santriId) return false;
      const date = new Date(h.tanggal);
      return date.getDate() === selectedCell.day && 
             date.getMonth() + 1 === parseInt(selectedMonth) && 
             date.getFullYear() === parseInt(selectedYear);
    });
  };

  const getTargetDateStr = () => {
    if (!selectedCell) return "";
    return `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedCell.day.toString().padStart(2, '0')}`;
  };

  const handleSaveKehadiran = async () => {
    if (!selectedCell) return;
    if (formStatus !== "hadir" && checkHasHafalan()) {
      toast.error("Tidak bisa diubah karena santri sudah setor hafalan hari ini.");
      return;
    }

    setIsSubmitting(true);
    try {
      await setKehadiran(selectedCell.santriId, getTargetDateStr(), formStatus);
      toast.success("Kehadiran berhasil disimpan");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan kehadiran");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKehadiran = async () => {
    if (!selectedCell) return;
    if (checkHasHafalan()) {
      toast.error("Tidak bisa dihapus karena santri sudah setor hafalan hari ini.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteKehadiran(selectedCell.santriId, getTargetDateStr());
      toast.success("Data kehadiran berhasil dihapus");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Gagal menghapus data kehadiran");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader 
        title="Daftar Hadir" 
        subtitle="Rekap kehadiran santri bulanan. Santri yang menyetor hafalan otomatis tercatat Hadir."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Hadir" value={stats.hadir} icon={UserCheck} color="success" />
        <StatCard title="Total Izin/Udzur" value={stats.izin + stats.udzur} icon={Users} color="warning" />
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

        <div className="text-xs text-muted-foreground mb-2 sm:hidden flex items-center gap-2">
          <span>👉</span> Geser tabel untuk melihat hari lainnya
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100 pb-2">
          <table className="w-full min-w-max text-sm text-center border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="sticky left-0 bg-gray-50 z-10 px-4 py-3 text-left font-semibold text-dark min-w-[180px] border-r border-gray-100">Nama Santri</th>
                {days.map(day => (
                  <th key={day} className="px-2 py-3 font-semibold text-muted-foreground min-w-[40px] border-r border-gray-100 last:border-r-0">
                    {day}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-dark min-w-[80px] bg-primary-50">Hadir</th>
              </tr>
            </thead>
            <tbody>
              {santris.length === 0 ? (
                <tr>
                  <td colSpan={days.length + 2} className="px-4 py-8 text-center text-muted-foreground">Belum ada data santri</td>
                </tr>
              ) : santris.map((santri, idx) => {
                const records = matrix[santri.id] || {};
                let hadirCount = 0;
                
                return (
                  <tr key={santri.id} className={cn("border-b border-gray-100 hover:bg-gray-50/50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-gray-50/30")}>
                    <td className={cn("sticky left-0 z-10 px-4 py-3 text-left font-medium text-dark border-r border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                      {santri.nama}
                    </td>
                    
                    {days.map((day) => {
                      const status = records[day];
                      if (status === "hadir") hadirCount++;
                      
                      return (
                        <td 
                          key={day} 
                          className="px-1 py-3 border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                          onClick={() => handleCellClick(santri.id, santri.nama, day, status)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Kehadiran hari ke-${day}, status: ${status || 'belum diisi'}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleCellClick(santri.id, santri.nama, day, status);
                            }
                          }}
                        >
                          {status ? (
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={cn(
                                    "w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                                    getStatusColor(status)
                                  )}>
                                    {status === "hadir" ? "✓" : status === "izin" ? "I" : status === "sakit" ? "S" : status === "udzur" ? "U" : "✗"}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{getStatusLabel(status)} ({day} {MONTHS[Number(selectedMonth)-1]})</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div className="w-6 h-6 mx-auto rounded-full bg-gray-50 border border-gray-100 hover:border-gray-300"></div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 font-bold text-primary bg-primary-50/30">
                      {hadirCount}
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
            <div className="w-4 h-4 rounded-full bg-purple-400"></div>
            <span className="font-medium text-muted-foreground">Udzur (U)</span>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input Kehadiran Manual</DialogTitle>
            <DialogDescription>
              {selectedCell?.santriNama} — {selectedCell?.day} {MONTHS[parseInt(selectedMonth) - 1]} {selectedYear}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveKehadiran(); }}>
            <div className="py-4 space-y-4">
              <FormField label="Status Kehadiran">
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hadir">Hadir</SelectItem>
                    <SelectItem value="izin">Izin</SelectItem>
                    <SelectItem value="sakit">Sakit</SelectItem>
                    <SelectItem value="udzur">Udzur</SelectItem>
                    <SelectItem value="alpha">Alpha</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <DialogFooter className="flex justify-between w-full mt-4">
              <Button type="button" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 mr-auto" onClick={handleDeleteKehadiran} disabled={isDeleting}>
                {isDeleting ? "Menghapus..." : "Hapus Data"}
              </Button>
              <SubmitButton type="submit" isLoading={isSubmitting}>
                Simpan Kehadiran
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}
