import type { AdminPlanningRow } from "@/lib/admin/types";
import type { AdminListQueryResult, PlanningListQuery } from "@/lib/admin/list-controls/types";
import { compareStringsAsc, groupItems, matchesSearchQuery } from "@/lib/admin/list-controls/utils";

export const DEFAULT_PLANNING_QUERY: PlanningListQuery = {
  search: "",
  sort: "session-date",
  group: "none",
  category: "all",
  formation: "all",
  availability: "all",
  visibility: "all",
  month: "all",
};

function sortPlanningRows(
  items: AdminPlanningRow[],
  sort: PlanningListQuery["sort"],
): AdminPlanningRow[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sort) {
      case "name-asc":
        return compareStringsAsc(a.formationTitle, b.formationTitle);
      case "name-desc":
        return compareStringsAsc(b.formationTitle, a.formationTitle);
      case "status":
        return compareStringsAsc(a.availabilityLabel, b.availabilityLabel);
      case "oldest":
        return compareStringsAsc(a.startDate ?? "", b.startDate ?? "");
      case "newest":
        return compareStringsAsc(b.startDate ?? "", a.startDate ?? "");
      case "session-date":
      default:
        return compareStringsAsc(a.startDate ?? a.dateLabel, b.startDate ?? b.dateLabel);
    }
  });

  return sorted;
}

export function queryPlanningRows(
  items: AdminPlanningRow[],
  query: PlanningListQuery,
): AdminListQueryResult<AdminPlanningRow> {
  let filtered = items.filter((item) => {
    if (query.category !== "all" && item.categoryLabel !== query.category) return false;
    if (query.formation !== "all" && item.formationTitle !== query.formation) return false;
    if (query.availability !== "all" && item.availabilityLabel !== query.availability) {
      return false;
    }
    if (query.visibility === "visible" && !item.visible) return false;
    if (query.visibility === "hidden" && item.visible) return false;
    if (query.month !== "all" && item.monthKey !== query.month) return false;

    return matchesSearchQuery(query.search, [
      item.formationTitle,
      item.location,
      item.dateLabel,
      item.id,
    ]);
  });

  filtered = sortPlanningRows(filtered, query.sort);

  if (query.group === "formation") {
    return groupItems(
      filtered,
      query.group,
      (item) => item.formationTitle,
      (key) => key,
    );
  }

  if (query.group === "status") {
    return groupItems(
      filtered,
      query.group,
      (item) => item.availabilityLabel,
      (key) => key,
    );
  }

  if (query.group === "month" && filtered.some((item) => item.monthKey)) {
    return groupItems(
      filtered,
      query.group,
      (item) => item.monthKey ?? "unknown",
      (key) => {
        if (key === "unknown") return "Date inconnue";
        const [year, month] = key.split("-").map(Number);
        return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
          new Date(year, month - 1, 1),
        );
      },
    );
  }

  return { mode: "flat", items: filtered };
}

export function getPlanningFilterOptions(items: AdminPlanningRow[]) {
  return {
    categories: [
      "all",
      ...new Set(items.map((item) => item.categoryLabel).filter(Boolean) as string[]),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
    formations: [
      "all",
      ...new Set(items.map((item) => item.formationTitle).filter(Boolean)),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
    availability: [
      "all",
      ...new Set(items.map((item) => item.availabilityLabel).filter(Boolean)),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
    months: [
      "all",
      ...new Set(items.map((item) => item.monthKey).filter(Boolean) as string[]),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
  };
}
