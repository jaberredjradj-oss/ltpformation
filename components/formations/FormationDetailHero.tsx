"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Formation } from "@/lib/formations/types";
import { getFormationCoverImage } from "@/lib/formation-cover-images";
import { easeCinematic } from "@/lib/motion";
import { FormationCTA } from "@/components/formations/FormationCTA";
import { InstallmentBadge } from "@/components/formations/InstallmentBadge";
import {
  formatFormationDurationHours,
  formatFormationPriceEuro,
} from "@/lib/formations/display";
import { hasInstallmentFacility } from "@/lib/formations/payment";
import { Container } from "@/components/ui/Container";

interface FormationDetailHeroProps {
  formation: Formation;
}

export function FormationDetailHero({ formation }: FormationDetailHeroProps) {
  const durationHours = formatFormationDurationHours(formation.durationHours);
  const priceLabel = formatFormationPriceEuro(formation);

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
            className="heading-accent-glow flex flex-col"
          >
            <h1 className="text-[1.8rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.35rem] lg:text-[2.75rem]">
              {formation.shortTitle ?? formation.title}
            </h1>

            <p className="mt-4 text-lg font-semibold tabular-nums text-blue-600">{durationHours}</p>

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-blue-600/90">
              {formation.categoryLabel}
            </p>

            <p className="editorial-lead mt-5 max-w-2xl text-pretty">{formation.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="shrink-0 text-xl font-semibold tabular-nums text-navy-950">
                {priceLabel}
              </p>
              {hasInstallmentFacility(formation.slug) && (
                <InstallmentBadge className="shrink-0" />
              )}
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
            className="refined-card flex flex-col overflow-hidden"
          >
            <div className="relative min-h-[220px] flex-1 sm:min-h-[280px]">
              <Image
                src={getFormationCoverImage(formation)}
                alt={formation.shortTitle ?? formation.title}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
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
