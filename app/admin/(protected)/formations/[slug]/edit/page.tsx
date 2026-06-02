import { notFound } from "next/navigation";
import { FormationEditor } from "@/components/admin/formations/FormationEditor";
import { loadManagedFormationBySlug } from "@/lib/repositories/formations";

interface EditFormationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditFormationPage({ params }: EditFormationPageProps) {
  const { slug } = await params;
  const managed = await loadManagedFormationBySlug(slug);

  if (!managed) {
    notFound();
  }

  return (
    <FormationEditor
      mode="edit"
      initialFormation={managed.formation}
      initialActive={managed.active}
      initialSortOrder={managed.sortOrder}
    />
  );
}
