"use client";

import type { Formation, FormationCategoryId } from "@/lib/formations/types";
import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import { FormationCard } from "@/components/formations/FormationCard";
import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";

interface FormationsGridProps {
  formations: Formation[];
  groupByCategory?: boolean;
  activeCategory?: FormationCategoryId | "all";
}

export function FormationsGrid({
  formations,
  groupByCategory = true,
  activeCategory = "all",
}: FormationsGridProps) {
  if (formations.length === 0) {
    return (
      <div className="refined-card px-6 py-14 text-center">
        <p className="text-lg font-semibold text-navy-950">Aucune formation trouvée</p>
        <p className="editorial-lead mx-auto mt-3 max-w-md">
          Ajustez vos filtres ou votre recherche pour explorer l&apos;ensemble du catalogue.
        </p>
      </div>
    );
  }

  if (!groupByCategory || activeCategory !== "all") {
    return (
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {formations.map((formation, index) => (
          <FormationCard key={formation.slug} formation={formation} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-12">
      {FORMATION_CATEGORIES.map((category) => {
        const categoryFormations = formations.filter(
          (formation) => formation.category === category.id,
        );

        if (categoryFormations.length === 0) return null;

        return (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{ duration: 0.85, ease: easeCinematic }}
              className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <p className="section-eyebrow">{category.label}</p>
                <h2 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.02em] text-navy-950 sm:text-2xl">
                  {category.description}
                </h2>
              </div>
              <p className="text-sm font-medium text-lead-strong">
                {categoryFormations.length} formation
                {categoryFormations.length > 1 ? "s" : ""}
              </p>
            </motion.div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {categoryFormations.map((formation, index) => (
                <FormationCard
                  key={formation.slug}
                  formation={formation}
                  index={index}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
