"use client";

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

export function StatMetric({
  value,
  className,
  size = "default",
  animate = true,
  duration,
}: StatMetricProps) {
  const sizeClass =
    size === "compact"
      ? "text-[clamp(1.2rem,2.2vw,1.75rem)]"
      : "text-[clamp(1.35rem,2.6vw,2.25rem)]";

  const normalizedValue = normalizeStatMetric(value);

  return (
    <p
      className={cn(
        "whitespace-nowrap font-bold tabular-nums tracking-tight",
        sizeClass,
        className,
      )}
    >
      <AnimatedNumber
        value={normalizedValue}
        animate={animate}
        duration={duration}
        className="inline-block"
      />
    </p>
  );
}
