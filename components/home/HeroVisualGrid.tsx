"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HERO_DOMAINS, HERO_VISUALS } from "@/lib/constants";
import { staggerViewContainer, staggerViewItem } from "@/lib/motion";
import { CategoryVisual } from "@/components/ui/CategoryVisual";

const HERO_DOMAIN_HREFS = Object.fromEntries(
  HERO_DOMAINS.map((domain) => [domain.label, domain.href]),
) as Record<string, string>;

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
        {others.map((item) => {
          const href = HERO_DOMAIN_HREFS[item.label];

          const visual = (
            <CategoryVisual
              theme={item.theme}
              label={item.label}
              image={item.image}
              className="h-full transition-transform duration-[0.9s] ease-out group-hover:scale-[1.03]"
            />
          );

          return (
            <motion.div
              key={item.label}
              variants={staggerViewItem}
              className="group relative aspect-4/3 overflow-hidden rounded-2xl"
            >
              {href ? (
                <Link
                  href={href}
                  className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  aria-label={`Voir les formations ${item.label}`}
                >
                  {visual}
                </Link>
              ) : (
                visual
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
