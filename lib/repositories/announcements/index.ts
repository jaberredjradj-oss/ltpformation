import { isRealDataEnabled } from "@/lib/db/env";
import type {
  AnnouncementsRepository,
  SiteAnnouncement,
} from "@/lib/announcements/types";
import { staticAnnouncementsRepository } from "@/lib/repositories/announcements/static-announcements";
import { supabaseAnnouncementsRepository } from "@/lib/repositories/announcements/supabase-announcements";

export async function getAnnouncementsRepository(): Promise<AnnouncementsRepository> {
  if (isRealDataEnabled()) {
    return supabaseAnnouncementsRepository;
  }
  return staticAnnouncementsRepository;
}

/**
 * Safe public read. Never throws — any failure (missing table, Supabase
 * outage, demo mode) resolves to null so the public site keeps rendering.
 */
export async function loadActiveAnnouncement(): Promise<SiteAnnouncement | null> {
  try {
    const repository = await getAnnouncementsRepository();
    const current = await repository.getCurrent();

    if (!current || !current.enabled) return null;
    if (!current.title.trim()) return null;

    return current;
  } catch (error) {
    console.error(
      "[announcement] Failed to load active announcement:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
