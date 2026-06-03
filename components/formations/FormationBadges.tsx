import type { Formation } from "@/lib/formations/types";
import { FormationCertificationBadge } from "@/components/formations/FormationCertificationBadge";
import { cn } from "@/lib/utils";

interface FormationBadgesProps {
  formation: Formation;
  className?: string;
  compact?: boolean;
}

export function FormationBadges({ formation, className, compact }: FormationBadgesProps) {
  const badgeClass =
    "max-w-full whitespace-normal rounded-full px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em]";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <span className={cn(badgeClass, "border border-blue-200/70 bg-blue-50/80 text-blue-700")}>
        {formation.categoryLabel}
      </span>
      <span className={cn(badgeClass, "border border-gold-400/30 bg-gold-100/60 text-gold-700")}>
        {formation.typeLabel}
      </span>
      {formation.level && (
        <span className={cn(badgeClass, "border border-slate-200/90 bg-white text-navy-800")}>
          Niveau {formation.level}
        </span>
      )}
      {formation.certificationCode && (
        <FormationCertificationBadge code={formation.certificationCode} />
      )}
    </div>
  );
}
