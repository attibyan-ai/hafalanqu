import { Suspense } from "react";
import { getDashboardStats } from "@/actions/dashboard";
import DashboardClient from "./DashboardClient";
import DashboardSkeleton from "./DashboardSkeleton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();
  return <DashboardClient stats={stats} />;
}
