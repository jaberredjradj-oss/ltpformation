"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SiteAnnouncement } from "@/lib/announcements/types";
import type { AnnouncementImage } from "@/lib/announcements/formation-image";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { AnnouncementIntro } from "@/components/announcement/AnnouncementIntro";

const DISMISS_STORAGE_KEY = "ltpf-announcement-dismissed";

type Phase = "hidden" | "intro" | "card";

function dismissSignature(announcement: SiteAnnouncement): string {
  return `${announcement.id}:${announcement.updatedAt}`;
}

function readDismissed(): string | null {
  try {
    return window.localStorage.getItem(DISMISS_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeDismissed(signature: string): void {
  try {
    window.localStorage.setItem(DISMISS_STORAGE_KEY, signature);
  } catch {
    // Storage unavailable (private mode) — fail silently.
  }
}

export function AnnouncementBanner({
  announcement,
  image = null,
}: {
  announcement: SiteAnnouncement;
  image?: AnnouncementImage | null;
}) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const prefersReducedMotion = useReducedMotion();
  const playIntro = !prefersReducedMotion && announcement.animationType !== "none";

  const close = useCallback(() => {
    setPhase("hidden");
    writeDismissed(dismissSignature(announcement));
  }, [announcement]);

  useEffect(() => {
    if (readDismissed() === dismissSignature(announcement)) {
      return;
    }

    const delay = Math.max(0, announcement.displayDelay);
    const startTimer = window.setTimeout(() => {
      setPhase(playIntro ? "intro" : "card");
    }, delay);

    return () => window.clearTimeout(startTimer);
  }, [announcement, playIntro]);

  useEffect(() => {
    if (phase !== "card" || announcement.displayDuration <= 0) {
      return;
    }

    const hideTimer = window.setTimeout(
      () => setPhase("hidden"),
      announcement.displayDuration,
    );

    return () => window.clearTimeout(hideTimer);
  }, [phase, announcement.displayDuration]);

  return (
    <>
      {phase === "intro" && (
        <div className="pointer-events-none fixed inset-0 z-[59] overflow-hidden">
          <AnnouncementIntro
            type={announcement.animationType}
            anchor="bottom-right"
            onDone={() => setPhase("card")}
          />
        </div>
      )}

      <AnimatePresence>
        {phase === "card" && (
          <motion.div
            className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0"
            initial={
              // When materializing, the card assembles itself — the outer
              // container stays in place so it doesn't fight the build-up.
              playIntro
                ? false
                : prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24, scale: 0.94, filter: "blur(10px)" }
            }
            animate={
              playIntro
                ? undefined
                : prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }
            }
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnnouncementCard
              announcement={announcement}
              image={image}
              reveal={playIntro ? "materialize" : "none"}
              onClose={close}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
