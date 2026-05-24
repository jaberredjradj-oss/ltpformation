import type { AdminContactMessage, ContactMessageStatus } from "@/lib/admin/types";
import type { AdminListQueryResult, MessageListQuery } from "@/lib/admin/list-controls/types";
import {
  compareStringsAsc,
  isWithinDateRange,
  matchesSearchQuery,
} from "@/lib/admin/list-controls/utils";

export const DEFAULT_MESSAGE_QUERY: MessageListQuery = {
  search: "",
  sort: "unread-first",
  group: "none",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

function messageStatusPriority(status: ContactMessageStatus): number {
  if (status === "unread") return 0;
  if (status === "answered") return 1;
  return 2;
}

function sortMessages(
  items: AdminContactMessage[],
  sort: MessageListQuery["sort"],
): AdminContactMessage[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case "name-asc":
        return (
          compareStringsAsc(a.lastName, b.lastName) ||
          compareStringsAsc(a.firstName, b.firstName)
        );
      case "name-desc":
        return (
          compareStringsAsc(b.lastName, a.lastName) ||
          compareStringsAsc(b.firstName, a.firstName)
        );
      case "newest":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case "unread-first":
      default:
        return (
          messageStatusPriority(a.status) - messageStatusPriority(b.status) ||
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
    }
  });

  return sorted;
}

export function queryContactMessages(
  items: AdminContactMessage[],
  query: MessageListQuery,
): AdminListQueryResult<AdminContactMessage> {
  const filtered = items.filter((item) => {
    if (query.status !== "all" && item.status !== query.status) return false;
    if (!isWithinDateRange(item.submittedAt, query.dateFrom, query.dateTo)) return false;

    return matchesSearchQuery(query.search, [
      item.firstName,
      item.lastName,
      item.email,
      item.message,
    ]);
  });

  return { mode: "flat", items: sortMessages(filtered, query.sort) };
}
