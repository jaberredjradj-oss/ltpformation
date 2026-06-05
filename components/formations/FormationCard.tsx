"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Formation } from "@/lib/formations/types";
import { getFormationCoverImage } from "@/lib/formation-cover-images";
import { easeCinematic } from "@/lib/motion";
import { FormationMetaValue } from "@/components/formations/FormationMetaValue";
import { InstallmentBadge } from "@/components/formations/InstallmentBadge";
import {
  formatFormationDurationHours,
  formatFormationPriceEuro,
} from "@/lib/formations/display";
import { hasInstallmentFacility } from "@/lib/formations/payment";
import { cn } from "@/lib/utils";

interface FormationCardProps {
  formation: Formation;
  index?: number;
  className?: string;
}

function CardAction({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)]",
    secondary:
      "border border-slate-200/90 bg-white text-navy-950 hover:border-blue-300/70 hover:text-blue-600",
    ghost: "text-blue-600 hover:text-blue-700",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-all duration-300 whitespace-normal text-center leading-snug sm:min-h-0 sm:w-auto sm:text-xs",
        styles[variant],
      )}
    >
      {children}
    </Link>
  );
}

export function FormationCard({ formation, index = 0, className }: FormationCardProps) {
  const detailHref = `/formations/${formation.slug}`;
  const preinscriptionHref = `/preinscription?formation=${formation.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay: index * 0.05, ease: easeCinematic }}
      className={cn("group h-full", className)}
    >
      <div className="refined-card card-accent-glow flex h-full flex-col overflow-hidden">
        <div className="gradient-bar-animated" />
        <div className="relative aspect-[16/9] min-h-[190px] overflow-hidden sm:min-h-0">
          <Image
            src={getFormationCoverImage(formation)}
            alt={formation.shortTitle ?? formation.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,21,37,0.72)_0%,rgba(7,21,37,0.18)_45%,transparent_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <span className="inline-flex max-w-full rounded-full border border-blue-200/70 bg-blue-50/90 px-3 py-1 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-blue-700">
              {formation.categoryLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <h3 className="text-xl font-semibold leading-snug tracking-[-0.018em] text-navy-950 transition-colors duration-300 group-hover:text-blue-600 sm:text-lg">
            {formation.shortTitle}
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <FormationMetaValue
              label="Durée"
              value={formatFormationDurationHours(formation.durationHours)}
              valueClassName="text-sm font-semibold tabular-nums"
            />
            <div className="min-w-0">
              <FormationMetaValue
                label="Tarif"
                value={formatFormationPriceEuro(formation)}
                valueClassName="text-sm font-semibold tabular-nums text-blue-600"
              />
              {hasInstallmentFacility(formation.slug) && (
                <div className="mt-3 flex justify-end">
                  <InstallmentBadge />
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-body-strong">
            {formation.summary}
          </p>

          {formation.contentStatus === "stub" && (
            <p className="mt-3 rounded-lg border border-dashed border-slate-200/90 bg-surface/60 px-3 py-2 text-xs text-lead-strong">
              Programme officiel en cours d&apos;intégration
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2.5 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap">
            <CardAction href={detailHref}>En savoir plus</CardAction>
            <CardAction href={preinscriptionHref} variant="secondary">
              Pré-inscription
            </CardAction>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
