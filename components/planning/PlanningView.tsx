"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildPlanningSearchParams,
  countCpfEligibleSessions,
  getPlanningCategoryCounts,
  getVisiblePlanningSessions,
  groupPlanningSessionsByMonth,
  parsePlanningFilters,
  queryPlanningSessions,
} from "@/lib/planning";
import type { PlanningFilters, PlanningSession } from "@/lib/planning/types";
import { PlanningFiltersPanel } from "@/components/planning/PlanningFiltersPanel";
import { PlanningHero } from "@/components/planning/PlanningHero";
import { PlanningMonthSection } from "@/components/planning/PlanningMonthSection";
import { Container } from "@/components/ui/Container";

interface PlanningViewProps {
  initialSessions: PlanningSession[];
}

export function PlanningView({ initialSessions }: PlanningViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parsePlanningFilters(searchParams),
    [searchParams],
  );

  const visibleSessions = useMemo(
    () => getVisiblePlanningSessions(initialSessions),
    [initialSessions],
  );
  const results = useMemo(
    () => queryPlanningSessions(initialSessions, filters),
    [initialSessions, filters],
  );
  const monthGroups = useMemo(() => groupPlanningSessionsByMonth(results), [results]);
  const counts = useMemo(() => getPlanningCategoryCounts(initialSessions), [initialSessions]);
  const cpfCount = useMemo(
    () => countCpfEligibleSessions(visibleSessions),
    [visibleSessions],
  );
  const year = visibleSessions[0]?.year ?? new Date().getFullYear();

  function syncUrl(nextFilters: PlanningFilters) {
    const params = buildPlanningSearchParams(nextFilters);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleFiltersChange(nextFilters: PlanningFilters) {
    syncUrl(nextFilters);
  }

  function handleReset() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
      <PlanningHero
        sessionCount={visibleSessions.length}
        cpfCount={cpfCount}
        year={year}
      />

      <section className="section-wash-surface pb-12 md:pb-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="editorial-lead text-pretty">
              Les sessions se déroulent à Voisins-le-Bretonneux, dans des salles
              équipées. Les groupes sont limités pour favoriser la pratique et
              l&apos;accompagnement personnalisé.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-body-strong">
              Session complète ou besoin intra-entreprise ?{" "}
              <Link href="/contact" className="font-semibold text-blue-600 hover:text-blue-700">
                Contactez-nous
              </Link>
              . Pour réserver une place, utilisez la pré-inscription depuis chaque
              session.
            </p>
          </div>

          <div className="mt-8 lg:hidden">
            <PlanningFiltersPanel
              filters={filters}
              resultCount={results.length}
              counts={counts}
              onFiltersChange={handleFiltersChange}
              onReset={handleReset}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <PlanningFiltersPanel
                  filters={filters}
                  resultCount={results.length}
                  counts={counts}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleReset}
                />
              </div>
            </aside>

            <div className="min-w-0 space-y-10 md:space-y-14">
              {monthGroups.length > 0 ? (
                monthGroups.map((group) => (
                  <PlanningMonthSection key={group.key} group={group} />
                ))
              ) : (
                <div className="refined-card px-6 py-10 text-center md:px-8">
                  <p className="text-lg font-semibold text-navy-950">
                    Aucune session ne correspond à votre recherche
                  </p>
                  <p className="mt-2 text-sm text-body-strong">
                    Modifiez vos filtres ou contactez-nous pour une session sur mesure.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
