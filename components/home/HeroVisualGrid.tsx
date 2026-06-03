"use client";

import { motion } from "framer-motion";
import { HERO_VISUALS } from "@/lib/constants";
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
              image={item.image}
              className="transition-transform duration-[0.9s] ease-out group-hover:scale-[1.03]"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
