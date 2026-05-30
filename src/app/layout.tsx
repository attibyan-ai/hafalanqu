import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HafalanQu - Sistem Digital Hafalan Qur'an",
  description: "Modern UI/UX 2026 untuk sistem setoran hafalan Qur'an. Monitoring hafalan, absensi otomatis, tes interaktif, dan statistik perkembangan santri dalam satu platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <TooltipProvider delayDuration={300}>
            {children}
          </TooltipProvider>
        </NextAuthSessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
