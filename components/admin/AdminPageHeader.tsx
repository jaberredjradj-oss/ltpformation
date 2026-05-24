"use client";

import { cn } from "@/lib/utils";
import { adminStyles } from "@/components/admin/admin-styles";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-7 rounded-lg border border-slate-200 bg-gradient-to-r from-white via-blue-50/20 to-white px-5 py-5 md:px-6",
        className,
      )}
    >
      {eyebrow && <p className={adminStyles.eyebrow}>{eyebrow}</p>}
      <h1
        className={cn(
          "text-xl font-semibold tracking-tight text-slate-900 md:text-2xl",
          eyebrow && "mt-1.5",
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>
      )}
    </header>
  );
}
