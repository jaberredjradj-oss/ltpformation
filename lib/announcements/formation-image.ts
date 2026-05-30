import { getFormation } from "@/lib/formations/catalog";
import { THEME_IMAGES } from "@/lib/training-images";

export interface AnnouncementImage {
  src: string;
  alt: string;
}

/** Extracts a formation slug from a `/formations/{slug}` CTA link. */
export function extractFormationSlug(ctaUrl: string): string | null {
  const match = /^\/formations\/([a-z0-9-]+)\/?$/i.exec(ctaUrl.trim());
  return match ? match[1] : null;
}

/**
 * Resolves the formation image associated with an announcement CTA link.
 * Returns null for custom URLs, unknown slugs, or missing visuals (no error).
 */
export function resolveAnnouncementImage(
  ctaUrl: string,
): AnnouncementImage | null {
  const slug = extractFormationSlug(ctaUrl);
  if (!slug) return null;

  const formation = getFormation(slug);
  if (!formation) return null;

  const src = THEME_IMAGES[formation.imageKey];
  if (!src) return null;

  return { src, alt: formation.title };
}
