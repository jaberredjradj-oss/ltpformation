"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";
import { easeCinematic } from "@/lib/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";

export function ContactPreview() {
  return (
    <Section variant="surface" size="default" wash="surface">
      <div className="refined-card overflow-hidden">
        <div className="gradient-bar-animated" />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[260px] lg:min-h-full">
            <TrainingPhoto
              src={TRAINING_IMAGES.formation}
              alt="Équipe LT Protect Formation"
              overlay="soft"
              className="absolute inset-0 min-h-[260px]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: easeCinematic }}
                className="glass-panel-dark max-w-md rounded-xl p-5 md:p-6"
              >
                <SectionHeading
                  eyebrow="Contact"
                  title="Parlons de votre projet de formation"
                  description="Notre équipe vous répond du lundi au vendredi pour étudier vos besoins et vous proposer un devis personnalisé."
                  align="left"
                  light
                  className="mb-0!"
                />
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <Button href="/contact" variant="primary" className="py-3!">
                    Nous contacter
                  </Button>
                  <Button
                    href="/devis"
                    variant="outline"
                    className="border-white/30! bg-white/10! py-3! text-white! hover:bg-white/20!"
                  >
                    Demander un devis
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 lg:p-10">
            <ul className="space-y-5">
              <li>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Adresse
                </p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-navy-950">{SITE.address.full}</p>
                <a
                  href={SITE.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Itinéraire Google Maps
                  <span aria-hidden>↗</span>
                </a>
              </li>
              <li>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Téléphone
                </p>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="mt-1.5 block text-sm font-semibold text-navy-950 transition-colors hover:text-blue-600"
                >
                  {SITE.phone}
                </a>
              </li>
              <li>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Mobile
                </p>
                <a
                  href={`tel:${SITE.mobile.replace(/\./g, "").replace(/\s/g, "")}`}
                  className="mt-1.5 block text-sm font-semibold text-navy-950 transition-colors hover:text-blue-600"
                >
                  {SITE.mobile}
                </a>
              </li>
              <li>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Email
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-1.5 block text-sm font-semibold text-navy-950 transition-colors hover:text-blue-600"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Horaires
                </p>
                <p className="mt-1.5 text-sm font-medium text-body-strong">{SITE.hours}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
