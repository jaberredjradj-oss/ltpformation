import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles — LT Protect Formation.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section className="relative overflow-hidden section-wash-blend pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 animated-mesh opacity-40" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl heading-accent-glow">
            <p className="section-eyebrow">Protection des données</p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem]">
              Politique de confidentialité
            </h1>
            <p className="editorial-lead mt-5 text-pretty">
              {SITE.name} s&apos;engage à protéger vos données personnelles conformément au
              Règlement Général sur la Protection des Données (RGPD).
            </p>
          </div>
        </Container>
      </section>

      <section className="section-wash-surface pb-16 md:pb-20">
        <Container>
          <div className="prose-policy mx-auto max-w-3xl space-y-8">
            <article className="refined-card space-y-4 p-6 md:p-8">
              <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">
                Responsable du traitement
              </h2>
              <p className="text-sm leading-relaxed text-body-strong">
                {SITE.name} — {SITE.address.full}. Contact :{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-blue-600 hover:text-blue-700">
                  {SITE.email}
                </a>
                .
              </p>
            </article>

            <article className="refined-card space-y-4 p-6 md:p-8">
              <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">
                Données collectées
              </h2>
              <p className="text-sm leading-relaxed text-body-strong">
                Lors d&apos;une demande de devis ou d&apos;une pré-inscription, nous collectons
                les informations que vous nous communiquez : identité, coordonnées, formation
                et session souhaitées, nombre de participants et message libre.
              </p>
            </article>

            <article className="refined-card space-y-4 p-6 md:p-8">
              <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">
                Finalités et base légale
              </h2>
              <p className="text-sm leading-relaxed text-body-strong">
                Vos données sont traitées pour répondre à votre demande, organiser votre
                inscription et assurer le suivi administratif de votre parcours de formation.
                La base légale est l&apos;exécution de mesures précontractuelles et notre
                intérêt légitime à gérer les relations avec nos clients.
              </p>
            </article>

            <article className="refined-card space-y-4 p-6 md:p-8">
              <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">
                Durée de conservation
              </h2>
              <p className="text-sm leading-relaxed text-body-strong">
                Les données liées à une demande sont conservées le temps nécessaire au
                traitement de celle-ci, puis archivées conformément aux obligations légales
                applicables aux organismes de formation.
              </p>
            </article>

            <article className="refined-card space-y-4 p-6 md:p-8">
              <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">
                Vos droits
              </h2>
              <p className="text-sm leading-relaxed text-body-strong">
                Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
                de limitation, d&apos;opposition et de portabilité de vos données. Pour
                exercer ces droits, contactez-nous à{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-blue-600 hover:text-blue-700">
                  {SITE.email}
                </a>
                . Vous pouvez également introduire une réclamation auprès de la CNIL.
              </p>
            </article>

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
