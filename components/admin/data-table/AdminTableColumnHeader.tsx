"use client";

import { useEffect, useRef, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/lib/admin/data-table/types";

interface AdminTableColumnHeaderProps {
  label: string;
  columnId: string;
  sortable?: boolean;
  filterable?: boolean;
  sortColumn: string;
  sortDirection: SortDirection;
  filterValue?: string;
  filterOptions?: Array<{ value: string; label: string }>;
  onSort?: (columnId: string) => void;
  onFilterChange?: (columnId: string, value: string) => void;
  className?: string;
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <span className="ml-1 inline-flex flex-col gap-0.5 leading-none">
      <svg
        viewBox="0 0 8 5"
        className={cn("h-1.5 w-2", active && direction === "asc" ? "text-slate-900" : "text-slate-300")}
        aria-hidden
      >
        <path d="M4 0 7.5 5h-7L4 0Z" fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 8 5"
        className={cn("h-1.5 w-2", active && direction === "desc" ? "text-slate-900" : "text-slate-300")}
        aria-hidden
      >
        <path d="M4 5 0.5 0h7L4 5Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("h-3.5 w-3.5", active ? "text-blue-600" : "text-slate-400")}
      aria-hidden
    >
      <path
        d="M1.5 2.5h13l-4.5 5v4l-4 2V7.5L1.5 2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminTableColumnHeader({
  label,
  columnId,
  sortable = false,
  filterable = false,
  sortColumn,
  sortDirection,
  filterValue = "all",
  filterOptions = [],
  onSort,
  onFilterChange,
  className,
}: AdminTableColumnHeaderProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSorted = sortColumn === columnId;
  const isFiltered = filterValue !== "all" && filterValue !== "";

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <th className={cn("px-4 py-3 align-bottom", className)}>
      <div ref={containerRef} className="relative inline-flex max-w-full items-center gap-1">
        {sortable ? (
          <button
            type="button"
            onClick={() => onSort?.(columnId)}
            className={cn(
              "inline-flex min-w-0 max-w-full items-center gap-0.5 text-left font-medium whitespace-normal hover:text-slate-900",
              isSorted ? "text-slate-900" : "text-slate-600",
            )}
          >
            <span className="break-words">{label}</span>
            <SortIcon active={isSorted} direction={sortDirection} />
          </button>
        ) : (
          <span className="font-medium break-words text-slate-600">{label}</span>
        )}

        {filterable && filterOptions.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="rounded p-1 hover:bg-slate-100"
              aria-label={`Filtrer ${label}`}
            >
              <FilterIcon active={isFiltered} />
            </button>

            {open && (
              <div
                className={cn(
                  adminStyles.surface,
                  "absolute top-full left-0 z-20 mt-1 min-w-[160px] p-1 shadow-md",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange?.(columnId, "all");
                    setOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-md px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50",
                    !isFiltered && "font-medium text-slate-900",
                  )}
                >
                  Tous
                </button>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onFilterChange?.(columnId, option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50",
                      filterValue === option.value && "font-medium text-slate-900",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </th>
  );
}
