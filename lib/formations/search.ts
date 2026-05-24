import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type {
  Formation,
  FormationCategoryId,
  FormationFilters,
  FormationSort,
} from "@/lib/formations/types";

const CATEGORY_ORDER = Object.fromEntries(
  FORMATION_CATEGORIES.map((category, index) => [category.id, index]),
) as Record<FormationCategoryId, number>;

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function searchFormations(formations: Formation[], query: string): Formation[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return formations;

  return formations.filter((formation) => {
    const haystack = [
      formation.title,
      formation.shortTitle,
      formation.categoryLabel,
      formation.typeLabel,
      formation.summary,
      formation.certificationCode ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function filterFormations(
  formations: Formation[],
  filters: FormationFilters,
): Formation[] {
  return formations.filter((formation) => {
    if (filters.category !== "all" && formation.category !== filters.category) {
      return false;
    }

    if (filters.type !== "all" && formation.type !== filters.type) {
      return false;
    }

    if (filters.level !== "all" && formation.level !== filters.level) {
      return false;
    }

    if (filters.cpfOnly && !formation.cpfEligible) {
      return false;
    }

    return true;
  });
}

export function sortFormations(formations: Formation[], sort: FormationSort): Formation[] {
  const sorted = [...formations];

  switch (sort) {
    case "duration-asc":
      return sorted.sort((a, b) => a.durationHours - b.durationHours);
    case "duration-desc":
      return sorted.sort((a, b) => b.durationHours - a.durationHours);
    case "price-asc":
      return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    case "default":
    default:
      return sorted.sort((a, b) => {
        const categoryDiff =
          CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
        if (categoryDiff !== 0) return categoryDiff;

        if (a.level && b.level && a.level !== b.level) {
          return a.level.localeCompare(b.level, "fr", { numeric: true });
        }

        return a.title.localeCompare(b.title, "fr");
      });
  }
}

export function queryFormations(
  formations: Formation[],
  filters: FormationFilters,
  sort: FormationSort,
): Formation[] {
  const searched = searchFormations(formations, filters.query);
  const filtered = filterFormations(searched, filters);
  return sortFormations(filtered, sort);
}

export function groupFormationsByCategory(
  formations: Formation[],
): Record<FormationCategoryId, Formation[]> {
  return formations.reduce(
    (groups, formation) => {
      groups[formation.category].push(formation);
      return groups;
    },
    {
      "securite-incendie": [],
      secourisme: [],
      surete: [],
      "habilitation-electrique": [],
    } as Record<FormationCategoryId, Formation[]>,
  );
}

export const DEFAULT_FORMATION_FILTERS: FormationFilters = {
  query: "",
  category: "all",
  type: "all",
  level: "all",
  cpfOnly: false,
};

export const DEFAULT_FORMATION_SORT: FormationSort = "default";

export function parseFormationFilters(searchParams: URLSearchParams): FormationFilters {
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const level = searchParams.get("level");

  return {
    query: searchParams.get("q") ?? "",
    category:
      category === "securite-incendie" ||
      category === "secourisme" ||
      category === "surete" ||
      category === "habilitation-electrique"
        ? category
        : "all",
    type:
      type === "initial" ||
      type === "recyclage" ||
      type === "remise-a-niveau" ||
      type === "mac" ||
      type === "certification"
        ? type
        : "all",
    level: level === "1" || level === "2" || level === "3" ? level : "all",
    cpfOnly: searchParams.get("cpf") === "true",
  };
}

export function parseFormationSort(searchParams: URLSearchParams): FormationSort {
  const sort = searchParams.get("sort");

  if (
    sort === "duration-asc" ||
    sort === "duration-desc" ||
    sort === "price-asc" ||
    sort === "price-desc" ||
    sort === "name-asc" ||
    sort === "default"
  ) {
    return sort;
  }

  return DEFAULT_FORMATION_SORT;
}

export function buildFormationsSearchParams(
  filters: FormationFilters,
  sort: FormationSort,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.level !== "all") params.set("level", filters.level);
  if (filters.cpfOnly) params.set("cpf", "true");
  if (sort !== DEFAULT_FORMATION_SORT) params.set("sort", sort);

  return params;
}
