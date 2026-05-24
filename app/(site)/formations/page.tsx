import type { Metadata } from "next";
import { Suspense } from "react";
import { FormationsHero } from "@/components/formations/FormationsHero";
import { FormationsCatalog } from "@/components/formations/FormationsCatalog";

export const metadata: Metadata = {
  title: "Formations professionnelles",
  description:
    "Catalogue certifié LT Protect Formation — SSIAP, SST, APS, habilitations électriques et formations incendie.",
};

export default async function FormationsPage() {
  return (
    <>
      <FormationsHero />
      <Suspense
        fallback={
          <div className="section-wash-surface pb-16 pt-8 md:pb-24 md:pt-10">
            <div className="mx-auto h-40 max-w-6xl animate-pulse rounded-2xl bg-white/70 px-4" />
          </div>
        }
      >
        <FormationsCatalog />
      </Suspense>
    </>
  );
}
