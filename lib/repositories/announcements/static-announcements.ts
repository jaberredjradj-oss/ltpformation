import {
  ANNOUNCEMENT_DEFAULTS,
  type AnnouncementInput,
  type AnnouncementsRepository,
  type SiteAnnouncement,
} from "@/lib/announcements/types";

/**
 * In-memory fallback used when USE_REAL_DATA is disabled.
 * Disabled by default so the public site stays identical without Supabase.
 * State is non-persistent (resets on server restart) — intended for local dev.
 */
let store: SiteAnnouncement = {
  id: "static-announcement",
  ...ANNOUNCEMENT_DEFAULTS,
  updatedAt: new Date(0).toISOString(),
};

export const staticAnnouncementsRepository: AnnouncementsRepository = {
  async getCurrent() {
    return { ...store };
  },

  async save(input: AnnouncementInput) {
    store = {
      ...store,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return { ...store };
  },
};
