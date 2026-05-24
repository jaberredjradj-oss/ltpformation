"use client";

import {
  ADMIN_TABLE_PAGE_SIZES,
  type AdminTablePageSize,
} from "@/lib/admin/data-table/types";
import { adminStyles } from "@/components/admin/admin-styles";

interface AdminTablePaginationProps {
  page: number;
  totalPages: number;
  pageSize: AdminTablePageSize;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: AdminTablePageSize) => void;
}

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`${adminStyles.btnSecondary} min-w-8 px-2`}
    >
      {children}
    </button>
  );
}

export function AdminTablePagination({
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: AdminTablePaginationProps) {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-2 text-xs text-slate-600">
        <span>Lignes par page</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value) as AdminTablePageSize)}
          className={`${adminStyles.inputSm} w-auto px-2 py-1.5`}
        >
          {ADMIN_TABLE_PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <NavButton label="Première page" onClick={() => onPageChange(1)} disabled={page <= 1}>
          «
        </NavButton>
        <NavButton label="Page précédente" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          ‹
        </NavButton>
        <span className="px-2 text-xs font-medium tabular-nums text-slate-600">
          Page {page} sur {totalPages}
        </span>
        <NavButton
          label="Page suivante"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          ›
        </NavButton>
        <NavButton
          label="Dernière page"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
        >
          »
        </NavButton>
      </div>
    </div>
  );
}
