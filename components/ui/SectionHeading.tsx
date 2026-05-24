"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  spacious?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
  spacious = false,
}: SectionHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.85, ease: easeCinematic }}
      className={cn(
        spacious ? "mb-12 md:mb-14" : "mb-10 md:mb-12",
        align === "center" && "mx-auto max-w-2xl text-center",
        align === "left" && "max-w-xl text-left",
        className,
      )}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.04, ease: easeCinematic }}
          className={cn("section-eyebrow mb-4", light && "text-gold-300")}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, delay: 0.08, ease: easeCinematic }}
        className={cn(
          "text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.022em] text-balance sm:text-[2rem] lg:text-[2.375rem]",
          light ? "text-white" : "text-navy-950",
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.14, ease: easeCinematic }}
          className={cn(
            "editorial-lead mt-5 max-w-lg text-pretty",
            align === "center" && "mx-auto",
            light ? "text-white/90" : "text-lead-strong",
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.header>
  );
}
