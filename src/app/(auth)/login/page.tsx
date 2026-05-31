"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn, Mail, Lock, Loader2, ArrowLeft, Shield, Clock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/shared/FormField";
import Link from "next/link";
import { motion } from "framer-motion";


const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Gagal masuk", {
          description: "Email atau password yang Anda masukkan salah.",
        });
      } else {
        toast.success("Berhasil masuk", {
          description: "Selamat datang kembali di HafalanQu!",
        });
        
        // Ambil sesi secara dinamis untuk menentukan role pengalihan
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        // Logika pengalihan rute berbasis peran (RBAC)
        if (role === "admin" || role === "ustadz" || role === "santri" || role === "wali") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
        
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Tidak dapat terhubung ke server. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-0">
      {/* Left side — branding (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-primary via-primary-600 to-primary-700 rounded-l-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-xl text-white">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="font-bold text-3xl text-white">HafalanQu</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 leading-snug">
            Sistem Digital Hafalan Qur'an untuk Pesantren Modern
          </h2>
          <p className="text-primary-100 mb-10 leading-relaxed">
            Pantau setoran, kelola absensi, dan evaluasi hafalan santri dalam satu platform.
          </p>

          <div className="space-y-5">
            {[
              { icon: Shield, text: "Data terenkripsi & aman" },
              { icon: Clock, text: "Setup kurang dari 5 menit" },
              { icon: Smartphone, text: "Akses dari perangkat apapun" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <item.icon className="w-5 h-5 text-primary-200" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right side — form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="card p-8 md:p-10 lg:rounded-l-none lg:rounded-r-3xl shadow-xl bg-white/90 dark:bg-dark/90 backdrop-blur-md"
      >
        {/* Back link (mobile only) */}
        <Link href="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Masuk ke HafalanQu</h1>
          <p className="text-muted-foreground text-sm">
            Masukkan kredensial Anda untuk mengakses dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField label="Email" error={errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="admin@hafalanqu.com"
                  className="pl-10 h-11"
                  disabled={isLoading}
                />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  disabled={isLoading}
                />
              </div>
            </FormField>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            Masuk
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-dark px-2 text-muted-foreground">Atau</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Hubungi administrator untuk membuat akun baru atau{" "}
            <Link href="/" className="text-primary hover:underline font-medium">kembali ke beranda</Link>.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
