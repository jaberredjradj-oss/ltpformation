"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import { FORMATIONS_BY_SLUG } from "@/lib/formations/catalog";
import type { Formation } from "@/lib/formations/types";
import {
  getFormationsRepository,
  loadManagedFormationBySlug,
} from "@/lib/repositories/formations";
import {
  getFormationReferences,
  type FormationReferences,
} from "@/lib/admin/formations/delete-safety";
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

/**
 * Persist an active/inactive flag for a slug. For a static formation with no
 * DB row yet, this creates its first override row (so it can be hidden).
 */
async function applyActiveState(slug: string, active: boolean): Promise<void> {
  const repository = getFormationsRepository();
  const existing = await repository.getBySlug(slug);

  if (existing) {
    const source: "admin" | "static-override" =
      existing.source === "admin" ? "admin" : "static-override";
    await repository.update(slug, {
      formation: existing.formation,
      active,
      sortOrder: existing.sortOrder,
      coverImageUrl: existing.coverImageUrl,
      source,
    });
    return;
  }

  // No DB row — must be a static formation; create its override row.
  const managed = await loadManagedFormationBySlug(slug);
  if (!managed) {
    throw new Error("Formation introuvable.");
  }
  await repository.create({
    formation: managed.formation,
    active,
    sortOrder: managed.sortOrder,
    coverImageUrl: managed.coverImageUrl,
    source: "static-override",
  });
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

export async function setFormationActive(
  rawSlug: string,
  active: boolean,
): Promise<FormationActionResult> {
  await assertAdminAccess();

  const slug = normalizeSlug(rawSlug);
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "Slug invalide." };
  }

  try {
    await applyActiveState(slug, active);
  } catch (error) {
    console.error(
      "[formations] setActive failed:",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, error: TABLE_MISSING_ERROR };
  }

  revalidateFormation(slug);
  return { ok: true, slug };
}

export async function duplicateFormation(
  rawSlug: string,
): Promise<FormationActionResult> {
  await assertAdminAccess();

  const slug = normalizeSlug(rawSlug);
  const source = await loadManagedFormationBySlug(slug);
  if (!source) {
    return { ok: false, error: "Formation introuvable." };
  }

  try {
    const repository = getFormationsRepository();

    // Build the set of taken slugs (static catalog + DB rows).
    const taken = new Set<string>(FORMATIONS_BY_SLUG.keys());
    try {
      const all = await repository.listAll();
      for (const item of all) taken.add(item.formation.slug);
    } catch {
      // Table missing — fall back to creating, which will surface the error.
    }

    let candidate = `${slug}-copie`;
    let suffix = 2;
    while (taken.has(candidate) && candidate.length <= MAX_SLUG_LENGTH) {
      candidate = `${slug}-copie-${suffix}`;
      suffix += 1;
    }

    const normalized = normalizeFormationDraft({
      ...source.formation,
      slug: candidate,
      title: `${source.formation.title} (copie)`,
    });
    if (!normalized.ok) {
      return { ok: false, error: normalized.error };
    }

    await repository.create({
      formation: normalized.formation,
      active: false,
      sortOrder: source.sortOrder,
      coverImageUrl: source.coverImageUrl,
      source: "admin",
    });

    revalidateFormation(candidate);
    return { ok: true, slug: candidate };
  } catch (error) {
    console.error(
      "[formations] duplicate failed:",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, error: TABLE_MISSING_ERROR };
  }
}

export interface DeleteFormationResult extends FormationActionResult {
  mode?: "deleted" | "hidden";
}

/**
 * Safe delete. Hard-deletes only admin-created formations with zero references
 * (planning sessions, preinscriptions, devis). Everything else — static
 * formations and referenced rows — is soft-deleted (deactivated) instead.
 */
export async function deleteFormation(
  rawSlug: string,
): Promise<DeleteFormationResult> {
  await assertAdminAccess();

  const slug = normalizeSlug(rawSlug);
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "Slug invalide." };
  }

  try {
    const references = await getFormationReferences(slug);

    if (references.canHardDelete) {
      await getFormationsRepository().delete(slug);
      revalidateFormation(slug);
      return { ok: true, slug, mode: "deleted" };
    }

    // Soft-delete: hide it without losing data or breaking references.
    await applyActiveState(slug, false);
    revalidateFormation(slug);
    return { ok: true, slug, mode: "hidden" };
  } catch (error) {
    console.error(
      "[formations] delete failed:",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, error: TABLE_MISSING_ERROR };
  }
}

export async function loadFormationReferences(
  rawSlug: string,
): Promise<FormationReferences> {
  await assertAdminAccess();
  return getFormationReferences(normalizeSlug(rawSlug));
}
