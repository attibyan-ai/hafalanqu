"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, BarChart3, Shield, Star, Users, Menu, X,
  CalendarCheck, GraduationCap, Smartphone, Clock, TrendingUp, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-50">HafalanQu</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#keunggulan" className="hover:text-primary transition-colors">Keunggulan</a>
            <a href="#kontak" className="hover:text-primary transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:inline-flex">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/login" className="hidden md:inline-flex">
              <Button>Mulai Gratis</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white dark:bg-dark md:hidden flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-xl text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-gray-50">HafalanQu</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex flex-col gap-6 text-lg font-medium">
              <a href="#fitur" onClick={() => setIsMenuOpen(false)} className="hover:text-primary border-b border-gray-100 dark:border-white/10 pb-4">Fitur</a>
              <a href="#keunggulan" onClick={() => setIsMenuOpen(false)} className="hover:text-primary border-b border-gray-100 dark:border-white/10 pb-4">Keunggulan</a>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="hover:text-primary border-b border-gray-100 dark:border-white/10 pb-4">Kontak</a>
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full">Masuk</Button>
              </Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button size="lg" className="w-full">Mulai Gratis</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden gradient-hero dark:bg-gradient-to-br dark:from-dark dark:via-dark-400 dark:to-dark">
        <div className="absolute inset-0 islamic-pattern opacity-30 dark:opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-6">
              <Badge variant="success" className="px-4 py-1.5 text-sm font-medium rounded-full">
                Platform Tahfidz #1 di Indonesia
              </Badge>
            </motion.div>

            <motion.h1 variants={item} className="text-display-sm md:text-display-lg font-bold leading-tight text-gray-900 dark:text-gray-50 mb-6 text-balance">
              Kelola Setoran Hafalan Qur&apos;an dengan{" "}
              <span className="text-primary">Mudah & Modern</span>
            </motion.h1>
            
            <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
              Monitoring hafalan, absensi otomatis, tes interaktif, dan statistik perkembangan santri dalam satu platform digital yang elegan untuk pesantren dan lembaga tahfidz.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-wrap gap-4 justify-center">
              <Link href="/login">
                <Button size="xl" className="rounded-2xl text-base w-full sm:w-auto shadow-lg shadow-primary/20">
                  Mulai Sekarang — Gratis
                </Button>
              </Link>
              <Link href="#fitur">
                <Button variant="outline" size="xl" className="rounded-2xl text-base w-full sm:w-auto bg-white/50 dark:bg-white/[0.04] backdrop-blur-sm">
                  Lihat Fitur
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>1,200+ Santri Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>50+ Pesantren</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Rating 4.9/5</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-white dark:bg-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Fitur</Badge>
            <h2 className="text-heading-lg md:text-display-sm font-bold text-gray-900 dark:text-gray-50 mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Sistem yang dirancang khusus untuk memenuhi kebutuhan pesantren dan lembaga tahfidz modern.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Manajemen Setoran", desc: "Catat dan pantau riwayat setoran hafalan santri dengan detail surah, ayat, dan kualitas bacaan.", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
              { icon: BarChart3, title: "Statistik Progresif", desc: "Visualisasi data perkembangan santri melalui grafik interaktif yang mudah dipahami.", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
              { icon: CalendarCheck, title: "Absensi Digital", desc: "Catat kehadiran santri secara otomatis dengan satu klik. Data tersimpan real-time.", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
              { icon: GraduationCap, title: "Tes Interaktif", desc: "Uji hafalan santri dengan quiz interaktif pilihan ganda. Nilai terhitung otomatis.", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
              { icon: Shield, title: "Aman & Terpercaya", desc: "Data tersimpan aman di cloud dengan sistem backup otomatis dan kontrol akses berbasis role.", color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" },
              { icon: Smartphone, title: "Responsif Mobile", desc: "Akses dari perangkat apapun — smartphone, tablet, atau desktop. Tampilan adaptif sempurna.", color: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-hover p-7 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color} transition-transform group-hover:scale-110`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-50">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="keunggulan" className="py-24 bg-gray-50 dark:bg-dark-400 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Kenapa HafalanQu?</Badge>
              <h2 className="text-heading-lg md:text-display-sm font-bold text-gray-900 dark:text-gray-50 mb-6">
                Dirancang untuk Ustadz & Lembaga Tahfidz
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Kami memahami tantangan mengelola ratusan santri. HafalanQu hadir sebagai solusi digital yang memudahkan pencatatan, monitoring, dan evaluasi hafalan.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Clock, title: "Hemat Waktu 70%", desc: "Tidak perlu catat manual di buku. Semua data terdigitalisasi." },
                  { icon: TrendingUp, title: "Tracking Akurat", desc: "Pantau progress setiap santri hingga level ayat per ayat." },
                  { icon: MessageSquare, title: "Laporan Otomatis", desc: "Generate laporan perkembangan untuk wali santri dalam sekali klik." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="relative card p-8 glass shadow-soft-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="ml-2 text-xs text-muted-foreground font-mono">dashboard.preview</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Santri Aktif</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">1,248</p>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  {["Ahmad Fauzi — Juz 28", "Siti Nurhaliza — Juz 29", "Muhammad Rizki — Juz 30"].map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {name.split(" ")[0][0]}{name.split(" ")[1][0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</span>
                      </div>
                      <Badge variant="success" className="text-xs">Mumtaz</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-primary-700 p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-display-sm md:text-display font-bold text-white mb-4 text-balance">
                Siap Modernisasi Pesantren Anda?
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto text-lg">
                Bergabung dengan 50+ pesantren yang sudah menggunakan HafalanQu. Setup dalam 5 menit, tanpa biaya.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/login">
                  <Button size="xl" className="rounded-2xl text-base bg-white text-primary hover:bg-gray-50 shadow-xl">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-dark pt-20 pb-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-2 rounded-xl text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-2xl text-white">HafalanQu</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                Platform SaaS terkemuka untuk manajemen tahfidz Al-Qur&apos;an. Membantu ustadz dan lembaga mencetak generasi Qur&apos;ani.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Produk</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#fitur" className="hover:text-primary-100 transition">Fitur</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Panduan</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Perusahaan</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary-100 transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Kontak</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p>&copy; 2026 HafalanQu. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-1">
              <span>Dibuat dengan</span>
              <span className="text-red-400">♥</span>
              <span>untuk umat</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
