"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ABOUT_CTA,
  ABOUT_HERO,
  ABOUT_INTRO,
  ABOUT_LOCATION,
  ABOUT_TRAINERS,
  ABOUT_TRAINING,
} from "@/lib/about/content";
import { SITE } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";
import { easeCinematic, revealStagger } from "@/lib/motion";
import { AboutSplitSection } from "@/components/about/AboutSplitSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";
import { GoogleReviewsSection } from "@/components/reviews/GoogleReviewsSection";

export function AboutView() {
  return (
    <>
      <section className="relative overflow-hidden section-wash-blend pb-10 pt-10 md:pb-16 md:pt-20 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 animated-mesh opacity-40" />
        <Container className="relative">
          <div className="grid items-end gap-7 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: easeCinematic }}
              className="max-w-[44rem]"
            >
              <p className="section-eyebrow">{ABOUT_HERO.eyebrow}</p>
              <h1 className="mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.034em] text-navy-950 sm:text-[2.85rem] lg:text-[3.5rem] xl:text-[3.85rem]">
                {ABOUT_HERO.lines[0]}
                <br />
                <span className="gradient-text-gold-blue">{ABOUT_HERO.lines[1]}</span>
              </h1>
              <p className="mt-6 max-w-[40rem] text-base leading-[1.7] tracking-[-0.014em] text-navy-950 md:mt-8 md:text-lg md:leading-[1.78]">
                {ABOUT_HERO.lead}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: easeCinematic }}
              className="refined-card overflow-hidden"
            >
              <div className="relative aspect-[16/10] min-h-[210px] sm:min-h-[240px]">
                <TrainingPhoto
                  src={TRAINING_IMAGES.formation}
                  alt="Centre de formation LT Protect Formation"
                  overlay="soft"
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="absolute inset-0"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <Section variant="surface" size="compact" wash="surface">
        <div className="mx-auto max-w-4xl text-center">
          <motion.blockquote
            {...revealStagger(0.04)}
            className="font-serif text-xl italic leading-[1.6] text-navy-900 md:text-2xl"
          >
            &ldquo;{ABOUT_INTRO.quote.text}&rdquo;
          </motion.blockquote>
          <motion.p
            {...revealStagger(0.12)}
            className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600"
          >
            {ABOUT_INTRO.quote.author} · {ABOUT_INTRO.quote.role}
          </motion.p>
          <div className="mt-8 space-y-4 text-left md:mt-12 md:space-y-5">
            {ABOUT_INTRO.paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                {...revealStagger(0.18 + index * 0.08)}
                className="text-base leading-[1.7] tracking-[-0.014em] text-navy-950 md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </Section>

      <GoogleReviewsSection />

      <Section variant="white" size="default">
        <AboutSplitSection
          eyebrow={ABOUT_LOCATION.eyebrow}
          title={ABOUT_LOCATION.title}
          description={ABOUT_LOCATION.description}
          image={ABOUT_LOCATION.image}
          imageAlt={ABOUT_LOCATION.imageAlt}
          highlights={ABOUT_LOCATION.highlights}
          footer={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeCinematic }}
              className="mt-8 rounded-2xl border border-slate-100/90 bg-surface/50 px-5 py-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Adresse
              </p>
              <p className="mt-2 font-semibold text-navy-950">{ABOUT_LOCATION.addressLabel}</p>
              <p className="mt-1 text-sm text-body-strong">{SITE.address.building}</p>
              <p className="mt-1 text-sm text-body-strong">{ABOUT_LOCATION.accessNote}</p>
              <Link
                href={SITE.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Itinéraire Google Maps ↗
              </Link>
            </motion.div>
          }
        />
      </Section>

      <Section variant="surface" size="default" wash="surface">
        <AboutSplitSection
          reverse
          eyebrow={ABOUT_TRAINING.eyebrow}
          title={ABOUT_TRAINING.title}
          description={ABOUT_TRAINING.description}
          image={ABOUT_TRAINING.image}
          imageAlt={ABOUT_TRAINING.imageAlt}
          highlights={ABOUT_TRAINING.highlights}
          footer={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.24, ease: easeCinematic }}
              className="mt-8 grid gap-2.5 sm:grid-cols-2"
            >
              {ABOUT_TRAINING.framing.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-100/90 bg-white/70 px-4 py-3 text-sm leading-relaxed text-body-strong"
                >
                  {item}
                </div>
              ))}
            </motion.div>
          }
        />
      </Section>

      <Section variant="surface" size="default" wash="blend">
        <AboutSplitSection
          eyebrow={ABOUT_TRAINERS.eyebrow}
          title={ABOUT_TRAINERS.title}
          description={ABOUT_TRAINERS.description}
          image={ABOUT_TRAINERS.image}
          imageAlt={ABOUT_TRAINERS.imageAlt}
          highlights={ABOUT_TRAINERS.highlights}
          footer={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeCinematic }}
              className="mt-8 rounded-2xl border border-blue-200/40 bg-blue-50/40 px-5 py-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Nous accompagnons
              </p>
              <ul className="mt-3 space-y-2">
                {ABOUT_TRAINERS.audiences.map((audience) => (
                  <li key={audience} className="text-sm leading-relaxed text-body-strong">
                    {audience}
                  </li>
                ))}
              </ul>
            </motion.div>
          }
        />
      </Section>

      <Section variant="white" size="compact">
        <div className="refined-card overflow-hidden">
          <div className="gradient-bar-animated" />
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <SectionHeading
                eyebrow={ABOUT_CTA.eyebrow}
                title={ABOUT_CTA.title}
                description={ABOUT_CTA.description}
                align="left"
                className="mb-0! text-left!"
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/preinscription" variant="primary" className="w-full sm:w-auto">
                  Pré-inscription
                </Button>
                <Button href="/devis" variant="outline" className="w-full sm:w-auto">
                  Demander un devis
                </Button>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
            <div className="border-t border-slate-100 p-6 md:p-8 lg:border-l lg:border-t-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Nous trouver
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-navy-950">
                {SITE.address.full}
              </p>
              <Link
                href={SITE.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Itinéraire Google Maps ↗
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
