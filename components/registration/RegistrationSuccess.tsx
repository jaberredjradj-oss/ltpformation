"use client";

import { motion } from "framer-motion";
import type { RegistrationIntent } from "@/lib/registration/types";
import { REGISTRATION_INTENT_COPY } from "@/lib/registration/types";
import { easeCinematic } from "@/lib/motion";
import { Container } from "@/components/ui/Container";

interface RegistrationSuccessProps {
  intent: RegistrationIntent;
  onReset: () => void;
}

export function RegistrationSuccess({ intent, onReset }: RegistrationSuccessProps) {
  const copy = REGISTRATION_INTENT_COPY[intent];

  return (
    <section className="section-wash-surface pb-16 md:pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeCinematic }}
          className="refined-card mx-auto max-w-2xl px-6 py-10 text-center md:px-8 md:py-12"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Confirmation
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-navy-950">
            {copy.successTitle}
          </h2>
          <p className="editorial-lead mx-auto mt-4 max-w-lg text-pretty">
            Votre demande a été enregistrée. Notre équipe vous contactera sous 48 h
            ouvrées pour confirmer la disponibilité et les modalités d&apos;inscription.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)]"
          >
            Nouvelle demande
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
