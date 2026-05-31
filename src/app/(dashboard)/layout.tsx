import ClientLayout from "./ClientLayout";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function DashboardServerLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
