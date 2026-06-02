"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Formation } from "@/lib/formations/types";
import { getFormationCoverImage } from "@/lib/formation-cover-images";
import { easeCinematic } from "@/lib/motion";
import { FormationBadges } from "@/components/formations/FormationBadges";
import { FormationCTA } from "@/components/formations/FormationCTA";
import { FormationMetaValue } from "@/components/formations/FormationMetaValue";
import { Container } from "@/components/ui/Container";

interface FormationDetailHeroProps {
  formation: Formation;
}

export function FormationDetailHero({ formation }: FormationDetailHeroProps) {
  return (
    <section className="relative overflow-hidden section-wash-blend pb-8 pt-10 md:pb-14 md:pt-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeCinematic }}
        >
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            ← Retour au catalogue
          </Link>
        </motion.div>

        <div className="mt-6 grid gap-6 md:mt-8 md:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.06, ease: easeCinematic }}
            className="heading-accent-glow"
          >
            <p className="section-eyebrow">{formation.categoryLabel}</p>
            <h1 className="mt-4 text-[1.8rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.35rem] lg:text-[2.75rem]">
              {formation.title}
            </h1>
            <div className="mt-5">
              <FormationBadges formation={formation} />
            </div>
            <p className="editorial-lead mt-6 max-w-2xl text-pretty">{formation.summary}</p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:max-w-xl sm:grid-cols-2">
              <div className="refined-card min-w-0 px-4 py-4">
                <FormationMetaValue
                  label="Durée"
                  value={formation.durationLabel}
                  valueClassName="text-base sm:text-lg"
                />
              </div>
              <div className="refined-card min-w-0 px-4 py-4">
                <FormationMetaValue
                  label="Tarif"
                  value={formation.price.label}
                  valueClassName="text-base sm:text-lg"
                />
              </div>
            </div>

            {formation.contentStatus === "stub" && (
              <p className="mt-5 rounded-xl border border-dashed border-slate-200/90 bg-white/70 px-4 py-3 text-sm text-lead-strong">
                Les informations détaillées seront publiées à partir du programme officiel PDF.
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.12, ease: easeCinematic }}
            className="refined-card overflow-hidden"
          >
            <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${getFormationCoverImage(formation)})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,21,37,0.55)_0%,transparent_55%)]" />
            </div>
            <div className="border-t border-slate-100 p-5 md:p-6">
              <FormationCTA formation={formation} layout="stack" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
