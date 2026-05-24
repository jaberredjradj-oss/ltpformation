"use client";

import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminOperationalCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminOperationalCard({ children, className }: AdminOperationalCardProps) {
  return (
    <article className={cn(adminStyles.mobileCard, "min-w-0", className)}>
      {children}
    </article>
  );
}

interface AdminOperationalCardListProps {
  children: React.ReactNode;
  nested?: boolean;
  className?: string;
}

export function AdminOperationalCardList({
  children,
  nested = false,
  className,
}: AdminOperationalCardListProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4",
        nested ? "bg-slate-50 p-3 sm:p-4" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AdminOperationalCardHeaderProps {
  title: React.ReactNode;
  badge?: React.ReactNode;
}

export function AdminOperationalCardHeader({ title, badge }: AdminOperationalCardHeaderProps) {
  if (!badge) {
    return (
      <h3 className="break-words text-base font-semibold leading-snug text-slate-900">{title}</h3>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <h3 className="min-w-0 flex-1 break-words text-base font-semibold leading-snug text-slate-900">
        {title}
      </h3>
      <div className="max-w-full shrink-0 self-start">{badge}</div>
    </div>
  );
}

export function AdminOperationalCardContact({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 break-words text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
      {children}
    </p>
  );
}

export function AdminOperationalCardContext({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 space-y-2.5 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-800">
      {children}
    </div>
  );
}

export function AdminOperationalContextLine({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="break-words leading-relaxed [overflow-wrap:anywhere]">
      <span className="font-medium text-slate-500">{label} :</span>{" "}
      <span>{children}</span>
    </p>
  );
}

interface AdminOperationalCardFooterProps {
  primaryActions?: React.ReactNode;
  statusControl: React.ReactNode;
}

export function AdminOperationalCardFooter({
  primaryActions,
  statusControl,
}: AdminOperationalCardFooterProps) {
  return (
    <div className="mt-5 border-t border-slate-200 pt-4">
      {primaryActions ? (
        <div className="flex flex-wrap gap-2 sm:gap-3">{primaryActions}</div>
      ) : null}
      <div className={cn("w-full min-w-0", primaryActions ? "mt-4" : "")}>{statusControl}</div>
    </div>
  );
}

export function AdminOperationalPrimaryButton({
  label,
  onClick,
  href,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const className = adminStyles.btnPrimary;

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

export function AdminOperationalSecondaryButton({
  label,
  href,
  onClick,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const className = adminStyles.btnSecondary;

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

export function AdminOperationalStatusControl({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block w-full min-w-0 max-w-full sm:max-w-xs">
      <span className={`mb-1.5 block ${adminStyles.label}`}>{label}</span>
      {children}
    </label>
  );
}
