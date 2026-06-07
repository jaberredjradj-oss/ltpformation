"use client";

import { motion } from "framer-motion";
import { STATS_2025 } from "@/lib/constants";
import { easeCinematic } from "@/lib/motion";
import { StatMetric } from "@/components/ui/StatMetric";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Stats2025() {
  return (
    <Section variant="white" id="statistiques" size="compact" wash="blue">
      <SectionHeading
        eyebrow="Bilan 2025"
        title="Toutes les statistiques sur l'année 2025"
        description="Des indicateurs transparents qui reflètent la qualité de nos formations."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.95, ease: easeCinematic }}
        className="institutional-panel card-accent-glow overflow-hidden"
      >
        <div className="gradient-bar-animated" />
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-5">
          {STATS_2025.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: index * 0.08, ease: easeCinematic }}
              className={`relative min-w-[10.5rem] px-4 py-8 text-center sm:min-w-[11rem] md:px-5 md:py-9 ${
                index > 0 ? "lg:border-l lg:border-slate-200/80" : ""
              }`}
            >
              <StatMetric value={stat.value} className="gradient-text-blue" animate={false} />
              <p className="mx-auto mt-3 max-w-[12rem] text-sm font-medium leading-snug text-lead-strong">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
