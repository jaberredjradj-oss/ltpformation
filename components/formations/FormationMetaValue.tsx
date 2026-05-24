import { cn } from "@/lib/utils";

interface FormationMetaValueProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

export function FormationMetaValue({
  label,
  value,
  className,
  valueClassName,
}: FormationMetaValueProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 break-words text-pretty font-bold tabular-nums leading-snug text-navy-950",
          valueClassName ?? "text-sm",
        )}
      >
        {value}
      </p>
    </div>
  );
}
