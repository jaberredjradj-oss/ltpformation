import type { ResolvedAvailabilityStatus } from "@/lib/planning/availability";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ResolvedAvailabilityStatus, string> = {
  available: "border-emerald-300/50 bg-emerald-50/90 text-emerald-800",
  limited: "border-amber-300/50 bg-amber-50/90 text-amber-800",
  full: "border-slate-300/70 bg-slate-100/90 text-slate-700",
  cancelled: "border-red-300/50 bg-red-50/90 text-red-700",
  unknown: "border-emerald-300/50 bg-emerald-50/90 text-emerald-800",
};

interface SessionAvailabilityBadgeProps {
  label: string;
  status: ResolvedAvailabilityStatus;
  className?: string;
}

export function SessionAvailabilityBadge({
  label,
  status,
  className,
}: SessionAvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full whitespace-normal rounded-full border px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em]",
        STATUS_STYLES[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
