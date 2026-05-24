import type { AdminListGroup, AdminListQueryResult } from "@/lib/admin/list-controls/types";

export const FORMATION_SESSION_GENERAL_KEY = "__general__";
export const FORMATION_SESSION_NO_SESSION = "__no_session__";

export function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function matchesSearchQuery(
  query: string,
  fields: Array<string | null | undefined>,
): boolean {
  const normalized = normalizeSearch(query);
  if (!normalized) return true;
  return fields.some((field) => field && normalizeSearch(field).includes(normalized));
}

export function isWithinDateRange(
  iso: string,
  dateFrom: string,
  dateTo: string,
): boolean {
  const time = new Date(iso).getTime();
  if (dateFrom) {
    const from = new Date(`${dateFrom}T00:00:00`).getTime();
    if (time < from) return false;
  }
  if (dateTo) {
    const to = new Date(`${dateTo}T23:59:59`).getTime();
    if (time > to) return false;
  }
  return true;
}

export function monthKeyFromIso(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
}

export function compareStringsAsc(a: string, b: string): number {
  return a.localeCompare(b, "fr", { sensitivity: "base" });
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => compareStringsAsc(a, b));
}

export function splitContactName(contactName: string): { firstName: string; lastName: string } {
  const parts = contactName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function getQueryResultCount<T>(result: AdminListQueryResult<T>): number {
  return result.mode === "flat" ? result.items.length : result.total;
}

export function getFormationSessionKey(
  formationTitle: string | null | undefined,
  sessionLabel: string | null | undefined,
): string {
  const formation = formationTitle?.trim();
  if (!formation) return FORMATION_SESSION_GENERAL_KEY;
  const session = sessionLabel?.trim() || FORMATION_SESSION_NO_SESSION;
  return `${formation}|||${session}`;
}

export function getFormationSessionLabel(key: string): string {
  if (key === FORMATION_SESSION_GENERAL_KEY) return "Demandes générales";
  const [formation, session] = key.split("|||");
  if (session === FORMATION_SESSION_NO_SESSION) {
    return `${formation} — Session non précisée`;
  }
  return `${formation} — ${session}`;
}

export function sortFormationSessionGroupKeys(a: string, b: string): number {
  if (a === FORMATION_SESSION_GENERAL_KEY) return 1;
  if (b === FORMATION_SESSION_GENERAL_KEY) return -1;

  const [formationA, sessionA] = a.split("|||");
  const [formationB, sessionB] = b.split("|||");
  const formationCompare = compareStringsAsc(formationA, formationB);
  if (formationCompare !== 0) return formationCompare;

  if (sessionA === FORMATION_SESSION_NO_SESSION) return 1;
  if (sessionB === FORMATION_SESSION_NO_SESSION) return -1;
  return compareStringsAsc(sessionA, sessionB);
}

export function groupItems<T>(
  items: T[],
  group: AdminListGroup,
  getGroupKey: (item: T) => string,
  getGroupLabel: (key: string, item: T) => string,
  sortGroupKeys?: (a: string, b: string) => number,
): AdminListQueryResult<T> {
  if (group === "none") {
    return { mode: "flat", items };
  }

  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = getGroupKey(item);
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }

  const sortKeys = sortGroupKeys ?? compareStringsAsc;
  const groups = [...map.entries()]
    .sort(([a], [b]) => sortKeys(a, b))
    .map(([key, groupItems]) => ({
      key,
      label: getGroupLabel(key, groupItems[0]),
      items: groupItems,
    }));

  return {
    mode: "grouped",
    groups,
    total: items.length,
  };
}

export function groupByFormationSession<T>(
  items: T[],
  getFormationTitle: (item: T) => string,
  getSessionLabel: (item: T) => string | null | undefined,
): AdminListQueryResult<T> {
  return groupItems(
    items,
    "formation-session",
    (item) => getFormationSessionKey(getFormationTitle(item), getSessionLabel(item)),
    (key) => getFormationSessionLabel(key),
    sortFormationSessionGroupKeys,
  );
}
