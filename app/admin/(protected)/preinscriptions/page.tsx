import { PreinscriptionsTable } from "@/components/admin/preinscriptions/PreinscriptionsTable";
import { getSubmissionsRepository } from "@/lib/repositories";

export default async function AdminPreinscriptionsPage() {
  const items = await getSubmissionsRepository().then((repo) => repo.listPreinscriptions());

  return <PreinscriptionsTable items={items} />;
}
