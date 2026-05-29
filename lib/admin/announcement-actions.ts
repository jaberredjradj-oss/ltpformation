"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import {
  isAnnouncementAnimationType,
  type AnnouncementInput,
} from "@/lib/announcements/types";
import { getAnnouncementsRepository } from "@/lib/repositories/announcements";

const MAX_TITLE = 120;
const MAX_DESCRIPTION = 320;
const MAX_CTA_TEXT = 60;
const MAX_CTA_URL = 500;
const MAX_DELAY_MS = 60_000;
const MAX_DURATION_MS = 120_000;

export interface SaveAnnouncementResult {
  ok: boolean;
  error?: string;
}

function sanitizeText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function isSafeCtaUrl(url: string): boolean {
  if (!url) return true;
  if (url.startsWith("/")) return true;
  return /^https?:\/\//i.test(url);
}

export async function saveAnnouncement(
  input: AnnouncementInput,
): Promise<SaveAnnouncementResult> {
  await assertAdminAccess();

  const title = sanitizeText(input.title, MAX_TITLE);
  const ctaUrl = sanitizeText(input.ctaUrl, MAX_CTA_URL);

  if (input.enabled && !title) {
    return { ok: false, error: "Le titre est requis pour activer l'annonce." };
  }

  if (!isSafeCtaUrl(ctaUrl)) {
    return {
      ok: false,
      error: "Le lien doit être interne (/...) ou une URL http(s) valide.",
    };
  }

  const payload: AnnouncementInput = {
    enabled: Boolean(input.enabled),
    title,
    description: sanitizeText(input.description, MAX_DESCRIPTION),
    ctaText: sanitizeText(input.ctaText, MAX_CTA_TEXT),
    ctaUrl,
    animationType: isAnnouncementAnimationType(input.animationType)
      ? input.animationType
      : "glow-sweep",
    displayDelay: clampInt(input.displayDelay, 0, MAX_DELAY_MS, 4000),
    displayDuration: clampInt(input.displayDuration, 0, MAX_DURATION_MS, 0),
  };

  try {
    const repository = await getAnnouncementsRepository();
    await repository.save(payload);
  } catch (error) {
    console.error(
      "[announcement] Save failed:",
      error instanceof Error ? error.message : error,
    );
    return {
      ok: false,
      error:
        "Enregistrement impossible. Vérifiez que la table site_announcements existe (migration 004).",
    };
  }

  // Public site is statically rendered — revalidate so the banner reflects changes.
  revalidatePath("/", "layout");
  revalidatePath("/admin/communication");

  return { ok: true };
}
