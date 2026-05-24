"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminListSectionProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AdminListSection({
  title,
  count,
  defaultOpen = true,
  children,
  className,
}: AdminListSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:flex-row sm:items-start sm:justify-between sm:gap-4 border-b border-slate-100 bg-slate-50/80"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-snug text-navy-950">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-body-strong">
            {count} entrée{count > 1 ? "s" : ""}
          </p>
        </div>
        <span className="shrink-0 self-start text-xs font-semibold text-blue-600 sm:self-center">
          {open ? "Réduire" : "Développer"}
        </span>
      </button>
      {open ? children : null}
    </section>
  );
}
