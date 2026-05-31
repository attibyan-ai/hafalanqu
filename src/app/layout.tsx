import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({ 
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

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
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} ${amiri.variable}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary focus:font-semibold focus:shadow-md">
          Lanjut ke konten utama
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthSessionProvider>
            <TooltipProvider delayDuration={300}>
              {children}
            </TooltipProvider>
          </NextAuthSessionProvider>
          <Toaster richColors position="top-right" />
          <div aria-live="polite" aria-atomic="true" id="aria-live-region" className="sr-only"></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
