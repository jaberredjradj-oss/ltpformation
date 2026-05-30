"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Easing } from "framer-motion";
import type {
  AnnouncementAnimationType,
  SiteAnnouncement,
} from "@/lib/announcements/types";
import type { AnnouncementImage } from "@/lib/announcements/formation-image";
import { cn } from "@/lib/utils";

/** Reveal style: "materialize" builds the whole card from the animation. */
export type AnnouncementCardReveal = "materialize" | "none";

interface AnnouncementCardProps {
  announcement: SiteAnnouncement;
  image?: AnnouncementImage | null;
  onClose?: () => void;
  /** When false, the CTA does not navigate (used for the admin live preview). */
  interactive?: boolean;
  reveal?: AnnouncementCardReveal;
  className?: string;
}

const EASE: Easing = [0.16, 1, 0.3, 1];
const GOLD = "rgba(201,162,39,0.98)";
const BLUE = "rgba(96,170,240,0.98)";

type RevealMode = AnnouncementAnimationType | null;

// Deterministic fragments that converge onto the FULL card's perimeter — the
// light that draws the announcement's boundary before the panel fills in.
const FRAGMENTS: { left: string; top: string; dx: number; dy: number; gold: boolean }[] = [
  { left: "16%", top: "0%", dx: -14, dy: -88, gold: true },
  { left: "38%", top: "0%", dx: 0, dy: -96, gold: false },
  { left: "62%", top: "0%", dx: 0, dy: -96, gold: true },
  { left: "84%", top: "0%", dx: 14, dy: -88, gold: false },
  { left: "100%", top: "24%", dx: 92, dy: -14, gold: true },
  { left: "100%", top: "60%", dx: 96, dy: 14, gold: false },
  { left: "84%", top: "100%", dx: 14, dy: 92, gold: true },
  { left: "62%", top: "100%", dx: 0, dy: 98, gold: false },
  { left: "38%", top: "100%", dx: 0, dy: 98, gold: true },
  { left: "16%", top: "100%", dx: -14, dy: 92, gold: false },
  { left: "0%", top: "60%", dx: -96, dy: 14, gold: true },
  { left: "0%", top: "24%", dx: -92, dy: -14, gold: false },
];

/** Whole-card entrance: the entire container reveals as one object. */
function cardReveal(mode: RevealMode) {
  if (!mode) return { initial: false as const };
  switch (mode) {
    case "glow-sweep":
      return {
        initial: { opacity: 0, clipPath: "inset(0 100% 0 0 round 26px)", scale: 0.92 },
        animate: { opacity: 1, clipPath: "inset(0 0% 0 0 round 26px)", scale: 1 },
        transition: { duration: 1.05, delay: 0.12, ease: EASE },
      };
    case "rocket":
      return {
        initial: { opacity: 0, scale: 0.52, filter: "blur(20px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        transition: { duration: 0.95, delay: 0.22, ease: EASE },
      };
    case "shooting-star":
      return {
        initial: { opacity: 0, scale: 0.72, filter: "blur(16px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        transition: { duration: 0.88, delay: 0.28, ease: EASE },
      };
    default:
      return {
        initial: { opacity: 0, scale: 0.78, filter: "blur(16px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        transition: { duration: 0.9, delay: 0.25, ease: EASE },
      };
  }
}

/**
 * The outline + light that constructs the ENTIRE card boundary, with a
 * mode-specific personality. It sits at the card's final size, so the panel
 * grows/scans to fill the boundary it draws.
 */
function Assembly({ mode }: { mode: AnnouncementAnimationType }) {
  const isGlow = mode === "glow-sweep";
  const isStar = mode === "shooting-star";
  const isRocket = mode === "rocket";

  const outlineColor = isRocket ? "rgba(201,162,39,0.95)" : "rgba(120,185,250,0.95)";
  const outlineShadow =
    "0 0 40px 8px rgba(96,170,240,0.7), 0 0 90px 16px rgba(201,162,39,0.32), inset 0 0 28px rgba(201,162,39,0.35)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-40">
      {/* Bloom the card emerges from. */}
      <motion.span
        className="absolute inset-2 rounded-[22px] blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, rgba(96,170,240,0.5), rgba(201,162,39,0.22) 55%, transparent 78%)",
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.7, 1.05, 1] }}
        transition={{ duration: 1.2, delay: 0.18, times: [0, 0.45, 1], ease: EASE }}
      />

      {isGlow ? (
        <>
          <motion.span
            className="absolute inset-y-[-40%] w-[55%] -skew-x-12 blur-lg"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(120,185,250,0.6), rgba(201,162,39,0.45), transparent)",
            }}
            initial={{ left: "-50%", opacity: 0 }}
            animate={{ left: "130%", opacity: [0, 1, 0] }}
            transition={{ duration: 1.05, delay: 0.12, ease: EASE }}
          />
          {/* Outline revealed left-to-right by the wave. */}
          <motion.span
            className="absolute inset-0 rounded-[26px] border-2"
            style={{ borderColor: outlineColor, boxShadow: outlineShadow }}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0 round 26px)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              clipPath: [
                "inset(0 100% 0 0 round 26px)",
                "inset(0 0% 0 0 round 26px)",
                "inset(0 0% 0 0 round 26px)",
                "inset(0 0% 0 0 round 26px)",
              ],
            }}
            transition={{ duration: 1.25, delay: 0.15, times: [0, 0.45, 0.78, 1], ease: EASE }}
          />
        </>
      ) : (
        <>
          {/* Outline that lights up as the fragments draw the card boundary. */}
          <motion.span
            className="absolute inset-0 rounded-[26px] border-2"
            style={{ borderColor: outlineColor, boxShadow: outlineShadow }}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: [0, 1, 1, 0.85, 0], scale: [1.06, 1, 1, 1, 1.01] }}
            transition={{ duration: 1.3, delay: 0.28, times: [0, 0.26, 0.6, 0.82, 1], ease: EASE }}
          />

          {FRAGMENTS.map((fragment, index) => {
            const startX = isStar
              ? -(72 + (index % 4) * 16)
              : isRocket
                ? fragment.dx * 2.2
                : fragment.dx * 1.35;
            const startY = isStar
              ? -(68 + (index % 3) * 16)
              : isRocket
                ? fragment.dy * 2.2
                : fragment.dy * 1.35;
            const duration = isRocket ? 0.85 : 0.72;
            const delay = 0.05 + index * 0.025;

            return (
              <motion.span
                key={index}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  left: fragment.left,
                  top: fragment.top,
                  marginLeft: -3,
                  marginTop: -3,
                  background: fragment.gold ? GOLD : BLUE,
                  boxShadow: "0 0 10px 2px rgba(255,255,255,0.6)",
                }}
                initial={{ x: startX, y: startY, opacity: 0, scale: 0.4 }}
                animate={{
                  x: isRocket ? [startX, -fragment.dx * 0.12, 0] : 0,
                  y: isRocket ? [startY, -fragment.dy * 0.12, 0] : 0,
                  opacity: [0, 1, 0.9, 0],
                  scale: [0.4, 1, 0.7, 0.2],
                }}
                transition={{
                  x: isRocket
                    ? { duration, delay, times: [0, 0.65, 1], ease: EASE }
                    : { duration, delay, ease: EASE },
                  y: isRocket
                    ? { duration, delay, times: [0, 0.65, 1], ease: EASE }
                    : { duration, delay, ease: EASE },
                  opacity: { duration, delay, times: [0, 0.4, 0.7, 1] },
                  scale: { duration, delay, times: [0, 0.4, 0.7, 1], ease: EASE },
                }}
              />
            );
          })}

          {/* Shooting star: bright impact flash as the panel locks in. */}
          {isStar && (
            <motion.span
              className="absolute inset-0 rounded-[26px] bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.45, delay: 0.5, ease: EASE }}
            />
          )}

          {/* Rocket: ignition flash + shockwave expanding from the centre. */}
          {isRocket && (
            <>
              <motion.span
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.92), rgba(201,162,39,0.5) 45%, transparent 72%)",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0.95, 0], scale: [0.3, 1.7, 2.1] }}
                transition={{ duration: 0.75, delay: 0.42, ease: EASE }}
              />
              <motion.span
                className="absolute left-1/2 top-1/2 h-12 w-16 -translate-x-1/2 -translate-y-1/2 rounded-[20px] border-2"
                style={{ borderColor: "rgba(201,162,39,0.8)" }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.4, 7] }}
                transition={{ duration: 0.85, delay: 0.46, ease: EASE }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function Badge({ tone }: { tone: "onImage" | "onCard" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm",
        tone === "onImage"
          ? "border border-[rgba(201,162,39,0.55)] bg-[rgba(7,21,37,0.55)] text-[#f4d77a]"
          : "border border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.1)] text-[#96740f]",
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
      Nouvelle formation
    </span>
  );
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
    "group/cta inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1d5eb0] via-[#2b7fd4] to-[#1a6bc4] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_22px_rgba(29,94,176,0.35)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2";

  const content = (
    <>
      {text}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="transition-transform duration-300 group-hover/cta:translate-x-0.5"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  if (!text) return null;

  if (!interactive) {
    return (
      <span className={classes} aria-hidden>
        {content}
      </span>
    );
  }

  const isInternal = url.startsWith("/");

  if (isInternal) {
    return (
      <Link href={url || "/"} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  );
}

export function AnnouncementCard({
  announcement,
  image = null,
  onClose,
  interactive = true,
  reveal = "none",
  className,
}: AnnouncementCardProps) {
  const materialize = reveal === "materialize";
  const mode: RevealMode = materialize ? announcement.animationType : null;
  const panel = cardReveal(mode);

  return (
    <div className={cn("relative isolate", className)}>
      {/* Ambient depth halo — static, behind the card. */}
      <div
        aria-hidden
        className="absolute -inset-5 -z-10 rounded-[40px] bg-[radial-gradient(62%_62%_at_50%_22%,rgba(43,127,212,0.42),transparent_70%),radial-gradient(55%_55%_at_82%_92%,rgba(201,162,39,0.34),transparent_70%)] blur-3xl"
      />

      {mode && <Assembly mode={mode} />}

      {/* The whole announcement reveals here as one object. */}
      <motion.div
        className="relative overflow-hidden rounded-[26px] border border-white/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.94)_0%,rgba(244,249,255,0.9)_55%,rgba(255,250,240,0.94)_100%)] shadow-[0_24px_60px_-12px_rgba(7,21,37,0.4),0_8px_24px_rgba(43,127,212,0.12)] ring-1 ring-[rgba(7,21,37,0.06)] backdrop-blur-xl"
        role="region"
        aria-label="Annonce LT Protect Formation"
        {...panel}
      >
        {/* Glossy top highlight for the glass feel. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
        />

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer l'annonce"
            className="absolute right-3 top-3 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-slate-900/45 text-white backdrop-blur-md transition-colors hover:bg-slate-900/65"
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

        {image && (
          <div className="px-2.5 pt-2.5">
            <div className="relative h-28 w-full overflow-hidden rounded-[18px] ring-1 ring-black/10 sm:h-32">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,21,37,0.72)_0%,rgba(7,21,37,0.15)_55%,rgba(7,21,37,0.04)_100%)]" />
              <div className="absolute bottom-2.5 left-3">
                <Badge tone="onImage" />
              </div>
            </div>
          </div>
        )}

        <div className={cn("relative px-5 pb-5 md:px-6", image ? "pt-3.5" : "pt-6 md:pt-7")}>
          {!image && <Badge tone="onCard" />}

          <h3
            className={cn(
              "pr-6 text-lg font-semibold leading-snug tracking-[-0.01em] text-[#071525]",
              image ? "mt-0" : "mt-3",
            )}
          >
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
      </motion.div>
    </div>
  );
}
