export type AdminListSort =
  | "newest"
  | "oldest"
  | "unread-first"
  | "name-asc"
  | "name-desc"
  | "formation"
  | "status"
  | "session-date";

export type AdminListGroup =
  | "none"
  | "formation-session"
  | "formation"
  | "status"
  | "month"
  | "company";

export interface AdminListQueryBase {
  search: string;
  sort: AdminListSort;
  group: AdminListGroup;
  dateFrom: string;
  dateTo: string;
}

export interface PreinscriptionListQuery extends AdminListQueryBase {
  status: "all" | import("@/lib/admin/types").PreinscriptionStatus;
  formation: string;
  session: string;
  cpf: string;
}

export interface DevisListQuery extends AdminListQueryBase {
  status: "all" | import("@/lib/admin/types").DevisRequestStatus;
  formation: string;
  company: string;
  participantMin: string;
  participantMax: string;
}

export interface MessageListQuery extends AdminListQueryBase {
  status: "all" | import("@/lib/admin/types").ContactMessageStatus;
}

export interface PlanningListQuery {
  search: string;
  sort: AdminListSort;
  group: AdminListGroup;
  category: string;
  formation: string;
  availability: string;
  visibility: "all" | "visible" | "hidden";
  month: string;
}

export interface AdminListGroupSection<T> {
  key: string;
  label: string;
  items: T[];
}

export type AdminListQueryResult<T> =
  | { mode: "flat"; items: T[] }
  | { mode: "grouped"; groups: AdminListGroupSection<T>[]; total: number };

export const ADMIN_SORT_LABELS: Record<AdminListSort, string> = {
  newest: "Plus récentes d'abord",
  oldest: "Plus anciennes d'abord",
  "unread-first": "Non lus d'abord",
  "name-asc": "A → Z",
  "name-desc": "Z → A",
  formation: "Formation",
  status: "Statut",
  "session-date": "Date de session",
};

export const ADMIN_GROUP_LABELS: Record<AdminListGroup, string> = {
  none: "Liste simple",
  "formation-session": "Par formation et session",
  formation: "Par formation",
  status: "Par statut",
  month: "Par mois",
  company: "Par entreprise",
};
