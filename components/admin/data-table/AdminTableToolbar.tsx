"use client";

import { AdminDateRangeFilter } from "@/components/admin/AdminDateRangeFilter";
import { AdminResultsSummary } from "@/components/admin/AdminResultsSummary";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { adminStyles } from "@/components/admin/admin-styles";

interface AdminTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  onReset: () => void;
}

export function AdminTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher…",
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  resultCount,
  totalCount,
  onReset,
}: AdminTableToolbarProps) {
  return (
    <div className={`mb-5 space-y-4 p-4 sm:p-5 ${adminStyles.surfaceBlue}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <p className={`mb-1.5 ${adminStyles.label}`}>Recherche</p>
          <AdminSearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="w-full lg:w-auto lg:min-w-[280px]">
          <p className={`mb-1.5 ${adminStyles.label}`}>Période</p>
          <AdminDateRangeFilter
            from={dateFrom}
            to={dateTo}
            onFromChange={onDateFromChange}
            onToChange={onDateToChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminResultsSummary count={resultCount} total={totalCount} />
        <button type="button" onClick={onReset} className={adminStyles.btnGhost}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
