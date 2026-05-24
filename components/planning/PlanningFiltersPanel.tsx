"use client";

import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type { FormationCategoryId } from "@/lib/formations/types";
import type { PlanningFilters } from "@/lib/planning/types";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchInput } from "@/components/ui/SearchInput";

interface PlanningFiltersPanelProps {
  filters: PlanningFilters;
  resultCount: number;
  counts: Record<FormationCategoryId | "all", number>;
  onFiltersChange: (filters: PlanningFilters) => void;
  onReset: () => void;
  className?: string;
}

export function PlanningFiltersPanel({
  filters,
  resultCount,
  counts,
  onFiltersChange,
  onReset,
  className,
}: PlanningFiltersPanelProps) {
  return (
    <div className={className}>
      <div className="refined-card space-y-5 p-5 md:p-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Recherche
          </p>
          <div className="mt-3">
            <SearchInput
              id="planning-search"
              value={filters.query}
              onChange={(query) => onFiltersChange({ ...filters, query })}
              placeholder="Rechercher une session…"
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Catégories
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              label={`Toutes (${counts.all})`}
              active={filters.category === "all"}
              onClick={() => onFiltersChange({ ...filters, category: "all" })}
            />
            {FORMATION_CATEGORIES.map((category) => (
              <FilterChip
                key={category.id}
                label={`${category.label} (${counts[category.id]})`}
                active={filters.category === category.id}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    category: filters.category === category.id ? "all" : category.id,
                  })
                }
              />
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Financement
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              label="Éligible CPF"
              active={filters.cpfOnly}
              onClick={() =>
                onFiltersChange({ ...filters, cpfOnly: !filters.cpfOnly })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm font-medium text-lead-strong">
            {resultCount} session{resultCount > 1 ? "s" : ""}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
