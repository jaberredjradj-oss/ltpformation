"use client";

import type { AdminListGroup } from "@/lib/admin/list-controls/types";
import { ADMIN_GROUP_LABELS } from "@/lib/admin/list-controls/types";
import { adminStyles } from "@/components/admin/admin-styles";

interface AdminGroupSelectProps {
  value: AdminListGroup;
  onChange: (value: AdminListGroup) => void;
  options?: AdminListGroup[];
}

const DEFAULT_GROUP_OPTIONS: AdminListGroup[] = ["none", "formation", "status", "month"];

export function AdminGroupSelect({
  value,
  onChange,
  options = DEFAULT_GROUP_OPTIONS,
}: AdminGroupSelectProps) {
  return (
    <label className="block min-w-0 w-full">
      <span className={`mb-1.5 block ${adminStyles.label}`}>Regroupement</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AdminListGroup)}
        className={`${adminStyles.inputSm} px-2.5 py-2 font-medium`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {ADMIN_GROUP_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
