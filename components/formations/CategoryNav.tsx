"use client";

import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type { FormationCategoryId } from "@/lib/formations/types";
import { FilterChip } from "@/components/ui/FilterChip";

interface CategoryNavProps {
  activeCategory: FormationCategoryId | "all";
  onCategoryChange: (category: FormationCategoryId | "all") => void;
  counts: Record<FormationCategoryId | "all", number>;
}

export function CategoryNav({ activeCategory, onCategoryChange, counts }: CategoryNavProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
          Catégories
        </p>
        <p className="text-xs font-medium text-lead-strong">
          {counts.all} formation{counts.all > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label={`Toutes (${counts.all})`}
          active={activeCategory === "all"}
          onClick={() => onCategoryChange("all")}
        />
        {FORMATION_CATEGORIES.map((category) => (
          <FilterChip
            key={category.id}
            label={`${category.label} (${counts[category.id]})`}
            active={activeCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
