"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

import { PageHeader, FormField, SubmitButton } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createHafalan } from "@/actions/hafalan";
import { surahList } from "@/constants/surah";

const STEPS = [
  { id: 1, title: "Data Santri" },
  { id: 2, title: "Detail Hafalan" },
  { id: 3, title: "Penilaian" },
];

const formSchema = z.object({
  santriId: z.string().min(1, "Santri wajib dipilih"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jenis: z.string().min(1, "Jenis hafalan wajib dipilih"),
  surah: z.string().min(1, "Surah wajib dipilih"),
  ayatMulai: z.string().min(1, "Ayat mulai wajib diisi"),
  ayatAkhir: z.string().min(1, "Ayat akhir wajib diisi"),
  kualitas: z.string().min(1, "Kualitas wajib dipilih"),
  catatan: z.string().optional(),
}).refine((data) => parseInt(data.ayatAkhir) >= parseInt(data.ayatMulai), {
  message: "Ayat akhir harus lebih besar atau sama dengan ayat mulai",
  path: ["ayatAkhir"],
});

export default function InputHafalanClient({ initialSantris }: { initialSantris: any[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal: new Date().toISOString().split("T")[0],
    }
  });

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ["santriId", "tanggal"];
    if (currentStep === 2) fieldsToValidate = ["jenis", "surah", "ayatMulai", "ayatAkhir"];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createHafalan({
        santriId: data.santriId,
        surah: data.surah,
        ayatMulai: parseInt(data.ayatMulai),
        ayatAkhir: parseInt(data.ayatAkhir),
        jenis: data.jenis,
        kualitas: data.kualitas,
        catatan: data.catatan,
        tanggal: new Date(data.tanggal),
      });
      toast.success("Setoran hafalan berhasil disimpan!");
      
      setValue("surah", "");
      setValue("ayatMulai", "");
      setValue("ayatAkhir", "");
      setValue("kualitas", "");
      setValue("catatan", "");
      
      setCurrentStep(1);
    } catch (error) {
      toast.error("Gagal menyimpan hafalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Input Setoran Hafalan" 
        subtitle="Catat setoran hafalan santri dengan detail dan mudah"
      />

      <div className="card p-6 md:p-10">
        {/* Stepper */}
        <div className="relative flex justify-between items-center mb-12">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
          
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${isActive ? 'bg-primary text-white shadow-glow-primary scale-110' : 
                    isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className={`text-xs md:text-sm font-medium absolute -bottom-8 whitespace-nowrap
                  ${isActive ? 'text-primary' : isCompleted ? 'text-dark' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4">
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <FormField label="Santri" required error={errors.santriId?.message}>
                  <Select value={watch("santriId")} onValueChange={(v) => setValue("santriId", v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih santri..." />
                    </SelectTrigger>
                    <SelectContent>
                      {initialSantris.filter(s => s.status === "active").map((santri) => (
                        <SelectItem key={santri.id} value={santri.id}>{santri.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Tanggal Setoran" required error={errors.tanggal?.message}>
                  <Input type="date" {...register("tanggal")} />
                </FormField>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Jenis Hafalan" required error={errors.jenis?.message}>
                    <Select value={watch("jenis")} onValueChange={(v) => setValue("jenis", v, { shouldValidate: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ziyadah">Ziyadah (Hafalan Baru)</SelectItem>
                        <SelectItem value="Muraja'ah">Muraja'ah (Pengulangan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Surah" required error={errors.surah?.message}>
                    <Select value={watch("surah")} onValueChange={(v) => setValue("surah", v, { shouldValidate: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih surah..." />
                      </SelectTrigger>
                      <SelectContent>
                        {surahList.map((surah) => (
                          <SelectItem key={surah} value={surah}>{surah}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField label="Dari Ayat" required error={errors.ayatMulai?.message}>
                    <Input type="number" min="1" {...register("ayatMulai")} />
                  </FormField>

                  <FormField label="Sampai Ayat" required error={errors.ayatAkhir?.message}>
                    <Input type="number" min="1" {...register("ayatAkhir")} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <FormField label="Kualitas Hafalan" required error={errors.kualitas?.message}>
                  <Select value={watch("kualitas")} onValueChange={(v) => setValue("kualitas", v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kualitas..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mumtaz">Mumtaz (Sangat Baik)</SelectItem>
                      <SelectItem value="Jayyid Jiddan">Jayyid Jiddan (Baik Sekali)</SelectItem>
                      <SelectItem value="Jayyid">Jayyid (Baik)</SelectItem>
                      <SelectItem value="Maqbul">Maqbul (Cukup)</SelectItem>
                      <SelectItem value="Ghair Maqbul">Ghair Maqbul (Kurang)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Catatan Tambahan (Opsional)" error={errors.catatan?.message}>
                  <Textarea 
                    placeholder="Contoh: Perlu perbaikan makharijul huruf pada ayat 5..."
                    className="min-h-[120px]"
                    {...register("catatan")} 
                  />
                </FormField>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Sebelumnya
            </Button>

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <SubmitButton type="submit" isLoading={isSubmitting}>
                <Check className="w-4 h-4 mr-2" />
                Simpan Hafalan
              </SubmitButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
