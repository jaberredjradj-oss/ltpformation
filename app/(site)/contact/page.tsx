import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden section-wash-blend pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 animated-mesh opacity-40" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center heading-accent-glow">
            <p className="section-eyebrow">Nous contacter</p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem] lg:text-[3rem]">
              Contact
            </h1>
            <p className="editorial-lead mx-auto mt-5 max-w-2xl text-pretty">
              Une question sur nos formations, le planning ou les modalités
              d&apos;inscription ? Notre équipe vous répond rapidement.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-wash-surface pb-16 md:pb-20">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="refined-card space-y-5 p-6 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Coordonnées
              </p>
              <div className="space-y-4 text-sm text-body-strong">
                <p>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Téléphone
                  </span>
                  <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="mt-1 inline-block font-semibold text-navy-950 hover:text-blue-600">
                    {SITE.phone}
                  </a>
                </p>
                <p>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Mobile
                  </span>
                  <a href={`tel:${SITE.mobile.replace(/\s/g, "")}`} className="mt-1 inline-block font-semibold text-navy-950 hover:text-blue-600">
                    {SITE.mobile}
                  </a>
                </p>
                <p>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Email
                  </span>
                  <a href={`mailto:${SITE.email}`} className="mt-1 inline-block font-semibold text-navy-950 hover:text-blue-600">
                    {SITE.email}
                  </a>
                </p>
                <p>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Adresse
                  </span>
                  <span className="mt-1 block leading-relaxed">{SITE.address.full}</span>
                </p>
                <p>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Horaires
                  </span>
                  <span className="mt-1 block">{SITE.hours}</span>
                </p>
              </div>
            </div>

            <div className="refined-card space-y-5 p-6 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Inscription en ligne
              </p>
              <p className="text-sm leading-relaxed text-body-strong">
                Pour réserver une place ou obtenir un devis personnalisé, utilisez nos
                formulaires dédiés :
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/preinscription"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)]"
                >
                  Pré-inscription
                </Link>
                <Link
                  href="/devis"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200/90 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:border-blue-300/70 hover:text-blue-600"
                >
                  Demander un devis
                </Link>
                <Link
                  href="/planning"
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Consulter le planning →
                </Link>
              </div>
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>
    </>
  );
}
