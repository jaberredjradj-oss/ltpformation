import { AdminPlanningTable } from "@/components/admin/planning/AdminPlanningTable";
import { getAdminPlanningRows } from "@/lib/admin/planning/get-admin-sessions";

export default async function AdminPlanningPage() {
  const rows = await getAdminPlanningRows();

  return <AdminPlanningTable rows={rows} />;
}
