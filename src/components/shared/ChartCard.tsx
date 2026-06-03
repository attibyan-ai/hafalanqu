"use client";

import { ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  showPeriodSelector?: boolean;
}

export function ChartCard({ title, children, className, headerAction, showPeriodSelector = false }: ChartCardProps) {
  return (
    <div className={`card p-6 ${className || ""}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">{title}</h3>
        {headerAction || (showPeriodSelector && (
          <Select defaultValue="7d">
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">3 Bulan</SelectItem>
            </SelectContent>
          </Select>
        ))}
      </div>
      <div className="h-[300px] w-full">
        {children}
      </div>
    </div>
  );
}
