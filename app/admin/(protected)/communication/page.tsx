import { AnnouncementEditor } from "@/components/admin/announcement/AnnouncementEditor";
import {
  ANNOUNCEMENT_DEFAULTS,
  type SiteAnnouncement,
} from "@/lib/announcements/types";
import { getAnnouncementsRepository } from "@/lib/repositories/announcements";
import { FORMATIONS } from "@/lib/formations/catalog";

export default async function AdminCommunicationPage() {
  let current: SiteAnnouncement | null = null;
  let loadError: string | null = null;

  try {
    const repository = await getAnnouncementsRepository();
    current = await repository.getCurrent();
  } catch {
    loadError =
      "La table site_announcements est introuvable. Exécutez la migration 004 dans Supabase pour activer la persistance.";
  }

  const formations = FORMATIONS.map((formation) => ({
    slug: formation.slug,
    title: formation.title,
  }));

  return (
    <AnnouncementEditor
      initial={current}
      defaults={ANNOUNCEMENT_DEFAULTS}
      formations={formations}
      loadError={loadError}
    />
  );
}
