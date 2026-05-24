import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 1536;

type BrandLogoSize = "nav" | "footer" | "hero" | "about";

const sizes: Record<
  BrandLogoSize,
  { height: string; heightPx: number; maxW: string; glow: string }
> = {
  nav: {
    height: "h-[100px] sm:h-[116px] md:h-[132px] lg:h-[140px]",
    heightPx: 140,
    maxW: "max-w-[340px] sm:max-w-[380px] md:max-w-[420px]",
    glow: "logo-glow-nav",
  },
  footer: {
    height: "h-[96px] sm:h-[108px] md:h-[120px] lg:h-[128px]",
    heightPx: 128,
    maxW: "max-w-[300px] sm:max-w-[340px] md:max-w-[380px]",
    glow: "logo-glow-footer",
  },
  hero: {
    height: "h-36 sm:h-44 md:h-52 lg:h-56",
    heightPx: 224,
    maxW: "max-w-[400px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[560px]",
    glow: "logo-glow-footer",
  },
  about: {
    height: "h-28 md:h-32",
    heightPx: 128,
    maxW: "max-w-[220px]",
    glow: "logo-glow-nav",
  },
};

interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ size = "nav", className, priority }: BrandLogoProps) {
  const dim = sizes[size];
  const displayWidth = Math.round(dim.heightPx * (LOGO_WIDTH / LOGO_HEIGHT));

  return (
    <span className={cn("relative inline-flex shrink-0 items-center", className)}>
      <span
        className={cn("pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full blur-2xl", dim.glow)}
        aria-hidden
      />
      <Image
        src={SITE.logo}
        alt={SITE.name}
        width={displayWidth}
        height={dim.heightPx}
        priority={priority}
        unoptimized
        className={cn(
          dim.height,
          "relative w-auto object-contain object-left",
          dim.maxW,
          "drop-shadow-[0_4px_20px_rgba(11,31,58,0.18)]",
          "transition-transform duration-500 ease-out hover:scale-[1.02]",
        )}
      />
    </span>
  );
}
