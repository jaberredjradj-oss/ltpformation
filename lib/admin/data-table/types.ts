export type SortDirection = "asc" | "desc";

export const ADMIN_TABLE_PAGE_SIZES = [15, 25, 50, 100] as const;
export type AdminTablePageSize = (typeof ADMIN_TABLE_PAGE_SIZES)[number];

export const DEFAULT_ADMIN_TABLE_PAGE_SIZE: AdminTablePageSize = 25;

export interface AdminTableColumnDef<T> {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  getFilterValue?: (item: T) => string;
  getFilterOptions?: (items: T[]) => Array<{ value: string; label: string }>;
  getSortValue?: (item: T) => string | number;
}

export interface AdminTableQueryState {
  search: string;
  dateFrom: string;
  dateTo: string;
  sortColumn: string;
  sortDirection: SortDirection;
  columnFilters: Record<string, string>;
  page: number;
  pageSize: AdminTablePageSize;
}
