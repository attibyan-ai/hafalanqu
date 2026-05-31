"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua {label}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value !== "all" && value !== "" && (
        <Badge variant="secondary" className="px-3 py-1 cursor-pointer" onClick={() => onChange("all")}>
          {options.find(o => o.value === value)?.label} ×
        </Badge>
      )}
    </div>
  );
}
