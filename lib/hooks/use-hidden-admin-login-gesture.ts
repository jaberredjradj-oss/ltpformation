"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const REQUIRED_CLICKS = 5;
const WINDOW_MS = 3000;
const SINGLE_CLICK_DELAY_MS = 300;

export function useHiddenAdminLoginGesture() {
  const router = useRouter();
  const clickTimestampsRef = useRef<number[]>([]);
  const singleClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (singleClickTimerRef.current) {
        clearTimeout(singleClickTimerRef.current);
      }
    };
  }, []);

  const handleLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      const now = Date.now();
      clickTimestampsRef.current = clickTimestampsRef.current.filter(
        (timestamp) => now - timestamp < WINDOW_MS,
      );
      clickTimestampsRef.current.push(now);

      if (singleClickTimerRef.current) {
        clearTimeout(singleClickTimerRef.current);
        singleClickTimerRef.current = null;
      }

      if (clickTimestampsRef.current.length >= REQUIRED_CLICKS) {
        clickTimestampsRef.current = [];
        router.push("/admin/login");
        return;
      }

      if (clickTimestampsRef.current.length === 1) {
        singleClickTimerRef.current = setTimeout(() => {
          if (clickTimestampsRef.current.length === 1) {
            router.push("/");
          }
          clickTimestampsRef.current = [];
          singleClickTimerRef.current = null;
        }, SINGLE_CLICK_DELAY_MS);
      }
    },
    [router],
  );

  return handleLogoClick;
}
