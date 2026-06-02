"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SITE, HERO_DOMAINS } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";
import { easeCinematic } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { HeroVisualGrid } from "./HeroVisualGrid";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: easeCinematic },
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section ref={sectionRef} className="relative min-h-[calc(100svh-96px)] overflow-hidden md:min-h-[94vh]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.03] md:scale-[1.06]">
        <TrainingPhoto
          src={TRAINING_IMAGES.heroBg}
          alt="Centre de formation professionnelle LT Protect Formation"
          overlay="hero"
          priority
          kenBurns
          sizes="100vw"
          className="h-full min-h-[calc(100svh-96px)] md:min-h-[94vh]"
          imageClassName="object-[58%_center] sm:object-center"
        />
      </motion.div>

      <div className="cinematic-vignette pointer-events-none absolute inset-0" />
      <HeroAtmosphere />

      <Container className="relative py-8 sm:py-12 md:py-24 lg:py-32 xl:py-36">
        <motion.div
          style={{ y: contentY }}
          className="grid items-center gap-8 md:gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:gap-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: easeCinematic }}
            className="glass-panel-luxury rounded-2xl p-5 sm:p-7 md:p-10 lg:p-11"
          >
            <motion.h1
              {...reveal(0.1)}
              className="display-width text-[2rem] font-bold leading-[1.06] tracking-[-0.028em] text-navy-950 min-[380px]:text-[2.2rem] sm:text-[2.75rem] lg:text-[3.5rem]"
            >
              Sécurité, Sûreté et Secourisme
            </motion.h1>

            <motion.p
              {...reveal(0.26)}
              className="mt-5 text-lg font-semibold tracking-[-0.02em] gradient-text-gold-blue sm:mt-7 sm:text-2xl lg:text-[1.65rem] lg:leading-[1.35]"
            >
              Devenez acteur de la prévention
            </motion.p>

            <motion.div
              {...reveal(0.32)}
              className="mt-7 space-y-0.5 border-l-2 border-gold-400/80 pl-4 sm:mt-10 sm:pl-6"
            >
              <p className="font-serif text-base italic leading-relaxed text-navy-800 md:text-xl">
                Apprendre aujourd&apos;hui,
              </p>
              <p className="font-serif text-base italic leading-relaxed text-navy-800 md:text-xl">
                protéger demain.
              </p>
            </motion.div>

            <motion.p
              {...reveal(0.38)}
              className="prose-width editorial-lead mt-7 font-medium text-body-strong sm:mt-10"
            >
              {SITE.name} — centre de formation dédié à l&apos;excellence en prévention.
              Parcours certifiants, formateurs experts et accompagnement conforme aux
              exigences réglementaires.
            </motion.p>

            <motion.div {...reveal(0.44)} className="mt-8 flex flex-wrap gap-2 sm:mt-12">
              {HERO_DOMAINS.map((domain, i) => (
                <motion.div
                  key={domain.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.48 + i * 0.05, ease: easeCinematic }}
                >
                  <Link
                    href={domain.href}
                    className="rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-navy-800 transition-all duration-500 hover:border-blue-300/70 hover:bg-blue-50/50 hover:text-blue-600 hover:shadow-[0_4px_16px_rgba(43,127,212,0.12)]"
                  >
                    {domain.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              {...reveal(0.5)}
              className="mt-9 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:items-center"
            >
              <Button href="/formations" variant="primary" className="w-full !px-8 !py-3.5 sm:w-auto">
                Voir nos formations
              </Button>
              <Button href="/devis" variant="outline" className="w-full !px-8 !py-3.5 sm:w-auto">
                Demander un devis
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.22, ease: easeCinematic }}
          >
            <HeroVisualGrid />
          </motion.div>
        </motion.div>
      </Container>

      <div className="gradient-bar-animated relative mx-auto max-w-6xl px-6 md:px-10" />

      <div className="pointer-events-none absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/60">
          Découvrir
        </span>
        <div className="scroll-hint flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1.5">
          <span className="h-2 w-px rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
