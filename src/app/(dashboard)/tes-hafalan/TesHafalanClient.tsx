"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageHeader, FormField } from "@/components/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, HelpCircle, ChevronRight } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { surahList } from "@/constants/surah";

const testTypes = [
  {
    id: "sambung-setelah",
    title: "Sambung Ayat Setelahnya",
    desc: "Lanjutkan ayat yang ditampilkan",
    icon: ArrowRight,
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50 text-emerald-600"
  },
  {
    id: "sambung-sebelum",
    title: "Sambung Ayat Sebelumnya",
    desc: "Sebutkan ayat sebelum yang ditampilkan",
    icon: ArrowLeft,
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50 text-blue-600"
  },
  {
    id: "tebak-surah",
    title: "Tebak Surah",
    desc: "Tebak surah dari ayat yang ditampilkan",
    icon: HelpCircle,
    color: "from-purple-500 to-purple-700",
    bgLight: "bg-purple-50 text-purple-600"
  }
];

export default function TesHafalanClient({ initialData, santris }: { initialData: any[], santris: any[] }) {
  const router = useRouter();
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState("");
  
  const [selectedSantri, setSelectedSantri] = useState("");
  const [targetType, setTargetType] = useState("juz");
  const [targetValue, setTargetValue] = useState("");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-700";
    if (score >= 70) return "bg-blue-100 text-blue-700";
    if (score >= 50) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const openSetup = (id: string) => {
    setSelectedTestId(id);
    setIsSetupOpen(true);
  };

  const handleStartQuiz = () => {
    if (!selectedSantri || !targetValue) {
      toast.error("Mohon lengkapi semua pilihan (Santri dan Target)");
      return;
    }
    router.push(`/tes-hafalan/play?jenis=${selectedTestId}&santriId=${selectedSantri}&targetType=${targetType}&targetValue=${targetValue}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader 
        title="Tes Hafalan" 
        subtitle="Uji kemampuan hafalan santri dengan tes interaktif"
      />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {testTypes.map((test, i) => {
          const Icon = test.icon;
          return (
            <motion.div 
              key={test.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="card p-6 border-transparent shadow-soft-md group relative overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
              <div className={`absolute inset-0 bg-white group-hover:bg-white/95 transition-colors duration-300 -z-10`}></div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${test.bgLight} group-hover:bg-white/20 group-hover:text-white`}>
                <Icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-dark group-hover:text-dark mb-2 transition-colors">{test.title}</h3>
              <p className="text-muted-foreground group-hover:text-gray-600 mb-8 transition-colors flex-1">{test.desc}</p>
              
              <Button 
                onClick={() => openSetup(test.id)}
                className="w-full justify-between bg-primary/10 text-primary hover:bg-primary hover:text-white border-0 group-hover:shadow-lg transition-all mt-auto" 
                variant="outline"
              >
                Mulai Tes
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="card p-6">
        <h3 className="font-bold text-xl text-dark mb-6">Riwayat Tes Terbaru</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.03] border-b text-muted-foreground">
              <tr>
                <th className="h-12 px-4 font-semibold">Tanggal</th>
                <th className="h-12 px-4 font-semibold">Santri</th>
                <th className="h-12 px-4 font-semibold">Jenis Tes</th>
                <th className="h-12 px-4 font-semibold">Skor</th>
              </tr>
            </thead>
            <tbody>
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Belum ada riwayat tes</td>
                </tr>
              ) : initialData.map((hasil) => (
                <tr key={hasil.id} className="border-b hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-4 font-medium text-muted-foreground">
                    {formatDateShort(hasil.tanggal.toISOString())}
                  </td>
                  <td className="px-4 py-4 font-semibold text-dark">
                    {hasil.santri?.nama}
                  </td>
                  <td className="px-4 py-4">
                    <span className="capitalize text-muted-foreground">
                      {hasil.jenis.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <Badge className={`${getScoreColor(hasil.nilai)} w-10 justify-center font-bold`} variant="outline">
                        {hasil.nilai}
                      </Badge>
                      <div className="w-24 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getScoreBarColor(hasil.nilai)}`}
                          style={{ width: `${hasil.nilai}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Persiapan Tes Hafalan</DialogTitle>
            <DialogDescription>
              Silakan lengkapi data berikut sebelum kuis dimulai.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <FormField label="Pilih Santri">
              <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih santri..." />
                </SelectTrigger>
                <SelectContent>
                  {santris?.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Target Mode">
              <Select value={targetType} onValueChange={(val) => {
                setTargetType(val);
                setTargetValue("");
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juz">Berdasarkan Juz</SelectItem>
                  <SelectItem value="surah">Berdasarkan Surah</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label={targetType === "juz" ? "Pilih Juz" : "Pilih Surah"}>
              <Select value={targetValue} onValueChange={setTargetValue}>
                <SelectTrigger>
                  <SelectValue placeholder={targetType === "juz" ? "Pilih Juz..." : "Pilih Surah..."} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {targetType === "juz" 
                    ? Array.from({length: 30}, (_, i) => i + 1).map(j => (
                        <SelectItem key={j} value={j.toString()}>Juz {j}</SelectItem>
                      ))
                    : surahList.map((surah, index) => (
                        <SelectItem key={surah} value={(index + 1).toString()}>{surah}</SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <DialogFooter>
            <Button onClick={handleStartQuiz} className="w-full">Masuk Kuis</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
