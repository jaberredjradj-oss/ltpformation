import type { PlanningSession } from "@/lib/planning/types";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import { SessionAvailabilityBadge } from "@/components/planning/SessionAvailabilityBadge";

interface PlanningStatusBadgeProps {
  session: PlanningSession;
  className?: string;
}

/** @deprecated Use SessionAvailabilityBadge with resolveSessionAvailability directly. */
export function PlanningStatusBadge({ session, className }: PlanningStatusBadgeProps) {
  const availability = resolveSessionAvailability(session);

  return (
    <SessionAvailabilityBadge
      label={availability.label}
      status={availability.status}
      className={className}
    />
  );
}
