import { AdminPlanningTable } from "@/components/admin/planning/AdminPlanningTable";
import {
  getAdminPlanningRows,
  getEditableSessions,
  getFormationOptions,
} from "@/lib/admin/planning/get-admin-sessions";

export default async function AdminPlanningPage() {
  const [rows, editableSessions] = await Promise.all([
    getAdminPlanningRows(),
    getEditableSessions(),
  ]);
  const formations = getFormationOptions();

  return (
    <AdminPlanningTable
      rows={rows}
      editableSessions={editableSessions}
      formations={formations}
    />
  );
}
