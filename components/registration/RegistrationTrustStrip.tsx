import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  {
    title: "Réponse sous 24h",
    description: "Prise en charge rapide de votre demande.",
  },
  {
    title: "Processus qualité",
    description: "Parcours structuré et suivi administratif rigoureux.",
  },
  {
    title: "Données confidentielles",
    description: "Traitement sécurisé et conforme RGPD.",
  },
  {
    title: "Accompagnement personnalisé",
    description: "Un interlocuteur dédié à votre projet.",
  },
] as const;

interface RegistrationTrustStripProps {
  className?: string;
  compact?: boolean;
}

export function RegistrationTrustStrip({
  className,
  compact = false,
}: RegistrationTrustStripProps) {
  return (
    <div
      className={cn(
        "grid gap-2.5",
        compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
        className,
      )}
    >
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-100/90 bg-white/60 px-3.5 py-3 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold tracking-[-0.01em] text-navy-950">
            {item.title}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-lead-strong">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
