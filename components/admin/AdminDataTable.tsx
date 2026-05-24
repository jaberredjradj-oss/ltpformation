"use client";

import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminDataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminDataTable({
  children,
  className,
  nested,
}: AdminDataTableProps & { nested?: boolean }) {
  return (
    <div
      className={cn(
        nested ? "overflow-hidden" : cn(adminStyles.surface, "overflow-hidden"),
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return <table className="min-w-full text-left text-sm">{children}</table>;
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return <thead className={adminStyles.tableHead}>{children}</thead>;
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function AdminTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-slate-50/70", className)}>{children}</tr>
  );
}

export function AdminTableCell({
  children,
  className,
  zone,
}: {
  children: React.ReactNode;
  className?: string;
  zone?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3.5 align-top text-sm text-slate-700",
        zone && "border-r border-slate-100 last:border-r-0",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 font-medium whitespace-nowrap", className)}>{children}</th>
  );
}
