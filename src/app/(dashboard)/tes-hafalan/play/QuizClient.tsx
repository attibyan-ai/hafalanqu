"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/shared";
import { saveHasilTes } from "@/actions/tes";

type Question = {
  id: number;
  questionText: string;
  correctAnswer: string;
  options: string[];
  surahName: string;
  ayahNumber: number;
};

export default function QuizClient({ santris }: { santris: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jenis = searchParams.get("jenis") || "tebak-surah";
  const santriId = searchParams.get("santriId") || "";
  const targetType = searchParams.get("targetType") || "juz";
  const targetValue = searchParams.get("targetValue") || "30";

  const [mode, setMode] = useState<"loading" | "playing" | "result">("loading");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const jenisLabel = useMemo(() => {
    if (jenis === "sambung-setelah") return "Sambung Ayat Setelahnya";
    if (jenis === "sambung-sebelum") return "Sambung Ayat Sebelumnya";
    if (jenis === "tebak-surah") return "Tebak Surah";
    return "Tes Hafalan";
  }, [jenis]);

  useEffect(() => {
    let isMounted = true;

    const handleStart = async () => {
      if (!santriId) {
        toast.error("Data santri tidak ditemukan");
        router.push("/tes-hafalan");
        return;
      }
      if (isMounted) setMode("loading");

      try {
        const endpoint = targetType === "juz" 
          ? `https://api.alquran.cloud/v1/juz/${targetValue}/quran-uthmani`
          : `https://api.alquran.cloud/v1/surah/${targetValue}/quran-uthmani`;
        
        const res = await fetch(endpoint);
        const data = await res.json();
        const ayahs = data.data.ayahs;

        if (!ayahs || ayahs.length === 0) {
          throw new Error("Data ayat kosong");
        }

        const generatedQuestions: Question[] = [];
        const usedIndices = new Set<number>();
        
        // Prevent infinite loop if ayahs.length is too small
        const numQuestions = Math.min(5, ayahs.length > 2 ? 5 : 0);
        if (numQuestions === 0) {
          throw new Error("Ayat terlalu sedikit untuk diuji");
        }

        for (let i = 0; i < numQuestions; i++) {
          let r = Math.floor(Math.random() * ayahs.length);
          let attempts = 0;
          
          if (jenis === "sambung-setelah") {
            // ensure not the last ayah
            while ((usedIndices.has(r) || r === ayahs.length - 1 || ayahs[r].surah.number !== ayahs[r+1].surah.number) && attempts < 100) {
              r = Math.floor(Math.random() * ayahs.length);
              attempts++;
            }
            if (attempts >= 100) continue;
            usedIndices.add(r);
            
            const qAyah = ayahs[r];
            const correctAyah = ayahs[r+1];
            
            const options = [correctAyah.text];
            let optAttempts = 0;
            while(options.length < 4 && optAttempts < 50) {
              const wrong = ayahs[Math.floor(Math.random() * ayahs.length)].text;
              if (!options.includes(wrong)) options.push(wrong);
              optAttempts++;
            }

            generatedQuestions.push({
              id: i,
              questionText: qAyah.text,
              correctAnswer: correctAyah.text,
              options: options.sort(() => Math.random() - 0.5),
              surahName: qAyah.surah.name,
              ayahNumber: qAyah.numberInSurah,
            });
          } 
          else if (jenis === "sambung-sebelum") {
            // ensure not the first ayah
            while ((usedIndices.has(r) || r === 0 || ayahs[r].surah.number !== ayahs[r-1].surah.number) && attempts < 100) {
              r = Math.floor(Math.random() * ayahs.length);
              attempts++;
            }
            if (attempts >= 100) continue;
            usedIndices.add(r);
            
            const qAyah = ayahs[r];
            const correctAyah = ayahs[r-1];
            
            const options = [correctAyah.text];
            let optAttempts = 0;
            while(options.length < 4 && optAttempts < 50) {
              const wrong = ayahs[Math.floor(Math.random() * ayahs.length)].text;
              if (!options.includes(wrong)) options.push(wrong);
              optAttempts++;
            }

            generatedQuestions.push({
              id: i,
              questionText: qAyah.text,
              correctAnswer: correctAyah.text,
              options: options.sort(() => Math.random() - 0.5),
              surahName: qAyah.surah.name,
              ayahNumber: qAyah.numberInSurah,
            });
          }
          else { // tebak-surah
            while (usedIndices.has(r) && attempts < 100) {
              r = Math.floor(Math.random() * ayahs.length);
              attempts++;
            }
            if (attempts >= 100) continue;
            usedIndices.add(r);
            
            const qAyah = ayahs[r];
            const correctSurah = qAyah.surah.name;
            
            const options = [correctSurah];
            let optAttempts = 0;
            while(options.length < 4 && optAttempts < 50) {
              const wrong = ayahs[Math.floor(Math.random() * ayahs.length)].surah.name;
              if (!options.includes(wrong)) options.push(wrong);
              optAttempts++;
            }

            generatedQuestions.push({
              id: i,
              questionText: qAyah.text,
              correctAnswer: correctSurah,
              options: options.sort(() => Math.random() - 0.5),
              surahName: correctSurah,
              ayahNumber: qAyah.numberInSurah,
            });
          }
        }

        if (isMounted && generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
          setMode("playing");
        } else if (isMounted) {
          throw new Error("Gagal membuat soal");
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Gagal memuat soal dari server Alquran");
          router.push("/tes-hafalan");
        }
      }
    };

    handleStart();

    return () => {
      isMounted = false;
    };
  }, [jenis, santriId, targetType, targetValue, router]);

  const handleAnswer = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(opt);
    setIsAnswerChecked(true);

    if (opt === questions[currentIndex].correctAnswer) {
      const newScore = scoreRef.current + 20;
      scoreRef.current = newScore;
      setScore(newScore); // 5 questions = 20 pts each
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      // Finish
      setMode("result");
      setIsSaving(true);
      try {
        const targetString = targetType === "juz" ? `Juz ${targetValue}` : `Surah ${targetValue}`;
        await saveHasilTes(santriId, jenis, scoreRef.current, targetString);
        toast.success("Hasil tes berhasil disimpan");
      } catch (e) {
        toast.error("Gagal menyimpan hasil tes");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (mode === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Menyiapkan soal dari Alquran Cloud...</p>
      </div>
    );
  }

  if (mode === "result") {
    const santriName = santris.find(s => s.id === santriId)?.nama;
    return (
      <div className="max-w-xl mx-auto mt-10">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-8 text-center">
          <div className="w-24 h-24 mx-auto bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">Tes Selesai!</h1>
          <p className="text-muted-foreground mb-8">Hasil tes untuk <strong className="text-dark">{santriName}</strong></p>
          
          <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-6 mb-8 border border-gray-100 dark:border-white/[0.08]">
            <div className="text-sm text-muted-foreground font-medium mb-1">Total Skor</div>
            <div className={`text-6xl font-extrabold ${scoreRef.current >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {scoreRef.current}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Dari 100 poin (5 Soal)</div>
          </div>
          
          <Button className="w-full h-12" onClick={() => router.push("/tes-hafalan")} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isSaving ? "Menyimpan..." : "Kembali ke Beranda Tes"}
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-dark">{jenisLabel}</h2>
        <div className="bg-white px-4 py-2 rounded-full font-bold text-primary shadow-sm text-sm">
          Soal {currentIndex + 1} / 5
        </div>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="card p-8 md:p-12 mb-8 text-center"
      >
        <div className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
          {jenis === "tebak-surah" ? "Surah Apa Ini?" : "Lanjutkan Ayat Berikut"}
        </div>
        <div 
          className="font-amiri text-3xl md:text-4xl leading-[2.5] text-dark mb-8" 
          dir="rtl"
        >
          {currentQ.questionText}
        </div>
        {(jenis === "sambung-setelah" || jenis === "sambung-sebelum") && (
          <div className="text-sm text-muted-foreground">
            {currentQ.surahName} : {currentQ.ayahNumber}
          </div>
        )}
      </motion.div>

      <div className="grid gap-4">
        <AnimatePresence>
          {currentQ.options.map((opt, idx) => {
            let btnClass = "border-gray-200 dark:border-white/10 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-50/10 text-gray-900 dark:text-gray-50";
            let icon = null;
            
            if (isAnswerChecked) {
              if (opt === currentQ.correctAnswer) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
              } else if (opt === selectedAnswer) {
                btnClass = "border-red-500 bg-red-50 text-red-800";
                icon = <XCircle className="w-5 h-5 text-red-500" />;
              } else {
                btnClass = "border-gray-100 dark:border-white/[0.06] opacity-50 bg-gray-50 dark:bg-white/[0.02] text-gray-400";
              }
            }

            return (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={isAnswerChecked}
                whileHover={!isAnswerChecked ? { scale: 1.01 } : {}}
                whileTap={!isAnswerChecked ? { scale: 0.99 } : {}}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${btnClass}`}
              >
                <div 
                  className={jenis !== "tebak-surah" ? "font-amiri text-3xl md:text-4xl leading-[2.5] py-1" : "font-semibold text-lg"} 
                  dir={jenis !== "tebak-surah" ? "rtl" : "ltr"}
                >
                  {opt}
                </div>
                {icon && <div>{icon}</div>}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {isAnswerChecked && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-8 flex justify-end"
        >
          <Button size="lg" className="px-8 text-lg" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? "Soal Selanjutnya" : "Selesai"} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
