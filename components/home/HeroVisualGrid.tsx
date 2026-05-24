"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_VISUALS, CERTIFICATIONS } from "@/lib/constants";
import { staggerViewContainer, staggerViewItem } from "@/lib/motion";
import { CategoryVisual } from "@/components/ui/CategoryVisual";

export function HeroVisualGrid() {
  const featured = HERO_VISUALS.find((v) => "featured" in v && v.featured);
  const others = HERO_VISUALS.filter((v) => !("featured" in v && v.featured));

  return (
    <motion.div
      variants={staggerViewContainer}
      initial="hidden"
      animate="show"
      className="glass-panel-luxury overflow-hidden rounded-2xl p-1.5"
    >
      <div className="grid grid-cols-2 gap-2">
        {featured && (
          <motion.div
            variants={staggerViewItem}
            className="group relative col-span-2 aspect-video overflow-hidden rounded-2xl"
          >
            <CategoryVisual
              theme={featured.theme}
              label={featured.label}
              subtitle={featured.subtitle}
              image={featured.image}
              featured
              className="transition-transform duration-[0.9s] ease-out group-hover:scale-[1.03]"
            />
          </motion.div>
        )}
        {others.map((item) => (
          <motion.div
            key={item.label}
            variants={staggerViewItem}
            className="group relative aspect-4/3 overflow-hidden rounded-2xl"
          >
            <CategoryVisual
              theme={item.theme}
              label={item.label}
              subtitle={item.subtitle}
              image={item.image}
              className="transition-transform duration-[0.9s] ease-out group-hover:scale-[1.03]"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={staggerViewItem}
        className="mt-2 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-gold-100/20 px-5 py-4"
      >
        <p className="mb-3 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-gold-600">
          Organisme certifié & finançable
        </p>
        <div className="flex flex-wrap items-center justify-center gap-7">
          {CERTIFICATIONS.map((cert) => (
            <Image
              key={cert.id}
              src={cert.image}
              alt={cert.name}
              width={88}
              height={40}
              className="h-8 w-auto object-contain opacity-90 transition-opacity duration-500 hover:opacity-100"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
