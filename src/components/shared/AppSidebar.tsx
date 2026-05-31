"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { navigationItems } from "@/constants/navigation";
import { cn, getInitials } from "@/lib/utils";
import { useEffect } from "react";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./ThemeToggle";

export function AppSidebar() {
  const pathname = usePathname();
  const isTablet = useIsTablet();
  const { isCollapsed, toggle, collapse, expand } = useSidebarStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (isTablet) {
      collapse();
    } else {
      expand();
    }
  }, [isTablet, collapse, expand]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "5rem" : "18rem" }}
      className="hidden md:flex flex-col h-screen fixed top-0 left-0 bg-dark text-white shadow-xl z-40 transition-all duration-300"
    >
      <div className="flex items-center justify-between p-6">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="bg-primary/20 p-2 rounded-xl text-primary-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl whitespace-nowrap tracking-tight">HafalanQu</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="w-full flex justify-center mb-4">
            <div className="bg-primary/20 p-2 rounded-xl text-primary-100">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        )}

        <button
          onClick={toggle}
          className={cn(
            "p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white",
            isCollapsed ? "absolute right-0 top-6 translate-x-1/2 bg-dark border border-white/10" : ""
          )}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hidden">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-white font-medium shadow-glow-primary"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {(item as any).badge && !isCollapsed && (
                <span className="absolute right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {(item as any).badge}
                </span>
              )}
            </Link>
          );

          if (!isCollapsed) {
            return <div key={item.href}>{linkContent}</div>;
          }

          return (
            <Tooltip key={item.href} delayDuration={150}>
              <TooltipTrigger asChild>
                {linkContent}
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-dark border-white/10 text-white ml-2">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="p-4 mt-auto space-y-4">
        <div className={cn("flex", isCollapsed ? "justify-center" : "justify-between items-center px-2")}>
          <ThemeToggle />
        </div>
        <Separator className="bg-white/10" />
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
          <Avatar className="h-10 w-10 border-2 border-white/10">
            <AvatarImage src={""} />
            <AvatarFallback className="bg-primary/20 text-primary-100">{getInitials(session?.user?.name || "U")}</AvatarFallback>
          </Avatar>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-sm font-semibold text-white truncate">{session?.user?.name || "Loading..."}</p>
                <p className="text-xs text-gray-400 capitalize">{session?.user?.role || "user"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
