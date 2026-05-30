"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Camera, Save, Lock } from "lucide-react";

import { PageHeader, FormField, SubmitButton } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/constants/mock-data";
import { getInitials, getRoleBadgeColor, getRoleLabel, formatDate } from "@/lib/utils";

const profileSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  noHp: z.string().min(10, "Nomor HP tidak valid"),
  alamat: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama wajib diisi"),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

export default function ProfilPage() {
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const formProfile = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: currentUser.nama,
      email: currentUser.email,
      noHp: currentUser.noHp,
      alamat: currentUser.alamat,
    }
  });

  const formPassword = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (data: any) => {
    setIsSubmittingProfile(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Profil berhasil diperbarui");
    setIsSubmittingProfile(false);
  };

  const onSubmitPassword = async (data: any) => {
    setIsSubmittingPassword(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Password berhasil diubah");
    formPassword.reset();
    setIsSubmittingPassword(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader 
        title="Profil Saya" 
        subtitle="Kelola informasi akun dan pengaturan keamanan Anda"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column - Profile Card & Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="relative group cursor-pointer">
                <Avatar className="h-28 w-28 border-4 border-white shadow-soft">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-primary-50 text-primary text-2xl">
                    {getInitials(currentUser.nama)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-dark">{currentUser.nama}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 mb-3">
                  <Badge className={getRoleBadgeColor(currentUser.role)} variant="outline">
                    {getRoleLabel(currentUser.role)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Bergabung sejak {formatDate(currentUser.joinedAt)}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-md">{currentUser.email}</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-8"></div>

            <form onSubmit={formProfile.handleSubmit(onSubmitProfile)} className="space-y-6">
              <h3 className="font-semibold text-lg">Informasi Dasar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nama Lengkap" required error={formProfile.formState.errors.nama?.message}>
                  <Input {...formProfile.register("nama")} />
                </FormField>
                
                <FormField label="Email" required error={formProfile.formState.errors.email?.message}>
                  <Input type="email" {...formProfile.register("email")} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nomor Handphone" required error={formProfile.formState.errors.noHp?.message}>
                  <Input {...formProfile.register("noHp")} />
                </FormField>
              </div>

              <FormField label="Alamat Lengkap" error={formProfile.formState.errors.alamat?.message}>
                <Textarea {...formProfile.register("alamat")} className="min-h-[100px]" />
              </FormField>

              <div className="flex justify-end pt-4">
                <SubmitButton isLoading={isSubmittingProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Password */}
        <div className="xl:col-span-1">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg">Ubah Password</h3>
            </div>
            
            <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-5">
              <FormField label="Password Lama" required error={formPassword.formState.errors.oldPassword?.message}>
                <Input type="password" {...formPassword.register("oldPassword")} />
              </FormField>
              
              <FormField label="Password Baru" required error={formPassword.formState.errors.newPassword?.message}>
                <Input type="password" {...formPassword.register("newPassword")} />
              </FormField>
              
              <FormField label="Konfirmasi Password Baru" required error={formPassword.formState.errors.confirmPassword?.message}>
                <Input type="password" {...formPassword.register("confirmPassword")} />
              </FormField>

              <SubmitButton isLoading={isSubmittingPassword} className="w-full" variant="secondary">
                Ubah Password
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
