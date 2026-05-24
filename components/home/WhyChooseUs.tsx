"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WHY_CHOOSE_US, CERTIFICATIONS } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";
import { easeCinematic } from "@/lib/motion";
import { StatMetric } from "@/components/ui/StatMetric";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";

export function WhyChooseUs() {
  const { quote, pillars, badges } = WHY_CHOOSE_US;

  return (
    <Section variant="surface" size="default" wash="blend">
      <SectionHeading
        eyebrow="Notre engagement"
        title="Pourquoi choisir LT Protect Formation"
        description="Un centre institutionnel, ancré dans le terrain, reconnu par les certifications nationales et dédié à la réussite de chaque participant."
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
          >
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <blockquote className="glass-panel-dark rounded-xl p-5 md:p-6">
                <p className="font-serif text-base italic leading-[1.65] text-white md:text-lg">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="mt-4 section-divider-light pt-4">
                  <p className="text-sm font-semibold text-white">{quote.author}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold-300">
                    {quote.role}
                  </p>
                </footer>
              </blockquote>
            </div>
          </TrainingPhoto>
        </motion.div>

        <div className="flex flex-col gap-3 lg:col-span-7">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: index * 0.07, ease: easeCinematic }}
              className="refined-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6"
            >
              <div className="min-w-[8.5rem] shrink-0 md:min-w-[9.5rem] md:w-32">
                <StatMetric value={pillar.metric} size="compact" className="text-navy-950" />
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                  {pillar.metricLabel}
                </p>
              </div>
              <div className="hidden w-px self-stretch bg-gradient-to-b from-gold-400/40 via-slate-200 to-blue-400/40 md:block" />
              <div>
                <h3 className="text-[0.9375rem] font-semibold text-navy-950">{pillar.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body-strong">
                  {pillar.description}
                </p>
              </div>
            </motion.article>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeCinematic }}
            className="refined-card mt-1 flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6"
          >
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-gold-400/30 bg-gold-100/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-700"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {CERTIFICATIONS.map((cert) => (
                <Image
                  key={cert.id}
                  src={cert.image}
                  alt={cert.name}
                  width={80}
                  height={36}
                  className="h-7 w-auto object-contain"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
