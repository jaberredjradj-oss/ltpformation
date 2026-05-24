import { cn } from "@/lib/utils";

type BadgeVariant = "blue" | "gold" | "navy";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  blue: "bg-blue-100 text-blue-600 border-blue-200/60",
  gold: "bg-gold-100 text-gold-600 border-gold-400/30",
  navy: "bg-navy-900/5 text-navy-800 border-navy-800/10",
};

export function Badge({ children, variant = "blue", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
