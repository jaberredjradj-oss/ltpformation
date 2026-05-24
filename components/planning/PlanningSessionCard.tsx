"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { isSessionCpfEligible } from "@/lib/planning/cpf";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import { formatExamLabel, formatSessionDateRange } from "@/lib/planning/format";
import type { PlanningSession } from "@/lib/planning/types";
import { easeCinematic } from "@/lib/motion";
import { FormationCertificationBadge } from "@/components/formations/FormationCertificationBadge";
import { PlanningStatusBadge } from "@/components/planning/PlanningStatusBadge";
import { SessionAvailabilityMeter } from "@/components/planning/SessionAvailabilityMeter";
import { cn } from "@/lib/utils";

interface PlanningSessionCardProps {
  session: PlanningSession;
  index?: number;
}

function SessionAction({
  href,
  children,
  variant = "primary",
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)]",
    secondary:
      "border border-slate-200/90 bg-white text-navy-950 hover:border-blue-300/70 hover:text-blue-600",
    ghost: "text-blue-600 hover:text-blue-700",
  };

  const className = cn(
    "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-semibold tracking-[-0.01em] transition-all duration-300 whitespace-normal text-center leading-snug",
    styles[variant],
    disabled && "pointer-events-none cursor-not-allowed opacity-50",
  );

  if (disabled) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function PlanningSessionCard({ session, index = 0 }: PlanningSessionCardProps) {
  const formationHref = session.formationSlug
    ? `/formations/${session.formationSlug}`
    : "/formations";
  const preinscriptionHref = session.formationSlug
    ? `/preinscription?formation=${session.formationSlug}&session=${session.id}`
    : `/preinscription?session=${session.id}`;
  const devisHref = session.formationSlug
    ? `/devis?formation=${session.formationSlug}&session=${session.id}`
    : `/devis?session=${session.id}`;
  const cpfEligible = isSessionCpfEligible(session);
  const availability = resolveSessionAvailability(session);
  const registrationClosed = !availability.canRegister;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay: index * 0.04, ease: easeCinematic }}
      className="refined-card card-accent-glow min-w-0 overflow-hidden"
    >
      <div className="gradient-bar-animated" />
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="max-w-full whitespace-normal rounded-full border border-blue-200/70 bg-blue-50/80 px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-blue-700">
            {session.categoryLabel}
          </span>
          <span className="max-w-full whitespace-normal rounded-full border border-gold-400/30 bg-gold-100/60 px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-gold-700">
            {session.sessionType}
          </span>
          {cpfEligible && (
            <span className="max-w-full whitespace-normal rounded-full border border-emerald-300/60 bg-emerald-50/95 px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-emerald-800">
              Éligible CPF
            </span>
          )}
          {session.certificationCode && (
            <FormationCertificationBadge code={session.certificationCode} />
          )}
          <PlanningStatusBadge session={session} />
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-[-0.018em] text-navy-950">
          {session.formationTitle}
        </h3>

        {availability.showMeter && (
          <div className="mt-4">
            <SessionAvailabilityMeter availability={availability} />
          </div>
        )}

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              Dates
            </dt>
            <dd className="mt-1 break-words text-pretty text-sm font-semibold text-navy-950">
              {formatSessionDateRange(session.startDate, session.endDate)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              Horaires
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-body-strong">
              {session.scheduleLabel}
            </dd>
          </div>
          {session.examDate && (
            <div className="min-w-0 sm:col-span-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Examen
              </dt>
              <dd className="mt-1 text-sm font-semibold text-body-strong">
                {formatExamLabel(session.examDate)}
              </dd>
            </div>
          )}
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              Lieu
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-body-strong">
              {session.location}
            </dd>
          </div>
        </dl>

        {session.notes.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
            {session.notes.map((note) => (
              <li key={note} className="flex items-start gap-2 text-sm text-body-strong">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {note}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-col gap-2.5 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap">
          <SessionAction href={formationHref}>Voir la formation</SessionAction>
          <SessionAction
            href={preinscriptionHref}
            variant="secondary"
            disabled={registrationClosed}
          >
            Pré-inscription
          </SessionAction>
          <SessionAction href={devisHref} variant="ghost" disabled={registrationClosed}>
            Demander un devis
          </SessionAction>
        </div>
        {registrationClosed && (
          <p className="mt-3 text-xs font-medium text-lead-strong">
            Cette session est complète. Contactez-nous pour une autre date.
          </p>
        )}
      </div>
    </motion.article>
  );
}
