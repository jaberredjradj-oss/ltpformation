"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: easeCinematic },
});

export function DevisEditorialIntro() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: easeCinematic }}
      className="mb-14 w-full md:mb-16 lg:mb-20"
    >
      <div className="max-w-[72rem]">
        <motion.p
          {...reveal(0.04)}
          className="text-lg font-medium tracking-[-0.02em] text-body-strong md:text-xl"
        >
          Besoin d&apos;une formation&nbsp;?
        </motion.p>

        <motion.h2
          {...reveal(0.12)}
          className="mt-4 max-w-[18ch] text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.034em] text-navy-950 sm:text-[2.85rem] lg:text-[3.75rem] xl:text-[4.25rem]"
        >
          Demandez votre
          <br />
          <span className="gradient-text-gold-blue">devis.</span>
        </motion.h2>

        <motion.p
          {...reveal(0.2)}
          className="mt-6 max-w-[16ch] text-xl font-medium leading-[1.35] tracking-[-0.02em] text-navy-800/90 md:text-2xl md:leading-[1.3]"
        >
          Nous vous répondons
          <br />
          rapidement.
        </motion.p>
      </div>

      <motion.p
        {...reveal(0.28)}
        className="mt-12 max-w-[68rem] text-[1.0625rem] leading-[1.75] tracking-[-0.014em] text-navy-950 md:mt-14 md:text-[1.125rem] md:leading-[1.8] lg:text-[1.1875rem] lg:leading-[1.82]"
      >
        Posez vos questions, demandez un devis ou vérifiez les disponibilités de nos
        prochaines sessions. LT Protect Formation vous accompagne dans le choix de votre
        formation&nbsp;: SSIAP, secourisme, sûreté ou habilitation électrique. Notre équipe
        vous guide également sur les prérequis, les financements possibles et les modalités
        d&apos;inscription.
      </motion.p>

      <motion.div
        {...reveal(0.36)}
        className="mt-12 h-px w-24 bg-gradient-to-r from-gold-400/80 via-blue-500/50 to-transparent md:mt-14"
        aria-hidden
      />
    </motion.div>
  );
}
