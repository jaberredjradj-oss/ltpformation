import {
  isAnnouncementAnimationType,
  type AnnouncementInput,
  type SiteAnnouncement,
} from "@/lib/announcements/types";

export interface SiteAnnouncementRow {
  id: string;
  enabled: boolean;
  title: string | null;
  description: string | null;
  cta_text: string | null;
  cta_url: string | null;
  animation_type: string | null;
  display_delay: number | null;
  display_duration: number | null;
  updated_at: string | null;
}

function clampNumber(value: number | null, fallback: number): number {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.round(value));
}

export function mapRowToAnnouncement(row: SiteAnnouncementRow): SiteAnnouncement {
  return {
    id: row.id,
    enabled: Boolean(row.enabled),
    title: row.title ?? "",
    description: row.description ?? "",
    ctaText: row.cta_text ?? "",
    ctaUrl: row.cta_url ?? "",
    animationType: isAnnouncementAnimationType(row.animation_type)
      ? row.animation_type
      : "glow-sweep",
    displayDelay: clampNumber(row.display_delay, 4000),
    displayDuration: clampNumber(row.display_duration, 0),
    updatedAt: row.updated_at ?? new Date(0).toISOString(),
  };
}

export function mapInputToRow(input: AnnouncementInput) {
  return {
    enabled: input.enabled,
    title: input.title,
    description: input.description,
    cta_text: input.ctaText,
    cta_url: input.ctaUrl,
    animation_type: input.animationType,
    display_delay: clampNumber(input.displayDelay, 4000),
    display_duration: clampNumber(input.displayDuration, 0),
    updated_at: new Date().toISOString(),
  };
}
