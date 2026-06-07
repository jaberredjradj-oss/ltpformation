"use client";

import { motion } from "framer-motion";
import { WHY_CHOOSE_US } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";
import { easeCinematic } from "@/lib/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";

export function WhyChooseUs() {
  const { pillars } = WHY_CHOOSE_US;

  return (
    <Section variant="surface" size="default" wash="blend">
      <SectionHeading
        eyebrow="Notre engagement"
        title="Pourquoi choisir LT Protect Formation ?"
        description="Parce que la sécurité ne s'improvise pas. Notre centre de formation, nourri par l'expérience du terrain, transmet un savoir-faire concret et accompagne chaque participant, du particulier en reconversion à l'entreprise, jusqu'à la reconnaissance de ses compétences."
        spacious
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.9, ease: easeCinematic }}
          className="refined-card overflow-hidden lg:col-span-5"
        >
          <TrainingPhoto
            src={TRAINING_IMAGES.classroom}
            alt="Formation professionnelle en salle — LT Protect Formation"
            overlay="soft"
            className="min-h-[340px] lg:min-h-full"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </motion.div>

        <div className="flex flex-col gap-3 lg:col-span-7">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: index * 0.07, ease: easeCinematic }}
              className="refined-card p-5 md:p-6"
            >
              <h3 className="text-[0.9375rem] font-semibold text-navy-950">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body-strong">
                {pillar.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
