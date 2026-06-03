import Link from "next/link";
import type { RegistrationContext } from "@/lib/registration/resolve-context";
import { formatExamLabel, formatSessionDateRange } from "@/lib/planning/format";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import { FormationCertificationBadge } from "@/components/formations/FormationCertificationBadge";
import { SessionAvailabilityBadge } from "@/components/planning/SessionAvailabilityBadge";
import { SessionAvailabilityMeter } from "@/components/planning/SessionAvailabilityMeter";

interface RegistrationContextCardProps {
  context: RegistrationContext;
}

export function RegistrationContextCard({ context }: RegistrationContextCardProps) {
  const { formation, session } = context;
  const availability = session ? resolveSessionAvailability(session) : context.availability;

  return (
    <div className="refined-card min-w-0 space-y-5 p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
        Votre sélection
      </p>

      {formation ? (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">
            {formation.shortTitle}
          </h2>
          <p className="text-sm leading-relaxed text-body-strong">{formation.title}</p>
          <Link
            href={`/formations/${formation.slug}`}
            className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Voir le programme →
          </Link>
        </div>
      ) : (
        <p className="text-sm text-body-strong">
          Sélectionnez une formation pour afficher le contexte de session.
        </p>
      )}

      {session && (
        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-gold-400/30 bg-gold-100/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-700">
              {session.sessionType}
            </span>
            {session.certificationCode && (
              <FormationCertificationBadge code={session.certificationCode} />
            )}
            {availability && (
              <SessionAvailabilityBadge
                label={availability.label}
                status={availability.status}
              />
            )}
          </div>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Dates
              </dt>
              <dd className="mt-1 font-semibold text-navy-950">
                {formatSessionDateRange(session.startDate, session.endDate)}
              </dd>
            </div>
            {availability && (
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Disponibilité
                </dt>
                <dd className="mt-1 font-semibold text-body-strong">
                  {availability.seatsRemaining !== null && availability.seatsTotal !== null ? (
                    <>
                      {availability.seatsRemaining} place
                      {availability.seatsRemaining > 1 ? "s" : ""} restante
                      {availability.seatsRemaining > 1 ? "s" : ""} sur {availability.seatsTotal}
                    </>
                  ) : (
                    availability.label
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Horaires
              </dt>
              <dd className="mt-1 font-semibold tabular-nums text-body-strong">
                {session.scheduleLabel}
              </dd>
            </div>
            {session.examDate && (
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Examen
                </dt>
                <dd className="mt-1 font-semibold text-body-strong">
                  {formatExamLabel(session.examDate)}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Lieu
              </dt>
              <dd className="mt-1 leading-relaxed text-body-strong">{session.location}</dd>
            </div>
          </dl>

          {availability?.showMeter && <SessionAvailabilityMeter availability={availability} />}

          {availability?.status === "limited" && (
            <p className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
              Dernières places disponibles — nous vous recommandons de confirmer rapidement.
            </p>
          )}

          {availability && !availability.canRegister && (
            <p className="rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-3 text-sm text-body-strong">
              Cette session est complète. Choisissez une autre date dans le formulaire ou
              consultez le{" "}
              <Link href="/planning" className="font-semibold text-blue-600">
                planning
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}
