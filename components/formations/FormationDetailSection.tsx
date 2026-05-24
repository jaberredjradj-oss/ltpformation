"use client";

import { motion } from "framer-motion";
import { PENDING_CONTENT_MESSAGE } from "@/lib/formations/types";
import { easeCinematic } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FormationDetailSectionProps {
  title: string;
  children?: React.ReactNode;
  items?: string[];
  content?: string;
  pending?: boolean;
  className?: string;
}

export function FormationDetailSection({
  title,
  children,
  items,
  content,
  pending,
  className,
}: FormationDetailSectionProps) {
  const isEmpty =
    pending || (!children && (!items || items.length === 0) && !content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, ease: easeCinematic }}
      className={cn("refined-card p-5 md:p-6", className)}
    >
      <h3 className="text-base font-semibold tracking-[-0.015em] text-navy-950">{title}</h3>
      <div className="mt-4">
        {children}
        {!children && content && (
          <p className="text-sm leading-[1.75] text-body-strong">{content}</p>
        )}
        {!children && items && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-body-strong">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-gold-400 to-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {isEmpty && (
          <p className="rounded-lg border border-dashed border-slate-200/90 bg-surface/60 px-4 py-3 text-sm text-lead-strong">
            {PENDING_CONTENT_MESSAGE}
          </p>
        )}
      </div>
    </motion.article>
  );
}
