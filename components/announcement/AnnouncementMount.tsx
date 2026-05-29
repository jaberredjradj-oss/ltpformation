import { loadActiveAnnouncement } from "@/lib/repositories/announcements";
import { AnnouncementBanner } from "@/components/announcement/AnnouncementBanner";

/**
 * Server component. Fetches the active announcement safely.
 * Renders nothing when disabled, absent, or on any failure, so the
 * public site is unchanged when the module is not in use.
 */
export async function AnnouncementMount() {
  const announcement = await loadActiveAnnouncement();

  if (!announcement) return null;

  return <AnnouncementBanner announcement={announcement} />;
}
