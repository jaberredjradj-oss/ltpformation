import type { PlanningMonthGroup } from "@/lib/planning/types";
import { PlanningSessionCard } from "@/components/planning/PlanningSessionCard";

interface PlanningMonthSectionProps {
  group: PlanningMonthGroup;
}

export function PlanningMonthSection({ group }: PlanningMonthSectionProps) {
  return (
    <section id={`planning-${group.key}`} className="scroll-mt-28">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Période
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-navy-950 md:text-2xl">
            {group.label}
          </h2>
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums text-lead-strong">
          {group.sessions.length} session{group.sessions.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {group.sessions.map((session, index) => (
          <PlanningSessionCard key={session.id} session={session} index={index} />
        ))}
      </div>
    </section>
  );
}
