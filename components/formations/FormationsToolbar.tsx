"use client";

import type { FormationFilters, FormationSort } from "@/lib/formations/types";
import { SearchInput } from "@/components/ui/SearchInput";

interface FormationsToolbarProps {
  filters: FormationFilters;
  sort: FormationSort;
  resultCount: number;
  onFiltersChange: (filters: FormationFilters) => void;
  onSortChange: (sort: FormationSort) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { value: FormationSort; label: string }[] = [
  { value: "default", label: "Ordre catalogue" },
  { value: "name-asc", label: "Nom A → Z" },
  { value: "duration-asc", label: "Durée croissante" },
  { value: "duration-desc", label: "Durée décroissante" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export function FormationsToolbar({
  filters,
  sort,
  resultCount,
  onFiltersChange,
  onSortChange,
  onReset,
}: FormationsToolbarProps) {
  return (
    <div className="refined-card space-y-4 p-4 sm:p-5 md:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <SearchInput
          value={filters.query}
          onChange={(query) => onFiltersChange({ ...filters, query })}
        />
        <div>
          <label
            htmlFor="formation-sort"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600"
          >
            Trier par
          </label>
          <select
            id="formation-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as FormationSort)}
            className="w-full rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 text-base font-medium text-navy-950 shadow-[var(--shadow-soft)] outline-none transition-all duration-300 focus:border-blue-300/80 sm:text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-sm font-medium text-lead-strong">
          {resultCount} résultat{resultCount > 1 ? "s" : ""}
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
  );
}
