"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface TrainingPhotoProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  overlay?: "cinematic" | "soft" | "editorial" | "hero";
  priority?: boolean;
  sizes?: string;
  kenBurns?: boolean;
  children?: React.ReactNode;
}

const overlays = {
  cinematic:
    "bg-[linear-gradient(to_top,rgba(7,21,37,0.9)_0%,rgba(7,21,37,0.4)_40%,rgba(29,94,176,0.08)_100%)]",
  soft: "bg-[linear-gradient(to_top,rgba(7,21,37,0.75)_0%,rgba(7,21,37,0.2)_50%,transparent_100%)]",
  editorial:
    "bg-[linear-gradient(135deg,rgba(7,21,37,0.8)_0%,rgba(29,94,176,0.15)_45%,rgba(201,162,39,0.12)_100%)]",
  hero: "bg-[linear-gradient(105deg,rgba(7,21,37,0.9)_0%,rgba(7,21,37,0.55)_38%,rgba(29,94,176,0.12)_65%,rgba(201,162,39,0.06)_100%)]",
};

export function TrainingPhoto({
  src,
  alt,
  className,
  imageClassName,
  overlay = "cinematic",
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  kenBurns = false,
  children,
}: TrainingPhotoProps) {
  return (
    <div className={cn("group relative h-full w-full overflow-hidden bg-navy-950", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover",
          kenBurns ? "ken-burns" : "transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]",
          imageClassName,
        )}
      />
      <div className={cn("pointer-events-none absolute inset-0", overlays[overlay])} />
      <div className="premium-noise pointer-events-none absolute inset-0 opacity-[0.14]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(43,127,212,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_85%,rgba(201,162,39,0.08),transparent_50%)]" />
      {children}
    </div>
  );
}
