import type { Formation } from "@/lib/formations/types";
import { FormationCertificationBadge } from "@/components/formations/FormationCertificationBadge";
import { getCertificationCodeLabel } from "@/lib/formations/certification";

interface FormationCpfInfoProps {
  formation: Formation;
  compact?: boolean;
}

export function FormationCpfInfo({ formation, compact }: FormationCpfInfoProps) {
  if (!formation.cpfEligible) return null;

  return (
    <div
      className={
        compact
          ? "inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-50/90 px-3 py-1.5"
          : "refined-card border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-white p-5 md:p-6"
      }
    >
      <div className="min-w-0">
        {!compact && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Financement
          </p>
        )}
        <p
          className={
            compact
              ? "text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700"
              : "mt-1 text-base font-semibold text-navy-950"
          }
        >
          Financement possible
        </p>
        {!compact && (
          <>
            <p className="mt-2 text-sm leading-relaxed text-body-strong">
              {formation.cpfNote ??
                "Cette formation peut être financée selon votre situation, sous réserve des conditions en vigueur."}
            </p>
            {formation.certificationCode && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <FormationCertificationBadge code={formation.certificationCode} />
                <span className="text-xs text-lead-strong">
                  {getCertificationCodeLabel(formation.certificationCode)}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
