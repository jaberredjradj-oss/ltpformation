"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";
import { easeCinematic, revealStagger } from "@/lib/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";

const highlights = [
  "Formateurs experts issus du terrain",
  "Pédagogie pratique et immersive",
  "Accompagnement entreprise & OPCO",
  "Sessions intra et inter-entreprises",
] as const;

export function AboutPreview() {
  return (
    <Section variant="white" size="compact" wash="blend">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Qui sommes-nous"
            title="Un centre de formation engagé pour votre sécurité"
            align="left"
            className="mb-0! text-left!"
          />
          <motion.p
            {...revealStagger(0.12)}
            className="prose-width mt-6 text-[1.0625rem] leading-[1.65] text-body-strong"
          >
            {SITE.name} est un organisme de formation professionnelle spécialisé dans la
            prévention des risques, la sécurité incendie et les habilitations réglementaires.
            Nos formateurs, issus du terrain, transmettent une pédagogie exigeante et orientée
            pratique.
          </motion.p>
          <motion.p
            {...revealStagger(0.2)}
            className="prose-width mt-4 text-[1.0625rem] leading-[1.65] text-lead-strong"
          >
            Situés à Voisins-le-Bretonneux, nous accompagnons les entreprises et les particuliers
            avec des sessions adaptées à vos contraintes opérationnelles.
          </motion.p>
          <motion.div {...revealStagger(0.28)} className="mt-8">
            <Button href="/qui-sommes-nous" variant="outline">
              En savoir plus sur nous
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.9, ease: easeCinematic }}
          className="refined-card card-accent-glow overflow-hidden"
        >
          <div className="gradient-bar-animated" />
          <div className="relative aspect-16/10 min-h-[220px]">
            <TrainingPhoto
              src={TRAINING_IMAGES.aboutTeam}
              alt="Atelier de formation professionnelle — LT Protect Formation"
              overlay="soft"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="border-t border-slate-200/80 bg-gradient-to-br from-white to-blue-50/30 px-6 py-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
              <BrandLogo size="about" className="shrink-0" />
              <div>
                <p className="font-serif text-sm italic text-navy-800">{SITE.tagline}</p>
                <ul className="mt-4 space-y-2.5">
                  {highlights.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.08 + i * 0.05, ease: easeCinematic }}
                      className="flex items-start gap-2.5 text-sm font-medium text-body-strong"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-600">
                        ✓
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
