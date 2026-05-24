import Link from "next/link";
import { LegalDocumentContent } from "@/components/legal/LegalDocumentContent";
import { Container } from "@/components/ui/Container";
import type { LegalDocumentDefinition } from "@/lib/legal/types";

interface LegalDocumentPageProps {
  document: LegalDocumentDefinition;
}

function DownloadIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
      />
    </svg>
  );
}

export function LegalDocumentPage({ document }: LegalDocumentPageProps) {
  const pdfHref = `/documents/${document.pdfFilename}`;

  return (
    <>
      <section className="relative overflow-hidden section-wash-blend pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 animated-mesh opacity-40" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl heading-accent-glow">
            <p className="section-eyebrow">{document.heroEyebrow}</p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem]">
              {document.title}
            </h1>
          </div>
        </Container>
      </section>

      <section className="section-wash-surface pb-16 md:pb-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="refined-card flex flex-col items-center px-6 py-8 text-center md:px-8">
              <p className="text-sm font-medium text-body-strong">{document.pdfDownloadLabel}</p>
              <a
                href={pdfHref}
                download={document.pdfFilename}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(7,21,37,0.25)] transition-all duration-300 hover:bg-navy-900 hover:shadow-[0_8px_24px_rgba(7,21,37,0.28)]"
              >
                <DownloadIcon />
                Format PDF
              </a>
            </div>

            <LegalDocumentContent sections={document.sections} />

            <p className="text-center text-xs text-lead-strong">
              <Link href="/contact" className="font-semibold text-blue-600 hover:text-blue-700">
                Nous contacter
              </Link>
              {" · "}
              <Link href="/" className="font-semibold text-blue-600 hover:text-blue-700">
                Retour à l&apos;accueil
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
