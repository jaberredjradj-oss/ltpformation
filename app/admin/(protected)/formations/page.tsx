import { AdminFormationsTable } from "@/components/admin/formations/AdminFormationsTable";
import { getAdminFormationRows } from "@/lib/admin/formations/get-admin-formations";

export default async function AdminFormationsPage() {
  const rows = await getAdminFormationRows();

  return <AdminFormationsTable rows={rows} />;
}
