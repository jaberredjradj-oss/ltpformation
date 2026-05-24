"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminDateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

export function AdminDateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
}: AdminDateRangeFilterProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:min-w-[200px]">
      <label className="block min-w-0">
        <span className={`mb-1.5 block ${adminStyles.label}`}>Du</span>
        <input
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          className={`${adminStyles.inputSm} px-2.5 py-2`}
        />
      </label>
      <label className="block min-w-0">
        <span className={`mb-1.5 block ${adminStyles.label}`}>Au</span>
        <input
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
          className={`${adminStyles.inputSm} px-2.5 py-2`}
        />
      </label>
    </div>
  );
}
