import { INSTALLMENT_LABEL } from "@/lib/formations/payment";
import { cn } from "@/lib/utils";

interface InstallmentBadgeProps {
  className?: string;
}

export function InstallmentBadge({ className }: InstallmentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 whitespace-normal rounded-full border border-gold-400/40 bg-gold-100/70 px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-gold-700",
        className,
      )}
    >
      <span aria-hidden className="text-[11px] leading-none">€</span>
      {INSTALLMENT_LABEL}
    </span>
  );
}
