"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SiteAnnouncement } from "@/lib/announcements/types";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";

const DISMISS_STORAGE_KEY = "ltpf-announcement-dismissed";

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
}: {
  announcement: SiteAnnouncement;
}) {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const close = useCallback(() => {
    setVisible(false);
    writeDismissed(dismissSignature(announcement));
  }, [announcement]);

  useEffect(() => {
    if (readDismissed() === dismissSignature(announcement)) {
      return;
    }

    const delay = Math.max(0, announcement.displayDelay);
    const showTimer = window.setTimeout(() => setVisible(true), delay);

    return () => window.clearTimeout(showTimer);
  }, [announcement]);

  useEffect(() => {
    if (!visible || announcement.displayDuration <= 0) {
      return;
    }

    const hideTimer = window.setTimeout(
      () => setVisible(false),
      announcement.displayDuration,
    );

    return () => window.clearTimeout(hideTimer);
  }, [visible, announcement.displayDuration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 24, scale: 0.98 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16, scale: 0.98 }
          }
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnnouncementCard announcement={announcement} onClose={close} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
