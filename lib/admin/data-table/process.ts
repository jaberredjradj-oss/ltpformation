import type { SortDirection } from "@/lib/admin/data-table/types";
import {
  compareStringsAsc,
  isWithinDateRange,
  matchesSearchQuery,
} from "@/lib/admin/list-controls/utils";

export function filterBySearch<T>(
  items: T[],
  search: string,
  getFields: (item: T) => Array<string | null | undefined>,
): T[] {
  if (!search.trim()) return items;
  return items.filter((item) => matchesSearchQuery(search, getFields(item)));
}

export function filterByDateRange<T>(
  items: T[],
  dateFrom: string,
  dateTo: string,
  getDate: (item: T) => string,
): T[] {
  if (!dateFrom && !dateTo) return items;
  return items.filter((item) => isWithinDateRange(getDate(item), dateFrom, dateTo));
}

export function filterByColumns<T>(
  items: T[],
  columnFilters: Record<string, string>,
  getFilterValue: (item: T, columnId: string) => string | undefined,
): T[] {
  const active = Object.entries(columnFilters).filter(
    ([, value]) => value && value !== "all",
  );
  if (active.length === 0) return items;

  return items.filter((item) =>
    active.every(([columnId, value]) => getFilterValue(item, columnId) === value),
  );
}

export function sortTableItems<T>(
  items: T[],
  sortColumn: string,
  sortDirection: SortDirection,
  getSortValue: (item: T, columnId: string) => string | number,
): T[] {
  const sorted = [...items];
  const direction = sortDirection === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    const aValue = getSortValue(a, sortColumn);
    const bValue = getSortValue(b, sortColumn);

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction;
    }

    return compareStringsAsc(String(aValue), String(bValue)) * direction;
  });

  return sorted;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): { rows: T[]; totalPages: number; safePage: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    rows: items.slice(start, start + pageSize),
    totalPages,
    safePage,
  };
}

export function uniqueFilterOptions(
  values: string[],
  labelForValue?: (value: string) => string,
): Array<{ value: string; label: string }> {
  return [...new Set(values.filter(Boolean))]
    .sort(compareStringsAsc)
    .map((value) => ({
      value,
      label: labelForValue ? labelForValue(value) : value,
    }));
}
