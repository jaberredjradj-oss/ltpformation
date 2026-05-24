import type { Metadata } from "next";
import { Suspense } from "react";
import { RegistrationView } from "@/components/registration/RegistrationView";
import { Container } from "@/components/ui/Container";
import { loadPlanningSessions } from "@/lib/repositories/planning";

export const metadata: Metadata = {
  title: "Pré-inscription",
  description:
    "Réservez votre place sur une session LT Protect Formation : planning 2026, disponibilité en temps réel.",
};

function PreinscriptionFallback() {
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

export default async function PreinscriptionPage() {
  const sessions = await loadPlanningSessions();

  return (
    <Suspense fallback={<PreinscriptionFallback />}>
      <RegistrationView intent="preinscription" sessions={sessions} />
    </Suspense>
  );
}
