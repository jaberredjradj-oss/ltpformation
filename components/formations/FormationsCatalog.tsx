"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildFormationsSearchParams,
  parseFormationFilters,
  parseFormationSort,
  queryFormations,
} from "@/lib/formations/search";
import type {
  Formation,
  FormationCategoryId,
  FormationFilters,
  FormationSort,
} from "@/lib/formations/types";
import { CategoryNav } from "@/components/formations/CategoryNav";
import { FormationsGrid } from "@/components/formations/FormationsGrid";
import { FormationsToolbar } from "@/components/formations/FormationsToolbar";
import { Container } from "@/components/ui/Container";

interface FormationsCatalogProps {
  formations: Formation[];
}

export function FormationsCatalog({ formations }: FormationsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFormationFilters(searchParams),
    [searchParams],
  );
  const sort = useMemo(() => parseFormationSort(searchParams), [searchParams]);

  const results = useMemo(
    () => queryFormations(formations, filters, sort),
    [formations, filters, sort],
  );

  const counts = useMemo(() => {
    const base = {
      all: formations.length,
      "securite-incendie": 0,
      secourisme: 0,
      surete: 0,
      "habilitation-electrique": 0,
    } as Record<FormationCategoryId | "all", number>;

    for (const formation of formations) {
      base[formation.category] += 1;
    }

    return base;
  }, [formations]);

  function syncUrl(nextFilters: FormationFilters, nextSort: FormationSort) {
    const params = buildFormationsSearchParams(nextFilters, nextSort);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleFiltersChange(nextFilters: FormationFilters) {
    syncUrl(nextFilters, sort);
  }

  function handleSortChange(nextSort: FormationSort) {
    syncUrl(filters, nextSort);
  }

  function handleCategoryChange(category: FormationCategoryId | "all") {
    const nextFilters: FormationFilters = {
      ...filters,
      category,
      level: category === "securite-incendie" ? filters.level : "all",
    };
    syncUrl(nextFilters, sort);
  }

  function handleReset() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <section className="section-wash-surface pb-12 pt-6 md:pb-24 md:pt-10">
      <Container className="space-y-6 md:space-y-8">
        <CategoryNav
          activeCategory={filters.category}
          onCategoryChange={handleCategoryChange}
          counts={counts}
        />
        <FormationsToolbar
          filters={filters}
          sort={sort}
          resultCount={results.length}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onReset={handleReset}
        />
        <FormationsGrid
          formations={results}
          activeCategory={filters.category}
          groupByCategory={filters.category === "all" && !filters.query}
        />
      </Container>
    </section>
  );
}
