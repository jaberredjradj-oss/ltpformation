import type { Formation } from "@/lib/formations/types";

interface FormationPdfCardProps {
  formation: Formation;
}

export function FormationPdfCard({ formation }: FormationPdfCardProps) {
  if (!formation.pdfAvailable) {
    return (
      <div className="refined-card border-dashed px-5 py-5 md:px-6">
        <p className="text-sm font-semibold text-navy-950">Programme PDF</p>
        <p className="mt-2 text-sm text-lead-strong">
          Le document officiel sera disponible prochainement.
        </p>
      </div>
    );
  }

  return (
    <div className="refined-card card-accent-glow overflow-hidden">
      <div className="gradient-bar-animated" />
      <div className="p-5 md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
          Document officiel
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-[-0.018em] text-navy-950">
          Programme certifié
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-body-strong">
          Téléchargez le programme officiel LT Protect Formation pour consulter l&apos;intégralité
          des informations réglementaires et pédagogiques.
        </p>
        <a
          href={formation.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-400/35 bg-gradient-to-r from-gold-100/80 to-blue-50 px-5 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:border-blue-300/60 hover:shadow-[0_8px_24px_rgba(43,127,212,0.12)]"
        >
          Télécharger le programme PDF
          <span aria-hidden>↓</span>
        </a>
      </div>
    </div>
  );
}
