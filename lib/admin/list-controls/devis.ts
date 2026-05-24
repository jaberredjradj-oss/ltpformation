import { DEVIS_STATUS_LABELS } from "@/lib/admin/constants";
import type { AdminDevisRequest, DevisRequestStatus } from "@/lib/admin/types";
import type { AdminListQueryResult, DevisListQuery } from "@/lib/admin/list-controls/types";
import {
  compareStringsAsc,
  formatMonthLabel,
  groupByFormationSession,
  groupItems,
  isWithinDateRange,
  matchesSearchQuery,
  monthKeyFromIso,
  splitContactName,
} from "@/lib/admin/list-controls/utils";

const DEVIS_STATUS_ORDER: DevisRequestStatus[] = ["new", "contacted", "processed", "archived"];

export const DEFAULT_DEVIS_QUERY: DevisListQuery = {
  search: "",
  sort: "newest",
  group: "status",
  status: "all",
  formation: "all",
  company: "all",
  participantMin: "",
  participantMax: "",
  dateFrom: "",
  dateTo: "",
};

function sortDevis(items: AdminDevisRequest[], sort: DevisListQuery["sort"]): AdminDevisRequest[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case "name-asc":
        return compareStringsAsc(a.company, b.company);
      case "name-desc":
        return compareStringsAsc(b.company, a.company);
      case "formation":
        return compareStringsAsc(a.formationTitle, b.formationTitle);
      case "status":
        return compareStringsAsc(a.status, b.status);
      case "session-date":
        return compareStringsAsc(a.sessionLabel ?? "", b.sessionLabel ?? "");
      case "newest":
      default:
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  return sorted;
}

function sortDevisStatusGroupKeys(a: string, b: string): number {
  return DEVIS_STATUS_ORDER.indexOf(a as DevisRequestStatus) - DEVIS_STATUS_ORDER.indexOf(b as DevisRequestStatus);
}

export function queryDevisRequests(
  items: AdminDevisRequest[],
  query: DevisListQuery,
): AdminListQueryResult<AdminDevisRequest> {
  let filtered = items.filter((item) => {
    if (query.status !== "all" && item.status !== query.status) return false;
    if (query.formation !== "all" && item.formationTitle !== query.formation) return false;
    if (query.company !== "all" && item.company !== query.company) return false;
    if (query.participantMin && item.participantCount < Number(query.participantMin)) return false;
    if (query.participantMax && item.participantCount > Number(query.participantMax)) return false;
    if (!isWithinDateRange(item.submittedAt, query.dateFrom, query.dateTo)) return false;

    const { firstName, lastName } = splitContactName(item.contactName);
    return matchesSearchQuery(query.search, [
      item.company,
      firstName,
      lastName,
      item.contactName,
      item.email,
      item.phone,
      item.formationTitle,
      item.sessionLabel,
    ]);
  });

  filtered = sortDevis(filtered, query.sort);

  if (query.group === "formation-session") {
    return groupByFormationSession(
      filtered,
      (item) => item.formationTitle,
      (item) => item.sessionLabel,
    );
  }

  if (query.group === "company") {
    return groupItems(
      filtered,
      query.group,
      (item) => item.company,
      (key) => key,
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
      (key) => DEVIS_STATUS_LABELS[key as AdminDevisRequest["status"]],
      sortDevisStatusGroupKeys,
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

export function getDevisFilterOptions(items: AdminDevisRequest[]) {
  return {
    formations: [
      "all",
      ...new Set(items.map((item) => item.formationTitle).filter(Boolean)),
    ].sort((a, b) => (a === "all" ? -1 : compareStringsAsc(a, b))),
    companies: ["all", ...new Set(items.map((item) => item.company).filter(Boolean))].sort(
      (a, b) => (a === "all" ? -1 : compareStringsAsc(a, b)),
    ),
  };
}

export function hidesDevisIdentityColumn(group: DevisListQuery["group"]): boolean {
  return group === "company";
}

export function hidesDevisStatusColumn(group: DevisListQuery["group"]): boolean {
  return group === "status";
}

export function hidesDevisContextColumns(group: DevisListQuery["group"]): boolean {
  return group === "formation-session" || group === "formation";
}
