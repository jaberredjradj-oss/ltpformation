import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanningView } from "@/components/planning/PlanningView";
import { Container } from "@/components/ui/Container";
import { loadPlanningSessions } from "@/lib/repositories/planning";

export const metadata: Metadata = {
  title: "Planning des sessions",
  description:
    "Calendrier 2026 des sessions LT Protect Formation : SSIAP, TFP APS, MAC APS et parcours certifiants à Voisins-le-Bretonneux.",
};

function PlanningFallback() {
  return (
    <section className="section-wash-surface py-20">
      <Container>
        <div className="refined-card mx-auto max-w-xl px-6 py-10 text-center">
          <p className="text-sm font-medium text-lead-strong">
            Chargement du planning…
          </p>
        </div>
      </Container>
    </section>
  );
}

export default async function PlanningPage() {
  const sessions = await loadPlanningSessions();

  return (
    <Suspense fallback={<PlanningFallback />}>
      <PlanningView initialSessions={sessions} />
    </Suspense>
  );
}
