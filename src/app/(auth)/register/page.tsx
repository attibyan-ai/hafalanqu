"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/shared/FormField";
import { registerUser } from "@/actions/auth";
import Link from "next/link";

const registerSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      if (res.error) {
        toast.error("Pendaftaran Gagal", { description: res.error });
      } else {
        toast.success("Pendaftaran Berhasil!", { description: "Silakan masuk dengan akun baru Anda." });
        router.push("/login");
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
    <div className="card p-8 shadow-xl border-white/50 bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Buat Akun HafalanQu</h1>
        <p className="text-muted-foreground text-sm">
          Daftar sebagai Pengelola / Ustadz
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField label="Nama Lengkap" error={errors.nama?.message}>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("nama")}
                placeholder="Ustadz Ahmad"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("email")}
                type="email"
                placeholder="ustadz@hafalanqu.com"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </FormField>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <UserPlus className="w-5 h-5 mr-2" />
          )}
          Daftar Akun
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
