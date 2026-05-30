"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { GoogleReviewsData } from "@/lib/reviews/types";
import { getGoogleReviews } from "@/lib/reviews/google-reviews";
import { easeCinematic, revealStagger } from "@/lib/motion";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

function formatRating(value: number): string {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

interface GoogleReviewsSectionProps {
  data?: GoogleReviewsData | null;
}

export function GoogleReviewsSection({ data: dataProp }: GoogleReviewsSectionProps) {
  const data = dataProp ?? getGoogleReviews();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(280, track.clientWidth * 0.85);
    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateScrollState, data?.reviews.length]);

  if (!data || data.reviews.length === 0) {
    return null;
  }

  return (
    <Section
      id="avis-google"
      variant="white"
      size="default"
      wash="blend"
      className="scroll-mt-24 border-y border-slate-100/80"
    >
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Réputation"
            title="Ils nous font confiance"
            description="Avis Google de nos stagiaires et partenaires"
            align="left"
            className="mb-0! max-w-xl"
          />

          <motion.div
            {...revealStagger(0.1)}
            className="flex shrink-0 flex-col items-start gap-3 rounded-2xl border border-gold-200/70 bg-gradient-to-br from-white via-white to-gold-50/50 px-5 py-4 shadow-[0_8px_32px_rgba(7,21,37,0.06)] lg:items-end lg:text-right"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              Note moyenne Google
            </p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold tracking-tight text-navy-950">
                {formatRating(data.averageRating)}
              </span>
              <div>
                <StarRating rating={data.averageRating} size="md" />
                <p className="mt-1 text-sm text-body-strong">
                  {data.totalCount} avis sur Google
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative mt-10">
          <div
            ref={trackRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth md:gap-5"
            style={{ scrollbarWidth: "thin" }}
          >
            {data.reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{ duration: 0.75, delay: index * 0.04, ease: easeCinematic }}
                className="w-[min(88vw,320px)] shrink-0 snap-start sm:w-[300px] md:w-[340px]"
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 bg-linear-to-r from-white to-transparent md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-linear-to-l from-white to-transparent md:block" />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Avis précédents"
                onClick={() => scrollBy("left")}
                disabled={!canScrollLeft}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-950 transition-colors",
                  "hover:border-blue-300 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-35",
                )}
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                aria-label="Avis suivants"
                onClick={() => scrollBy("right")}
                disabled={!canScrollRight}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-950 transition-colors",
                  "hover:border-blue-300 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-35",
                )}
              >
                <span aria-hidden>→</span>
              </button>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                href={data.writeReviewUrl}
                variant="primary"
                external
                className="min-h-11 w-full px-6 py-3.5 sm:w-auto"
              >
                Laisser un avis Google
              </Button>
              <Button
                href={data.profileUrl}
                variant="outline"
                external
                className="min-h-11 w-full px-6 py-3.5 sm:w-auto"
              >
                Voir tous les avis Google
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
