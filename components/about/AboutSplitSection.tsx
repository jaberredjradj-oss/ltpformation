"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";
import { TrainingPhoto } from "@/components/ui/TrainingPhoto";
import { cn } from "@/lib/utils";

interface AboutSplitSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: readonly string[];
  reverse?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export function AboutSplitSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  highlights,
  reverse = false,
  footer,
  className,
}: AboutSplitSectionProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16",
        reverse && "lg:[&>*:first-child]:order-2",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.9, ease: easeCinematic }}
        className="refined-card card-accent-glow overflow-hidden"
      >
        <div className="gradient-bar-animated" />
        <div className="relative aspect-[16/11] min-h-[280px]">
          <TrainingPhoto
            src={image}
            alt={imageAlt}
            overlay="editorial"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="absolute inset-0"
          />
        </div>
      </motion.div>

      <div className="min-w-0">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.8, ease: easeCinematic }}
          className="section-eyebrow"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.85, delay: 0.06, ease: easeCinematic }}
          className="mt-4 text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.022em] text-navy-950 sm:text-[2rem] lg:text-[2.25rem]"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.85, delay: 0.1, ease: easeCinematic }}
          className="mt-5 max-w-xl text-[1.0625rem] leading-[1.72] tracking-[-0.014em] text-navy-950"
        >
          {description}
        </motion.p>

        <ul className="mt-7 space-y-3">
          {highlights.map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.75, delay: 0.12 + index * 0.04, ease: easeCinematic }}
              className="flex items-start gap-3 text-sm leading-relaxed text-body-strong"
            >
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-600">
                ✓
              </span>
              {item}
            </motion.li>
          ))}
        </ul>

        {footer}
      </div>
    </div>
  );
}
