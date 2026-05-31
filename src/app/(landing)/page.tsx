"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Shield, Star, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-dark">HafalanQu</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#tentang" className="hover:text-primary transition-colors">Tentang</a>
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
          <div className="fixed inset-0 z-50 bg-white md:hidden flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-xl text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-dark">HafalanQu</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex flex-col gap-6 text-lg font-medium">
              <a href="#fitur" onClick={() => setIsMenuOpen(false)} className="hover:text-primary border-b pb-4">Fitur</a>
              <a href="#tentang" onClick={() => setIsMenuOpen(false)} className="hover:text-primary border-b pb-4">Tentang</a>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="hover:text-primary border-b pb-4">Kontak</a>
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full">Masuk</Button>
              </Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button size="lg" className="w-full">Mulai Gratis</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden gradient-hero">
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.h1 variants={item} className="text-display-sm md:text-display font-bold leading-tight text-dark mb-6 text-balance">
              Kelola Setoran Hafalan Qur'an
            </motion.h1>
            
            <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
              Monitoring hafalan, absensi otomatis, tes interaktif, dan statistik perkembangan santri dalam satu platform digital yang elegan.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button size="xl" className="rounded-2xl text-base w-full sm:w-auto">Mulai Sekarang</Button>
              </Link>
              <Link href="#fitur">
                <Button variant="outline" size="xl" className="rounded-2xl text-base w-full sm:w-auto bg-white/50 backdrop-blur-sm">Lihat Fitur</Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
          >
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full"></div>
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-lg card p-8 glass shadow-soft-lg border-white/40"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Santri Aktif</p>
                  <p className="text-3xl font-bold text-dark">1,248</p>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block -mt-1">Contoh Mockup</span>
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/60 p-4 rounded-xl flex items-center justify-between border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <Badge variant="success">Mumtaz</Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-heading-lg md:text-display-sm font-bold text-dark mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Sistem yang dirancang khusus untuk memenuhi kebutuhan pesantren dan lembaga tahfidz modern.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Manajemen Setoran", desc: "Catat dan pantau riwayat setoran hafalan santri dengan detail surah, ayat, dan kualitas bacaan." },
              { icon: BarChart3, title: "Statistik Progresif", desc: "Visualisasi data perkembangan santri melalui grafik interaktif yang mudah dipahami." },
              { icon: Shield, title: "Aman & Terpercaya", desc: "Data tersimpan aman di cloud dengan sistem backup otomatis dan kontrol akses berbasis role." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-hover p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-dark pt-20 pb-10 border-t border-white/10">
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
                Platform SaaS terkemuka untuk manajemen tahfidz Al-Qur'an. Membantu ustadz dan lembaga mencetak generasi Qur'ani.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Produk</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary-100 transition">Fitur</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Panduan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Perusahaan</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary-100 transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Kontak</a></li>
                <li><a href="#" className="hover:text-primary-100 transition">Kebijakan Privasi</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; 2026 HafalanQu. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
