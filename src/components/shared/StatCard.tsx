"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number | string;
  icon: LucideIcon;
  color?: "primary" | "info" | "warning" | "success" | "danger";
  delay?: number;
}

export function StatCard({ title, value, trend, icon: Icon, color = "primary", delay = 0 }: StatCardProps) {
  const colorStyles = {
    primary: "bg-primary-50 text-primary",
    info: "bg-info-light text-info",
    warning: "bg-warning-light text-warning",
    success: "bg-success-light text-success",
    danger: "bg-red-50 text-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-6 flex items-start justify-between"
    >
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold mt-2 text-dark">{value}</h3>
        {trend !== undefined && (
          <p className={cn("text-sm mt-2 font-medium", Number(trend) >= 0 ? "text-success" : "text-destructive")}>
            {Number(trend) > 0 ? "+" : ""}{trend}% <span className="text-muted-foreground font-normal">dari bulan lalu</span>
          </p>
        )}
      </div>
      <div className={cn("p-3 rounded-2xl", colorStyles[color])}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
}
