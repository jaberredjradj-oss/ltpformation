"use client";

import Link from "next/link";
import type { SiteAnnouncement } from "@/lib/announcements/types";
import { AnnouncementFx } from "@/components/announcement/AnnouncementFx";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: SiteAnnouncement;
  onClose?: () => void;
  /** When false, the CTA does not navigate (used for the admin live preview). */
  interactive?: boolean;
  className?: string;
}

function CtaButton({
  text,
  url,
  interactive,
}: {
  text: string;
  url: string;
  interactive: boolean;
}) {
  const classes =
    "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1d5eb0] via-[#2b7fd4] to-[#1a6bc4] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(29,94,176,0.28)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2";

  if (!text) return null;

  if (!interactive) {
    return (
      <span className={classes} aria-hidden>
        {text}
      </span>
    );
  }

  const isInternal = url.startsWith("/");

  if (isInternal) {
    return (
      <Link href={url || "/"} className={classes}>
        {text}
      </Link>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={classes}>
      {text}
    </a>
  );
}

export function AnnouncementCard({
  announcement,
  onClose,
  interactive = true,
  className,
}: AnnouncementCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-[rgba(43,127,212,0.18)] bg-[linear-gradient(150deg,#ffffff_0%,#f6faff_60%,#fffaf0_100%)] shadow-[0_16px_48px_rgba(7,21,37,0.16),0_4px_16px_rgba(43,127,212,0.08)]",
        className,
      )}
      role="region"
      aria-label="Annonce LT Protect Formation"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c9a227] via-[#2b7fd4] to-[#c9a227]"
      />

      <AnnouncementFx type={announcement.animationType} />

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'annonce"
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <div className="relative px-5 pb-5 pt-6 md:px-6 md:pt-7">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#96740f]">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[#c9a227]"
          />
          Nouvelle formation
        </span>

        <h3 className="mt-3 pr-6 text-lg font-semibold leading-snug tracking-[-0.01em] text-[#071525]">
          {announcement.title}
        </h3>

        {announcement.description && (
          <p className="mt-2 text-sm leading-relaxed text-[#334155]">
            {announcement.description}
          </p>
        )}

        {announcement.ctaText && (
          <div className="mt-4">
            <CtaButton
              text={announcement.ctaText}
              url={announcement.ctaUrl}
              interactive={interactive}
            />
          </div>
        )}
      </div>
    </div>
  );
}
