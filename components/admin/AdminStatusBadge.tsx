"use client";

import { cn } from "@/lib/utils";

const toneStyles = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  gold: "border-amber-200 bg-amber-50 text-amber-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
} as const;

interface AdminStatusBadgeProps {
  label: string;
  tone?: keyof typeof toneStyles;
  className?: string;
}

export function AdminStatusBadge({
  label,
  tone = "neutral",
  className,
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium leading-snug whitespace-normal text-center [overflow-wrap:anywhere]",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
