"use client";

import { motion } from "framer-motion";
import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type { Formation } from "@/lib/formations/types";
import { easeCinematic } from "@/lib/motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Container } from "@/components/ui/Container";

interface FormationsHeroProps {
  formations: Formation[];
}

export function FormationsHero({ formations }: FormationsHeroProps) {
  return (
    <section className="relative overflow-hidden section-wash-blend pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 animated-mesh opacity-40" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: easeCinematic }}
          className="mx-auto max-w-3xl text-center heading-accent-glow"
        >
          <p className="section-eyebrow">Catalogue certifié</p>
          <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem] lg:text-[3rem]">
            Plateforme de formations professionnelles
          </h1>
          <p className="editorial-lead mx-auto mt-5 max-w-2xl text-pretty">
            Parcourez l&apos;ensemble de nos parcours certifiants — sécurité incendie, secourisme,
            sûreté et habilitations électriques — dans un environnement institutionnel conçu pour
            faciliter votre recherche et votre prise de décision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: easeCinematic }}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {FORMATION_CATEGORIES.map((category) => {
            const count = formations.filter((f) => f.category === category.id).length;
            return (
              <div
                key={category.id}
                className="refined-card px-4 py-4 text-center md:px-5 md:py-5"
              >
                <p className="text-[clamp(1.35rem,3vw,1.75rem)] font-bold tabular-nums tracking-tight text-navy-950">
                  <AnimatedNumber value={count} />
                </p>
                <p className="mt-1 text-pretty text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] text-blue-600">
                  {category.label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
