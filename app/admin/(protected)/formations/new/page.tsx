import { FormationEditor } from "@/components/admin/formations/FormationEditor";
import { createFormationStub } from "@/lib/formations/create-stub";
import { getAdminFormationRows } from "@/lib/admin/formations/get-admin-formations";

export default async function NewFormationPage() {
  const rows = await getAdminFormationRows();
  const nextSortOrder = rows.length;

  const draft = {
    ...createFormationStub({
      slug: "",
      title: "",
      shortTitle: "",
      category: "securite-incendie",
      type: "initial",
      level: null,
      imageKey: "incendie",
    }),
    summary: "",
  };

  return (
    <FormationEditor
      mode="create"
      initialFormation={draft}
      initialActive
      initialSortOrder={nextSortOrder}
    />
  );
}
