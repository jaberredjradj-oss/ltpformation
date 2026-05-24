import type { SessionAvailability } from "@/lib/planning/availability";
import { cn } from "@/lib/utils";

interface SessionAvailabilityMeterProps {
  availability: SessionAvailability;
  className?: string;
}

export function SessionAvailabilityMeter({
  availability,
  className,
}: SessionAvailabilityMeterProps) {
  if (!availability.showMeter || availability.fillRatio === null) {
    return null;
  }

  const percent = Math.round(availability.fillRatio * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-body-strong">Occupation</span>
        <span className="tabular-nums font-semibold text-navy-950">
          {availability.seatsTaken}/{availability.seatsTotal}
          {availability.seatsRemaining !== null && (
            <span className="ml-1 font-medium text-lead-strong">
              · {availability.seatsRemaining} place
              {availability.seatsRemaining > 1 ? "s" : ""} restante
              {availability.seatsRemaining > 1 ? "s" : ""}
            </span>
          )}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Occupation de la session : ${percent} pour cent`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            availability.status === "full" && "bg-slate-400",
            availability.status === "limited" && "bg-amber-400",
            (availability.status === "available" || availability.status === "unknown") &&
              "bg-emerald-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
