"use client";

import { useMemo, useState } from "react";
import type {
  AdminTableColumnDef,
  AdminTablePageSize,
  SortDirection,
} from "@/lib/admin/data-table/types";
import { DEFAULT_ADMIN_TABLE_PAGE_SIZE } from "@/lib/admin/data-table/types";
import {
  filterByColumns,
  filterByDateRange,
  filterBySearch,
  paginateItems,
  sortTableItems,
} from "@/lib/admin/data-table/process";

interface UseAdminTableOptions<T> {
  items: T[];
  columns: AdminTableColumnDef<T>[];
  defaultSortColumn: string;
  defaultSortDirection?: SortDirection;
  defaultPageSize?: AdminTablePageSize;
  getSearchFields: (item: T) => Array<string | null | undefined>;
  getSubmittedAt: (item: T) => string;
}

export function useAdminTable<T>({
  items,
  columns,
  defaultSortColumn,
  defaultSortDirection = "desc",
  defaultPageSize = DEFAULT_ADMIN_TABLE_PAGE_SIZE,
  getSearchFields,
  getSubmittedAt,
}: UseAdminTableOptions<T>) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<AdminTablePageSize>(defaultPageSize);

  const columnMap = useMemo(
    () => new Map(columns.map((column) => [column.id, column])),
    [columns],
  );

  const filteredItems = useMemo(() => {
    let result = filterBySearch(items, search, getSearchFields);
    result = filterByDateRange(result, dateFrom, dateTo, getSubmittedAt);
    result = filterByColumns(result, columnFilters, (item, columnId) => {
      const column = columnMap.get(columnId);
      return column?.getFilterValue?.(item);
    });
    return result;
  }, [items, search, dateFrom, dateTo, columnFilters, columnMap, getSearchFields, getSubmittedAt]);

  const sortedItems = useMemo(
    () =>
      sortTableItems(filteredItems, sortColumn, sortDirection, (item, columnId) => {
        const column = columnMap.get(columnId);
        if (column?.getSortValue) return column.getSortValue(item);
        return "";
      }),
    [filteredItems, sortColumn, sortDirection, columnMap],
  );

  const { rows, totalPages, safePage } = useMemo(
    () => paginateItems(sortedItems, page, pageSize),
    [sortedItems, page, pageSize],
  );

  function toggleSort(columnId: string) {
    if (sortColumn === columnId) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function setColumnFilter(columnId: string, value: string) {
    setColumnFilters((current) => ({ ...current, [columnId]: value }));
    setPage(1);
  }

  function handlePageSizeChange(nextPageSize: AdminTablePageSize) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  function reset() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setColumnFilters({});
    setSortColumn(defaultSortColumn);
    setSortDirection(defaultSortDirection);
    setPage(1);
    setPageSize(defaultPageSize);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleDateFromChange(value: string) {
    setDateFrom(value);
    setPage(1);
  }

  function handleDateToChange(value: string) {
    setDateTo(value);
    setPage(1);
  }

  return {
    search,
    setSearch: handleSearch,
    dateFrom,
    setDateFrom: handleDateFromChange,
    dateTo,
    setDateTo: handleDateToChange,
    sortColumn,
    sortDirection,
    columnFilters,
    page: safePage,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalCount: sortedItems.length,
    totalItems: items.length,
    totalPages,
    rows,
    toggleSort,
    setColumnFilter,
    reset,
    columns,
    allItems: items,
  };
}
