import Link from "next/link";
import type { Formation } from "@/lib/formations/types";
import { cn } from "@/lib/utils";

interface FormationCTAProps {
  formation: Formation;
  layout?: "inline" | "stack";
  className?: string;
}

export function FormationCTA({ formation, layout = "inline", className }: FormationCTAProps) {
  const preinscriptionHref = `/preinscription?formation=${formation.slug}`;

  return (
    <div
      className={cn(
        layout === "stack" ? "flex min-w-0 flex-col gap-2.5" : "flex min-w-0 flex-wrap gap-2.5",
        className,
      )}
    >
      <Link
        href={preinscriptionHref}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 px-5 py-3 text-sm font-semibold text-navy-950 shadow-[0_4px_18px_rgba(201,162,39,0.28)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(201,162,39,0.34)] whitespace-normal text-center leading-snug sm:w-auto"
      >
        Pré-inscription
      </Link>
      {formation.pdfAvailable ? (
        <a
          href={formation.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gold-400/35 bg-gold-100/50 px-5 py-3 text-sm font-semibold text-gold-700 transition-all duration-300 hover:bg-gold-100 whitespace-normal text-center leading-snug sm:w-auto"
        >
          Télécharger le programme PDF
        </a>
      ) : (
        <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-dashed border-slate-200/90 bg-surface/70 px-5 py-3 text-center text-sm font-medium leading-snug text-lead-strong sm:w-auto">
          PDF officiel bientôt disponible
        </span>
      )}
    </div>
  );
}
