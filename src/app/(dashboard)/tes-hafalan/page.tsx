"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, HelpCircle, Shuffle, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { hasilTesList } from "@/constants/mock-data";
import { formatDateShort } from "@/lib/utils";

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
  },
  {
    id: "susun-ulang",
    title: "Susun Ulang Ayat",
    desc: "Susun ayat dalam urutan yang benar",
    icon: Shuffle,
    color: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-50 text-amber-600"
  }
];

export default function TesHafalanPage() {
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
              
              <Button className="w-full justify-between bg-primary/10 text-primary hover:bg-primary hover:text-white border-0 group-hover:shadow-lg transition-all mt-auto" variant="outline">
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
            <thead className="bg-gray-50 border-b text-muted-foreground">
              <tr>
                <th className="h-12 px-4 font-semibold">Tanggal</th>
                <th className="h-12 px-4 font-semibold">Santri</th>
                <th className="h-12 px-4 font-semibold">Jenis Tes</th>
                <th className="h-12 px-4 font-semibold">Benar/Salah</th>
                <th className="h-12 px-4 font-semibold">Durasi</th>
                <th className="h-12 px-4 font-semibold">Skor</th>
              </tr>
            </thead>
            <tbody>
              {hasilTesList.map((hasil) => (
                <tr key={hasil.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-muted-foreground">
                    {formatDateShort(hasil.tanggal)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-dark">
                    {hasil.santriNama}
                  </td>
                  <td className="px-4 py-4">
                    <span className="capitalize text-muted-foreground">
                      {hasil.jenisTes.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">{hasil.benar}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">{hasil.salah}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {Math.floor(hasil.durasi / 60)}:{(hasil.durasi % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <Badge className={`${getScoreColor(hasil.skor)} w-10 justify-center font-bold`} variant="outline">
                        {hasil.skor}
                      </Badge>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getScoreBarColor(hasil.skor)}`}
                          style={{ width: `${hasil.skor}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
