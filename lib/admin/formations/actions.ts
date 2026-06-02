"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import { FORMATIONS_BY_SLUG } from "@/lib/formations/catalog";
import type { Formation } from "@/lib/formations/types";
import { getFormationsRepository } from "@/lib/repositories/formations";
import {
  MAX_SLUG_LENGTH,
  SLUG_PATTERN,
  normalizeFormationDraft,
} from "@/lib/admin/formations/validation";

export interface FormationActionResult {
  ok: boolean;
  error?: string;
  slug?: string;
}

export interface SaveFormationInput {
  formation: Formation;
  active: boolean;
  sortOrder: number;
}

const TABLE_MISSING_ERROR =
  "Enregistrement impossible. Vérifiez que la table formations existe (migration 006) et que Supabase est configuré.";

function revalidateFormation(slug: string): void {
  revalidatePath("/formations");
  revalidatePath(`/formations/${slug}`);
  revalidatePath("/admin/formations");
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export async function createFormation(
  input: SaveFormationInput,
): Promise<FormationActionResult> {
  await assertAdminAccess();

  const slug = normalizeSlug(input.formation.slug ?? "");
  if (!SLUG_PATTERN.test(slug) || slug.length > MAX_SLUG_LENGTH) {
    return {
      ok: false,
      error: "Le slug doit être en minuscules, format kebab-case (ex. ssiap-1-initial).",
    };
  }
  if (FORMATIONS_BY_SLUG.has(slug)) {
    return { ok: false, error: "Ce slug est déjà utilisé par une formation du catalogue." };
  }

  const normalized = normalizeFormationDraft({ ...input.formation, slug });
  if (!normalized.ok) {
    return { ok: false, error: normalized.error };
  }

  try {
    const repository = getFormationsRepository();
    const existing = await repository.getBySlug(slug);
    if (existing) {
      return { ok: false, error: "Une formation avec ce slug existe déjà." };
    }
    await repository.create({
      formation: normalized.formation,
      active: input.active,
      sortOrder: input.sortOrder,
      coverImageUrl: null,
      source: "admin",
    });
  } catch (error) {
    console.error(
      "[formations] create failed:",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, error: TABLE_MISSING_ERROR };
  }

  revalidateFormation(slug);
  return { ok: true, slug };
}

export async function updateFormation(
  rawSlug: string,
  input: SaveFormationInput,
): Promise<FormationActionResult> {
  await assertAdminAccess();

  const slug = normalizeSlug(rawSlug);
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "Slug invalide." };
  }

  const isStaticSlug = FORMATIONS_BY_SLUG.has(slug);
  const normalized = normalizeFormationDraft({ ...input.formation, slug });
  if (!normalized.ok) {
    return { ok: false, error: normalized.error };
  }

  try {
    const repository = getFormationsRepository();
    const existing = await repository.getBySlug(slug);

    if (!existing && !isStaticSlug) {
      return { ok: false, error: "Formation introuvable." };
    }

    // Preserve an existing cover image (managed in Phase 3b) and source.
    const source: "admin" | "static-override" =
      existing && existing.source === "admin" ? "admin" : "static-override";
    const coverImageUrl = existing?.coverImageUrl ?? null;

    const payload = {
      formation: normalized.formation,
      active: input.active,
      sortOrder: input.sortOrder,
      coverImageUrl,
      source,
    };

    if (existing) {
      await repository.update(slug, payload);
    } else {
      // First edit of a static formation creates its override row.
      await repository.create(payload);
    }
  } catch (error) {
    console.error(
      "[formations] update failed:",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, error: TABLE_MISSING_ERROR };
  }

  revalidateFormation(slug);
  return { ok: true, slug };
}
