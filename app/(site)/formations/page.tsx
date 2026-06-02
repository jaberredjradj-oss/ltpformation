import type { Metadata } from "next";
import { Suspense } from "react";
import { FormationsHero } from "@/components/formations/FormationsHero";
import { FormationsCatalog } from "@/components/formations/FormationsCatalog";
import { loadFormations } from "@/lib/repositories/formations";

export const metadata: Metadata = {
  title: "Formations professionnelles",
  description:
    "Catalogue certifié LT Protect Formation — SSIAP, SST, APS, habilitations électriques et formations incendie.",
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
