"use client";

import { createContext, useContext, ReactNode } from "react";

interface Setting {
  zonaWaktu: string;
  bahasa: string;
  namaLembaga: string;
  tahunAjaran: string;
  notifWa: boolean;
}

const SettingsContext = createContext<Setting | null>(null);

export function SettingsProvider({ children, setting }: { children: ReactNode, setting: Setting }) {
  return (
    <SettingsContext.Provider value={setting}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
