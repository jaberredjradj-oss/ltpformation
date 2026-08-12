import type { Metadata } from "next";
import { Suspense } from "react";
import { FormationsHero } from "@/components/formations/FormationsHero";
import { FormationsCatalog } from "@/components/formations/FormationsCatalog";
import { loadFormations } from "@/lib/repositories/formations";

export const metadata: Metadata = {
  title: {
    absolute:
      "Formations Sécurité Incendie, SSIAP & Secourisme en Île-de-France | LT Protect Formation",
  },
  description:
    "Découvrez toutes les formations de LT Protect Formation à Voisins-le-Bretonneux (78) : SSIAP 1, 2, 3, CQP APS, SST, H0B0. Certifié Qualiopi, éligible CPF. Sessions régulières en Île-de-France.",
};

// Revalidate every 5 minutes; admin mutations will also revalidate on-demand.
export const revalidate = 300;

export default async function FormationsPage() {
  const formations = await loadFormations();

  return (
    <>
      <FormationsHero formations={formations} />
      <Suspense
        fallback={
          <div className="section-wash-surface pb-16 pt-8 md:pb-24 md:pt-10">
            <div className="mx-auto h-40 max-w-6xl animate-pulse rounded-2xl bg-white/70 px-4" />
          </div>
        }
      >
        <FormationsCatalog formations={formations} />
      </Suspense>
    </>
  );
}
