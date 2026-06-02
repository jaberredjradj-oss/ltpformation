import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 whitespace-normal text-center leading-tight sm:min-h-0 sm:py-1.5 sm:tracking-[0.12em]",
        active
          ? "border-blue-300/70 bg-blue-100/70 text-blue-700 shadow-[0_0_24px_rgba(43,127,212,0.12)]"
          : "border-slate-200/90 bg-white/80 text-slate-600 hover:border-blue-200 hover:text-blue-600",
        className,
      )}
    >
      {label}
    </Component>
  );
}
