import { PREINSCRIPTION_STATUS_LABELS } from "@/lib/admin/constants";
import type { AdminPreinscription } from "@/lib/admin/types";
import type {
  AdminListQueryResult,
  PreinscriptionListQuery,
} from "@/lib/admin/list-controls/types";
import {
  compareStringsAsc,
  formatMonthLabel,
  groupByFormationSession,
  groupItems,
  isWithinDateRange,
  matchesSearchQuery,
  monthKeyFromIso,
} from "@/lib/admin/list-controls/utils";

export const DEFAULT_PREINSCRIPTION_QUERY: PreinscriptionListQuery = {
  search: "",
  sort: "name-asc",
  group: "formation-session",
  status: "all",
  formation: "all",
  session: "all",
  cpf: "all",
  dateFrom: "",
  dateTo: "",
};

function sortPreinscriptions(
  items: AdminPreinscription[],
  sort: PreinscriptionListQuery["sort"],
): AdminPreinscription[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case "name-asc":
        return (
          compareStringsAsc(a.lastName, b.lastName) ||
          compareStringsAsc(a.firstName, b.firstName)
        );
      case "name-desc":
        return (
          compareStringsAsc(b.lastName, a.lastName) ||
          compareStringsAsc(b.firstName, a.firstName)
        );
      case "formation":
        return compareStringsAsc(a.formationTitle, b.formationTitle);
      case "status":
        return compareStringsAsc(a.status, b.status);
      case "session-date":
        return compareStringsAsc(a.sessionLabel, b.sessionLabel);
      case "newest":
      default:
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  return sorted;
}

export function queryPreinscriptions(
  items: AdminPreinscription[],
  query: PreinscriptionListQuery,
): AdminListQueryResult<AdminPreinscription> {
  let filtered = items.filter((item) => {
    if (query.status !== "all" && item.status !== query.status) return false;
    if (query.formation !== "all" && item.formationTitle !== query.formation) return false;
    if (query.session !== "all" && item.sessionLabel !== query.session) return false;
    if (query.cpf !== "all" && (item.cpfFinancing ?? "") !== query.cpf) return false;
    if (!isWithinDateRange(item.submittedAt, query.dateFrom, query.dateTo)) return false;

    return matchesSearchQuery(query.search, [
      item.firstName,
      item.lastName,
      item.email,
      item.phone,
      item.formationTitle,
      item.sessionLabel,
    ]);
  });

  filtered = sortPreinscriptions(filtered, query.sort);

  if (query.group === "formation-session") {
    return groupByFormationSession(
      filtered,
      (item) => item.formationTitle,
      (item) => item.sessionLabel,
    );
  }

  if (query.group === "formation") {
    return groupItems(
      filtered,
      query.group,
      (item) => item.formationTitle || "Demandes générales",
      (key) => key,
    );
  }

  if (query.group === "status") {
    return groupItems(
      filtered,
      query.group,
      (item) => item.status,
      (key) => PREINSCRIPTION_STATUS_LABELS[key as AdminPreinscription["status"]],
    );
  }

  if (query.group === "month") {
    return groupItems(
      filtered,
      query.group,
      (item) => monthKeyFromIso(item.submittedAt),
      (key) => formatMonthLabel(key),
    );
  }

  return { mode: "flat", items: filtered };
}

export function getPreinscriptionFilterOptions(items: AdminPreinscription[]) {
  return {
    formations: [
      "all",
      ...new Set(items.map((item) => item.formationTitle).filter(Boolean)),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
    sessions: [
      "all",
      ...new Set(items.map((item) => item.sessionLabel).filter(Boolean)),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
    cpfOptions: [
      "all",
      ...new Set(items.map((item) => item.cpfFinancing).filter(Boolean) as string[]),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
  };
}

export function hidesPreinscriptionContextColumns(group: PreinscriptionListQuery["group"]): boolean {
  return group === "formation-session" || group === "formation";
}
