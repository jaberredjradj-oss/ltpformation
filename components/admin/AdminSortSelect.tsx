"use client";

import type { AdminListSort } from "@/lib/admin/list-controls/types";
import { ADMIN_SORT_LABELS } from "@/lib/admin/list-controls/types";
import { adminStyles } from "@/components/admin/admin-styles";

interface AdminSortSelectProps {
  value: AdminListSort;
  onChange: (value: AdminListSort) => void;
  options?: AdminListSort[];
}

const DEFAULT_SORT_OPTIONS: AdminListSort[] = [
  "newest",
  "oldest",
  "name-asc",
  "name-desc",
  "formation",
  "status",
  "session-date",
];

export function AdminSortSelect({
  value,
  onChange,
  options = DEFAULT_SORT_OPTIONS,
}: AdminSortSelectProps) {
  return (
    <label className="block min-w-0 w-full">
      <span className={`mb-1.5 block ${adminStyles.label}`}>Tri</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AdminListSort)}
        className={`${adminStyles.inputSm} px-2.5 py-2 font-medium`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {ADMIN_SORT_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
