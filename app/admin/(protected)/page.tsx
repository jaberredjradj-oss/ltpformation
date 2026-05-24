import { AdminDashboardView } from "@/components/admin/dashboard/AdminDashboardView";
import {
  getAdminDashboardStats,
  getRecentAdminActivity,
} from "@/lib/admin/dashboard/get-dashboard-stats";
import { getDashboardKpiTrends } from "@/lib/admin/dashboard/kpi-trends";

export default async function AdminDashboardPage() {
  const [stats, activity, trends] = await Promise.all([
    getAdminDashboardStats(),
    getRecentAdminActivity(),
    getDashboardKpiTrends(),
  ]);

  return <AdminDashboardView stats={stats} activity={activity} trends={trends} />;
}
