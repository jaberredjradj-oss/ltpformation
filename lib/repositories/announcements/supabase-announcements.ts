import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type {
  AnnouncementInput,
  AnnouncementsRepository,
  SiteAnnouncement,
} from "@/lib/announcements/types";
import {
  mapInputToRow,
  mapRowToAnnouncement,
  type SiteAnnouncementRow,
} from "@/lib/repositories/announcements/mappers";

const TABLE = "site_announcements";

export const supabaseAnnouncementsRepository: AnnouncementsRepository = {
  async getCurrent(): Promise<SiteAnnouncement | null> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapRowToAnnouncement(data as SiteAnnouncementRow);
  },

  async save(input: AnnouncementInput): Promise<SiteAnnouncement> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const existing = await this.getCurrent();
    const row = mapInputToRow(input);

    if (existing) {
      const { data, error } = await client
        .from(TABLE)
        .update(row)
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error) throw error;
      return mapRowToAnnouncement(data as SiteAnnouncementRow);
    }

    const { data, error } = await client
      .from(TABLE)
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToAnnouncement(data as SiteAnnouncementRow);
  },
};
