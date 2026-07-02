import { TrashTable } from "@/components/admin/corbeille/TrashTable";
import { getTrashRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminCorbeillePage() {
  const items = await getTrashRepository().then((repo) => repo.listTrashedItems());

  return <TrashTable items={items} />;
}
