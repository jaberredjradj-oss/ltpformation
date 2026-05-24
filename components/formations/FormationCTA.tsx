import Link from "next/link";
import type { Formation } from "@/lib/formations/types";
import { cn } from "@/lib/utils";

interface FormationCTAProps {
  formation: Formation;
  layout?: "inline" | "stack";
  className?: string;
}

export function FormationCTA({ formation, layout = "inline", className }: FormationCTAProps) {
  const devisHref = `/devis?formation=${formation.slug}`;
  const preinscriptionHref = `/preinscription?formation=${formation.slug}`;

  return (
    <div
      className={cn(
        layout === "stack" ? "flex min-w-0 flex-col gap-2.5" : "flex min-w-0 flex-wrap gap-2.5",
        className,
      )}
    >
      <Link
        href={devisHref}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)] whitespace-normal text-center leading-snug"
      >
        Demander un devis
      </Link>
      <Link
        href={preinscriptionHref}
        className="inline-flex items-center justify-center rounded-full border border-slate-200/90 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:border-blue-300/70 hover:text-blue-600 whitespace-normal text-center leading-snug"
      >
        Prendre rendez-vous
      </Link>
      {formation.pdfAvailable ? (
        <a
          href={formation.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-gold-400/35 bg-gold-100/50 px-5 py-3 text-sm font-semibold text-gold-700 transition-all duration-300 hover:bg-gold-100 whitespace-normal text-center leading-snug"
        >
          Télécharger le programme PDF
        </a>
      ) : (
        <span className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-200/90 bg-surface/70 px-5 py-3 text-sm font-medium text-lead-strong">
          PDF officiel bientôt disponible
        </span>
      )}
    </div>
  );
}
