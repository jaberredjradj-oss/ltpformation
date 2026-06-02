import { cache } from "react";
import { isRealDataEnabled } from "@/lib/db/env";
import { FORMATIONS } from "@/lib/formations/catalog";
import type { Formation } from "@/lib/formations/types";
import { supabaseFormationsRepository } from "@/lib/repositories/formations/supabase-formations";
import type {
  FormationsRepository,
  ManagedFormation,
} from "@/lib/repositories/formations/types";

/**
 * The static catalog is the immutable baseline. It is always available and is
 * never mutated or removed by this layer. Database rows only OVERLAY it.
 */
function staticBaseline(): ManagedFormation[] {
  return FORMATIONS.map((formation, index) => ({
    formation,
    active: true,
    sortOrder: index,
    coverImageUrl: null,
    source: "static" as const,
    updatedAt: null,
  }));
}

export function getFormationsRepository(): FormationsRepository {
  return supabaseFormationsRepository;
}

/**
 * Fetch the raw database overlay once per request (deduped via React `cache`).
 *
 * Returns an empty list when real data is disabled OR on any failure (missing
 * `formations` table, Supabase outage). An empty overlay is equivalent to
 * "static only", so the public site and admin keep working with zero regression.
 */
const loadOverlayRows = cache(async (): Promise<ManagedFormation[]> => {
  if (!isRealDataEnabled()) {
    return [];
  }

  try {
    return await supabaseFormationsRepository.listAll();
  } catch (error) {
    console.error(
      "[formations] overlay unavailable, using static catalog:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
});

/**
 * Merge the static baseline with the database overlay.
 *
 * - A DB row whose slug matches a static formation OVERRIDES it.
 * - A DB row with a new slug ADDS a formation.
 * - A DB row with `active = false` HIDES that slug (unless includeInactive).
 *
 * Safety: never throws. The DB read is cached and falls back to an empty
 * overlay on any failure, so this always returns at least the static catalog.
 */
export async function loadManagedFormations(options?: {
  includeInactive?: boolean;
}): Promise<ManagedFormation[]> {
  const includeInactive = options?.includeInactive ?? false;
  const merged = new Map<string, ManagedFormation>();
  for (const item of staticBaseline()) {
    merged.set(item.formation.slug, item);
  }

  for (const managed of await loadOverlayRows()) {
    if (!managed.active && !includeInactive) {
      merged.delete(managed.formation.slug);
      continue;
    }
    merged.set(managed.formation.slug, managed);
  }

  return Array.from(merged.values());
}

/** Public list: active formations only, as plain `Formation` objects. */
export async function loadFormations(): Promise<Formation[]> {
  const managed = await loadManagedFormations({ includeInactive: false });
  return managed.map((item) => item.formation);
}

/** Public single read by slug. Returns null if missing or inactive. */
export async function loadFormation(slug: string): Promise<Formation | null> {
  const managed = await loadManagedFormations({ includeInactive: false });
  return managed.find((item) => item.formation.slug === slug)?.formation ?? null;
}

/** All publicly visible slugs (for params / sitemaps). */
export async function loadPublicFormationSlugs(): Promise<string[]> {
  const formations = await loadFormations();
  return formations.map((formation) => formation.slug);
}
