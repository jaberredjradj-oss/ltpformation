import type { AdminListGroup } from "@/lib/admin/list-controls/types";
import { PREINSCRIPTION_STATUS_LABELS } from "@/lib/admin/constants";

export function toSelectOptions(values: string[], allLabel = "Tous"): Array<{ value: string; label: string }> {
  return values.map((value) => ({
    value,
    label: value === "all" ? allLabel : value,
  }));
}

export function statusSelectOptions<T extends string>(
  labels: Record<T, string>,
): Array<{ value: string; label: string }> {
  return [
    { value: "all", label: "Tous" },
    ...Object.entries(labels).map(([value, label]) => ({
      value,
      label: label as string,
    })),
  ];
}

export const PREINSCRIPTION_GROUP_OPTIONS: AdminListGroup[] = [
  "formation-session",
  "none",
  "status",
  "month",
];

export const DEVIS_GROUP_OPTIONS: AdminListGroup[] = [
  "status",
  "company",
  "formation-session",
  "formation",
  "none",
  "month",
];

export const PLANNING_GROUP_OPTIONS: AdminListGroup[] = ["none", "formation", "status", "month"];

export const MESSAGE_SORT_OPTIONS = ["unread-first", "newest", "oldest", "name-asc", "name-desc"] as const;

export { PREINSCRIPTION_STATUS_LABELS };
