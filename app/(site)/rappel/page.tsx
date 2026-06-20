import type { Metadata } from "next";
import { CallbackForm } from "@/components/callback/CallbackForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Demande de rappel",
  description:
    "Demandez un rappel gratuit : LT Protect Formation vous recontacte rapidement pour vos projets de formation en sécurité, SSIAP, secourisme et CQP APS à Voisins-le-Bretonneux (78).",
  robots: { index: false, follow: true },
};

export default function RappelPage() {
  return (
    <>
      <section className="relative overflow-hidden section-wash-blend pb-8 pt-10 md:pb-14 md:pt-20 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 animated-mesh opacity-40" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center heading-accent-glow">
            <p className="section-eyebrow">Rappel gratuit</p>
            <h1 className="mt-4 text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem] lg:text-[3rem]">
              Je souhaite être rappelé
            </h1>
            <p className="editorial-lead mx-auto mt-5 max-w-2xl text-pretty">
              Centre de formation agréé à Voisins-le-Bretonneux — SSIAP, CQP APS, SST,
              habilitations électriques. Laissez vos coordonnées, nous vous rappelons
              rapidement.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-wash-surface pb-12 md:pb-20">
        <Container>
          <div className="mx-auto max-w-xl">
            <CallbackForm source="rappel" showIntro={false} />
          </div>
        </Container>
      </section>
    </>
  );
}
