import type { Metadata } from "next";
import { Suspense } from "react";
import { RegistrationView } from "@/components/registration/RegistrationView";
import { Container } from "@/components/ui/Container";
import { loadPlanningSessions } from "@/lib/repositories/planning";

export const metadata: Metadata = {
  title: "Demande de devis",
  description:
    "Demandez un devis personnalisé pour vos formations LT Protect : SSIAP, SST, APS et habilitations.",
};

function DevisFallback() {
  return (
    <section className="section-wash-surface py-20">
      <Container>
        <div className="refined-card mx-auto max-w-xl px-6 py-10 text-center">
          <p className="text-sm font-medium text-lead-strong">Chargement du formulaire…</p>
        </div>
      </Container>
    </section>
  );
}

export default async function DevisPage() {
  const sessions = await loadPlanningSessions();

  return (
    <Suspense fallback={<DevisFallback />}>
      <RegistrationView intent="devis" sessions={sessions} />
    </Suspense>
  );
}
