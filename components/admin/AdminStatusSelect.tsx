"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminStatusSelectProps<T extends string> {
  value: T;
  options: Record<T, string>;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function AdminStatusSelect<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
}: AdminStatusSelectProps<T>) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as T)}
      className={`${adminStyles.inputSm} max-w-full px-2.5 py-1.5 font-medium`}
    >
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>
          {label as string}
        </option>
      ))}
    </select>
  );
}
