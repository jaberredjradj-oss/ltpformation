"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  easeOutCubic,
  formatAnimatedNumber,
  parseAnimatedNumber,
} from "@/lib/animated-number";

export interface AnimatedNumberProps {
  value: string | number;
  className?: string;
  duration?: number;
  animate?: boolean;
  locale?: string;
}

export function AnimatedNumber({
  value,
  className,
  duration = 1800,
  animate = true,
  locale = "fr-FR",
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const parsed = parseAnimatedNumber(value);
  const finalText = parsed?.displayValue ?? String(value);
  const zeroText =
    parsed && animate
      ? formatAnimatedNumber(0, {
          decimals: parsed.decimals,
          prefix: parsed.prefix,
          suffix: parsed.suffix,
          locale,
        })
      : finalText;
  const [display, setDisplay] = useState(zeroText);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!parsed || !animate || prefersReducedMotion !== false) {
      setDisplay(finalText);
      return;
    }

    setDisplay(zeroText);
  }, [animate, finalText, parsed, prefersReducedMotion, zeroText]);

  useEffect(() => {
    if (!parsed || !animate) {
      return;
    }

    if (prefersReducedMotion !== false) {
      setDisplay(finalText);
      return;
    }

    if (!isInView || hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);

      setDisplay(
        formatAnimatedNumber(eased * parsed.end, {
          decimals: parsed.decimals,
          prefix: parsed.prefix,
          suffix: parsed.suffix,
          locale,
        }),
      );

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [animate, duration, finalText, isInView, locale, parsed, prefersReducedMotion]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}

export { AnimatedNumber as CountUpNumber };
