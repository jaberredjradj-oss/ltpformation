"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminFilterSelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
}

export function AdminFilterSelect({
  label,
  value,
  options,
  onChange,
  className = "",
}: AdminFilterSelectProps) {
  return (
    <label className={`block min-w-0 w-full ${className}`}>
      <span className={`mb-1.5 block ${adminStyles.label}`}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${adminStyles.inputSm} px-2.5 py-2 font-medium`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
