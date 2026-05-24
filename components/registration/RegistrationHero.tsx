"use client";

import { motion } from "framer-motion";
import type { RegistrationIntent } from "@/lib/registration/types";
import { REGISTRATION_INTENT_COPY } from "@/lib/registration/types";
import { easeCinematic } from "@/lib/motion";
import { Container } from "@/components/ui/Container";

interface RegistrationHeroProps {
  intent: RegistrationIntent;
}

export function RegistrationHero({ intent }: RegistrationHeroProps) {
  const copy = REGISTRATION_INTENT_COPY[intent];

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
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem] lg:text-[3rem]">
            {copy.title}
          </h1>
          <p className="editorial-lead mx-auto mt-5 max-w-2xl text-pretty">
            Un parcours fluide et rassurant — votre formation et votre session sont
            pré-sélectionnées lorsque vous arrivez depuis le planning.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
