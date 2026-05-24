"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FormationSectionGroupProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormationSectionGroup({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: FormationSectionGroupProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.9, ease: easeCinematic }}
      className={cn("scroll-mt-28", className)}
    >
      <div className="mb-5 flex flex-col gap-2 md:mb-6">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="text-2xl font-semibold tracking-[-0.022em] text-navy-950 md:text-[1.75rem]">
          {title}
        </h2>
        {description && <p className="editorial-lead max-w-3xl text-pretty">{description}</p>}
        <div className="section-divider-glow mt-2 max-w-xs" />
      </div>
      <div className="space-y-4">{children}</div>
    </motion.section>
  );
}
