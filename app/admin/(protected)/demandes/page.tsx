import { DevisRequestsTable } from "@/components/admin/demandes/DevisRequestsTable";
import { getSubmissionsRepository } from "@/lib/repositories";

export default async function AdminDemandesPage() {
  const requests = await getSubmissionsRepository().then((repo) => repo.listDevisRequests());

  return <DevisRequestsTable requests={requests} />;
}
