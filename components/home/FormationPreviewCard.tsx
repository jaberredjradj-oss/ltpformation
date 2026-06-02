"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";
import { CategoryVisual } from "@/components/ui/CategoryVisual";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";
import type { CategoryVisualTheme } from "@/lib/category-visuals";

type CardLayout = "standard" | "split" | "immersion" | "editorial";

interface FormationPreviewCardProps {
  title: string;
  subtitle: string;
  description: string;
  visual: CategoryVisualTheme;
  image: string;
  layout?: CardLayout;
  highlights: readonly string[];
  badge?: string;
  href?: string;
  delay?: number;
  className?: string;
}

function CardBadges({ subtitle, badge }: { subtitle: string; badge: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full border border-white/20 bg-white/92 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-navy-900">
        {subtitle}
      </span>
      <span className="rounded-full border border-gold-400/30 bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-gold-700">
        {badge}
      </span>
    </div>
  );
}

function CardContent({
  title,
  description,
  highlights,
  tone = "light",
}: Pick<FormationPreviewCardProps, "title" | "description" | "highlights"> & {
  tone?: "light" | "dark";
}) {
  const titleClass =
    tone === "dark"
      ? "text-white group-hover:text-gold-200"
      : "text-navy-900 group-hover:text-blue-600";
  const bodyClass = tone === "dark" ? "text-slate-100/95" : "text-body-strong";
  const listClass = tone === "dark" ? "text-slate-100/95" : "text-navy-800";
  const borderClass = tone === "dark" ? "border-white/15" : "border-slate-100";
  const linkClass = tone === "dark" ? "text-gold-300 hover:text-white" : "text-blue-600";

  return (
    <>
      <h3
        className={`text-lg font-semibold tracking-[-0.015em] transition-colors duration-400 md:text-xl ${titleClass}`}
      >
        {title}
      </h3>
      <p
        className={`mt-2.5 flex-1 text-sm leading-relaxed ${bodyClass}`}
      >
        {description}
      </p>
      <ul className={`mt-5 space-y-2 border-t pt-5 ${borderClass}`}>
        {highlights.map((item) => (
          <li key={item} className={`flex items-start gap-3 text-sm ${listClass}`}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 shadow-sm" />
            {item}
          </li>
        ))}
      </ul>
      <span
        className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-400 group-hover:gap-3 ${linkClass}`}
      >
        Consulter le programme
        <span aria-hidden className="transition-transform duration-400 group-hover:translate-x-1">
          →
        </span>
      </span>
    </>
  );
}

export function FormationPreviewCard({
  title,
  subtitle,
  description,
  visual,
  image,
  layout = "standard",
  highlights,
  badge = "Certifiant",
  href = "/formations",
  delay = 0,
  className,
}: FormationPreviewCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-56px" }}
      transition={{ duration: 0.9, delay, ease: easeCinematic }}
      className={className}
    >
      <Link href={href} className="group relative flex h-full flex-col overflow-hidden refined-card">
        {layout === "split" && (
          <div className="grid md:grid-cols-[44%_1fr]">
            <div className="relative min-h-[190px] overflow-hidden md:min-h-[240px]">
              <CategoryVisual
                theme={visual}
                label={title}
                subtitle={subtitle}
                image={image}
                hideLabels
                className="h-full min-h-[190px] transition-transform duration-700 group-hover:scale-[1.04] md:min-h-[240px]"
              />
            </div>
            <div className="relative flex flex-1 flex-col bg-gradient-to-br from-white to-blue-50/20 p-4 sm:p-5 md:p-6">
              <div className="absolute left-5 top-5 md:left-6 md:top-6">
                <CardBadges subtitle={subtitle} badge={badge} />
              </div>
              <div className="mt-12 flex flex-1 flex-col">
                <CardContent title={title} description={description} highlights={highlights} />
              </div>
            </div>
          </div>
        )}

        {layout === "immersion" && (
          <div className="relative min-h-[360px] flex-1 sm:min-h-[320px]">
            <TrainingPhoto
              src={image}
              alt={title}
              overlay="soft"
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
            >
              <div className="absolute left-4 top-4 z-10">
                <CardBadges subtitle={subtitle} badge={badge} />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 md:p-5">
                <div className="glass-panel-dark rounded-xl p-4 sm:p-5 md:p-6">
                  <CardContent
                    title={title}
                    description={description}
                    highlights={highlights}
                    tone="dark"
                  />
                </div>
              </div>
            </TrainingPhoto>
          </div>
        )}

        {layout === "editorial" && (
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[190px] overflow-hidden lg:min-h-full">
              <CategoryVisual
                theme={visual}
                label={title}
                subtitle={subtitle}
                image={image}
                featured
                className="h-full transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col bg-gradient-to-br from-white to-blue-50/20 p-4 sm:p-5 md:p-6 lg:p-7">
              <CardBadges subtitle={subtitle} badge={badge} />
              <div className="mt-5 flex flex-1 flex-col">
                <CardContent title={title} description={description} highlights={highlights} />
              </div>
            </div>
          </div>
        )}

        {layout === "standard" && (
          <>
            <div className="relative aspect-[16/10] min-h-[190px] overflow-hidden sm:min-h-0">
              <CategoryVisual
                theme={visual}
                label={title}
                subtitle={subtitle}
                image={image}
                className="h-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute left-4 top-4 z-10">
                <CardBadges subtitle={subtitle} badge={badge} />
              </div>
            </div>
            <div className="relative flex flex-1 flex-col bg-white p-4 sm:p-5 md:p-6">
              <CardContent title={title} description={description} highlights={highlights} />
            </div>
          </>
        )}
      </Link>
    </motion.article>
  );
}
