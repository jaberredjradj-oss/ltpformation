import type { FormationProgramme } from "@/lib/formations/types";
import { FormationDetailSection } from "@/components/formations/FormationDetailSection";

interface FormationProgrammeProps {
  id?: string;
  programme: FormationProgramme;
  pending?: boolean;
  title?: string;
  className?: string;
}

export function FormationProgramme({
  id,
  programme,
  pending,
  title = "Contenu de la formation",
  className,
}: FormationProgrammeProps) {
  const hasModules = programme.modules.length > 0;

  return (
    <FormationDetailSection id={id} title={title} pending={pending && !hasModules} className={className}>
      {hasModules && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {programme.modules.map((module) => (
              <div
                key={module.title}
                className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-blue-50/20 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-snug text-navy-950">{module.title}</h4>
                  {module.hours !== undefined && (
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold tabular-nums text-blue-700 shadow-[var(--shadow-soft)]">
                      {module.hours}h
                    </span>
                  )}
                </div>
                {module.content.length > 0 && (
                  <ul className="mt-3 flex-1 space-y-2">
                    {module.content.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-body-strong">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </FormationDetailSection>
  );
}
