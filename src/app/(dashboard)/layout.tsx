import ClientLayout from "./ClientLayout";
import { ReactNode } from "react";
import { getSetting } from "@/actions/pengaturan";
import { SettingsProvider } from "@/contexts/SettingsContext";

export default async function DashboardServerLayout({ children }: { children: ReactNode }) {
  const setting = await getSetting();
  
  return (
    <SettingsProvider setting={setting}>
      <ClientLayout>{children}</ClientLayout>
    </SettingsProvider>
  );
}
