import { FORMATION_DATA } from "@/lib/formations/data/registry";
import type { Formation, FormationCategoryId } from "@/lib/formations/types";

export const FORMATIONS: Formation[] = FORMATION_DATA;

export const FORMATIONS_BY_SLUG = new Map(
  FORMATIONS.map((formation) => [formation.slug, formation]),
);

export function getFormation(slug: string): Formation | undefined {
  return FORMATIONS_BY_SLUG.get(slug);
}

export function getFormationsByCategory(category: FormationCategoryId): Formation[] {
  return FORMATIONS.filter((formation) => formation.category === category);
}

export function getAllFormationSlugs(): string[] {
  return FORMATIONS.map((formation) => formation.slug);
}
