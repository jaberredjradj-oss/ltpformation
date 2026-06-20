import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Merci pour votre demande",
  description:
    "Votre demande de rappel a bien été envoyée. L'équipe LT Protect Formation vous recontacte rapidement.",
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  return (
    <section className="section-wash-surface py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="refined-card px-6 py-10 md:px-10 md:py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Demande enregistrée
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-navy-950 sm:text-3xl">
              Merci, votre demande a bien été envoyée
            </h1>
            <p className="editorial-lead mx-auto mt-4 max-w-md text-pretty">
              Notre équipe va vous rappeler rapidement.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/" variant="primary" className="w-full sm:w-auto">
                Retour à l&apos;accueil
              </Button>
              <Link
                href="/formations"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-slate-200/90 bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-all duration-300 hover:border-blue-300/70 hover:text-blue-600 sm:w-auto"
              >
                Voir nos formations
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
