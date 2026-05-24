import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type { FormationCategoryId } from "@/lib/formations/types";
import { isSessionCpfEligible } from "@/lib/planning/cpf";
import { formatMonthGroupKey, formatMonthGroupLabel } from "@/lib/planning/format";
import { PLANNING_SESSIONS } from "@/lib/planning/sessions";
import type {
  PlanningFilters,
  PlanningMonthGroup,
  PlanningSession,
} from "@/lib/planning/types";

export function getVisiblePlanningSessions(
  sessions: PlanningSession[] = PLANNING_SESSIONS,
): PlanningSession[] {
  return sessions.filter((session) => session.visible && session.status !== "cancelled");
}

export function searchPlanningSessions(
  sessions: PlanningSession[],
  query: string,
): PlanningSession[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return sessions;

  return sessions.filter((session) => {
    const haystack = [
      session.formationTitle,
      session.sessionType,
      session.categoryLabel,
      session.location,
      session.certificationCode ?? "",
      ...session.notes,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function filterPlanningSessions(
  sessions: PlanningSession[],
  filters: PlanningFilters,
): PlanningSession[] {
  return sessions.filter((session) => {
    if (filters.category !== "all" && session.category !== filters.category) {
      return false;
    }

    if (filters.cpfOnly && !isSessionCpfEligible(session)) {
      return false;
    }

    return true;
  });
}

export function sortPlanningSessions(sessions: PlanningSession[]): PlanningSession[] {
  return [...sessions].sort((a, b) => {
    const dateDiff = a.startDate.localeCompare(b.startDate);
    if (dateDiff !== 0) return dateDiff;
    return a.formationTitle.localeCompare(b.formationTitle, "fr");
  });
}

export function queryPlanningSessions(
  sessions: PlanningSession[],
  filters: PlanningFilters,
): PlanningSession[] {
  const visible = getVisiblePlanningSessions(sessions);
  const searched = searchPlanningSessions(visible, filters.query);
  const filtered = filterPlanningSessions(searched, filters);
  return sortPlanningSessions(filtered);
}

export function groupPlanningSessionsByMonth(
  sessions: PlanningSession[],
): PlanningMonthGroup[] {
  const groups = new Map<string, PlanningMonthGroup>();

  for (const session of sessions) {
    const key = formatMonthGroupKey(session.startDate);
    const existing = groups.get(key);

    if (existing) {
      existing.sessions.push(session);
      continue;
    }

    groups.set(key, {
      key,
      label: formatMonthGroupLabel(session.startDate),
      sessions: [session],
    });
  }

  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key));
}

export function getPlanningCategoryCounts(
  sessions: PlanningSession[],
): Record<FormationCategoryId | "all", number> {
  const visible = getVisiblePlanningSessions(sessions);
  const counts = {
    all: visible.length,
    "securite-incendie": 0,
    secourisme: 0,
    surete: 0,
    "habilitation-electrique": 0,
  } satisfies Record<FormationCategoryId | "all", number>;

  for (const session of visible) {
    counts[session.category] += 1;
  }

  return counts;
}

export function parsePlanningFilters(searchParams: URLSearchParams): PlanningFilters {
  const category = searchParams.get("category");

  return {
    query: searchParams.get("q") ?? "",
    category:
      category === "securite-incendie" ||
      category === "secourisme" ||
      category === "surete" ||
      category === "habilitation-electrique"
        ? category
        : "all",
    cpfOnly: searchParams.get("cpf") === "true",
  };
}

export function buildPlanningSearchParams(filters: PlanningFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.cpfOnly) params.set("cpf", "true");

  return params;
}

export { FORMATION_CATEGORIES };

export function getPlanningSessionById(
  id: string,
  sessions: PlanningSession[],
): PlanningSession | undefined {
  return sessions.find((session) => session.id === id);
}
