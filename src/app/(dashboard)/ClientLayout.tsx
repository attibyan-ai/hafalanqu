"use client";

import { ReactNode } from "react";
import { AppSidebar, MobileNavbar } from "@/components/shared";
import { useSidebarStore } from "@/stores/sidebar-store";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main id="main-content" className={`transition-all duration-300 ${isCollapsed ? "md:ml-[5rem]" : "md:ml-[18rem]"}`}>
        <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
}
