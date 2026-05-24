"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminNumberRangeFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minLabel?: string;
  maxLabel?: string;
}

export function AdminNumberRangeFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
  minLabel = "Min",
  maxLabel = "Max",
}: AdminNumberRangeFilterProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:min-w-[200px]">
      <label className="block min-w-0">
        <span className={`mb-1.5 block break-words ${adminStyles.label}`}>{minLabel}</span>
        <input
          type="number"
          min={0}
          value={min}
          onChange={(event) => onMinChange(event.target.value)}
          placeholder="—"
          className={`${adminStyles.inputSm} px-2.5 py-2`}
        />
      </label>
      <label className="block min-w-0">
        <span className={`mb-1.5 block break-words ${adminStyles.label}`}>{maxLabel}</span>
        <input
          type="number"
          min={0}
          value={max}
          onChange={(event) => onMaxChange(event.target.value)}
          placeholder="—"
          className={`${adminStyles.inputSm} px-2.5 py-2`}
        />
      </label>
    </div>
  );
}
