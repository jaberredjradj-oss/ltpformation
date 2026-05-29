export const ANNOUNCEMENT_ANIMATION_TYPES = [
  "shooting-star",
  "glow-sweep",
  "particles",
  "rocket",
  "none",
] as const;

export type AnnouncementAnimationType =
  (typeof ANNOUNCEMENT_ANIMATION_TYPES)[number];

export const ANNOUNCEMENT_ANIMATION_LABELS: Record<
  AnnouncementAnimationType,
  string
> = {
  "shooting-star": "Étoile filante premium",
  "glow-sweep": "Reflet lumineux (glow)",
  particles: "Particules élégantes",
  rocket: "Fusée discrète",
  none: "Aucune animation",
};

export interface SiteAnnouncement {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  animationType: AnnouncementAnimationType;
  /** Delay in milliseconds before the banner appears. */
  displayDelay: number;
  /** Auto-dismiss delay in milliseconds. 0 = stays until closed. */
  displayDuration: number;
  updatedAt: string;
}

export interface AnnouncementInput {
  enabled: boolean;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  animationType: AnnouncementAnimationType;
  displayDelay: number;
  displayDuration: number;
}

export const ANNOUNCEMENT_DEFAULTS: AnnouncementInput = {
  enabled: false,
  title: "Nouvelle formation disponible",
  description:
    "Découvrez notre dernière formation certifiante et réservez votre place dès maintenant.",
  ctaText: "Découvrir la formation",
  ctaUrl: "/formations",
  animationType: "glow-sweep",
  displayDelay: 4000,
  displayDuration: 0,
};

export function isAnnouncementAnimationType(
  value: unknown,
): value is AnnouncementAnimationType {
  return (
    typeof value === "string" &&
    (ANNOUNCEMENT_ANIMATION_TYPES as readonly string[]).includes(value)
  );
}

export interface AnnouncementsRepository {
  getCurrent(): Promise<SiteAnnouncement | null>;
  save(input: AnnouncementInput): Promise<SiteAnnouncement>;
}
