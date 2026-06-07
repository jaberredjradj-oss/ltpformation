import Image from "next/image";
import { Card } from "@/components/ui/Card";

interface CertificationCardProps {
  name: string;
  shortName: string;
  description: string;
  image: string;
  points: readonly string[];
  certificatePdf?: string;
  delay?: number;
}

export function CertificationCard({
  name,
  shortName,
  description,
  image,
  points,
  certificatePdf,
  delay = 0,
}: CertificationCardProps) {
  return (
    <Card delay={delay} className="flex h-full flex-col overflow-hidden p-0">
      <div className="gradient-bar-animated" />
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="cert-seal-frame relative px-5 py-7">
          <div className="pointer-events-none absolute inset-2.5 rounded-lg border border-dashed border-blue-200/50" />
          <div className="flex min-h-[72px] items-center justify-center">
            {certificatePdf ? (
              <a
                href={certificatePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md transition-opacity duration-300 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                aria-label={`Voir le certificat ${name} (PDF)`}
                title={`Certificat ${name} (PDF)`}
              >
                <Image
                  src={image}
                  alt={name}
                  width={240}
                  height={96}
                  className="max-h-[72px] w-auto object-contain"
                />
              </a>
            ) : (
              <Image
                src={image}
                alt={name}
                width={240}
                height={96}
                className="max-h-[72px] w-auto object-contain"
              />
            )}
          </div>
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {shortName}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.01em] text-navy-950">
          {name}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-body-strong">
          {description}
        </p>

        <ul className="mt-5 space-y-2 border-t border-slate-200/80 pt-5">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm font-medium text-navy-800">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-600">
                ✓
              </span>
              {point}
            </li>
          ))}
        </ul>

        {certificatePdf && (
          <a
            href={certificatePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition-all duration-300 hover:border-blue-300/70 hover:text-blue-600"
          >
            Voir le certificat officiel
            <span aria-hidden className="text-xs opacity-70">
              PDF ↗
            </span>
          </a>
        )}
      </div>
    </Card>
  );
}
