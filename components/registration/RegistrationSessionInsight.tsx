"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PlanningSession } from "@/lib/planning/types";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import { easeCinematic } from "@/lib/motion";
import { SessionAvailabilityBadge } from "@/components/planning/SessionAvailabilityBadge";
import { SessionAvailabilityMeter } from "@/components/planning/SessionAvailabilityMeter";

interface RegistrationSessionInsightProps {
  session: PlanningSession | null;
}

export function RegistrationSessionInsight({
  session,
}: RegistrationSessionInsightProps) {
  const availability = session ? resolveSessionAvailability(session) : null;

  return (
    <AnimatePresence mode="wait">
      {session && availability && (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: easeCinematic }}
          className="rounded-xl border border-slate-100/90 bg-surface/50 px-4 py-3.5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <SessionAvailabilityBadge
              label={availability.label}
              status={availability.status}
            />
          </div>

          {availability.seatsRemaining !== null && availability.seatsTotal !== null ? (
            <p className="mt-3 text-sm text-body-strong">
              <span className="font-semibold text-navy-950">
                {availability.seatsRemaining} place
                {availability.seatsRemaining > 1 ? "s" : ""} restante
                {availability.seatsRemaining > 1 ? "s" : ""}
              </span>
              <span className="text-lead-strong"> sur {availability.seatsTotal}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-body-strong">
              Places disponibles — confirmation sous 24 h ouvrées.
            </p>
          )}

          {availability.showMeter && (
            <div className="mt-3">
              <SessionAvailabilityMeter availability={availability} />
            </div>
          )}

          {availability.status === "limited" && (
            <p className="mt-3 text-xs leading-relaxed text-amber-800">
              Dernières places — nous vous recommandons de confirmer rapidement.
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
