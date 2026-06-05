"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function normalizeStatMetric(value: string): string {
  return value.replace(/\s+(?=%)/g, "\u00A0");
}

interface StatMetricProps {
  value: string;
  className?: string;
  size?: "default" | "compact";
  animate?: boolean;
  duration?: number;
}

function useMobileViewport(maxWidth = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [maxWidth]);

  return isMobile;
}

export function StatMetric({
  value,
  className,
  size = "default",
  animate = true,
  duration,
}: StatMetricProps) {
  const isMobile = useMobileViewport();
  const sizeClass =
    size === "compact"
      ? "text-[clamp(1.2rem,2.2vw,1.75rem)]"
      : "text-[clamp(1.35rem,2.6vw,2.25rem)]";

  const normalizedValue = normalizeStatMetric(value);
  const shouldAnimate = animate && !isMobile;

  return (
    <p
      className={cn(
        "inline-grid whitespace-nowrap font-bold tabular-nums tracking-tight",
        sizeClass,
        className,
      )}
    >
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {normalizedValue}
      </span>
      <AnimatedNumber
        value={normalizedValue}
        animate={shouldAnimate}
        duration={duration}
        className="col-start-1 row-start-1"
      />
    </p>
  );
}
