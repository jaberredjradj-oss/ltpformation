import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 556;

type BrandLogoSize = "nav" | "footer" | "hero" | "about";

const imageSizes: Record<BrandLogoSize, string> = {
  nav: "(max-width: 640px) 150px, (max-width: 768px) 184px, (max-width: 1024px) 219px, 242px",
  footer: "(max-width: 640px) 173px, (max-width: 768px) 196px, 219px",
  hero: "(max-width: 640px) 288px, (max-width: 768px) 331px, (max-width: 1024px) 374px, 403px",
  about: "158px",
};

const sizes: Record<
  BrandLogoSize,
  { height: string; heightPx: number; maxW: string; glow: string }
> = {
  nav: {
    height: "h-[44px] sm:h-[54px] md:h-[67px] lg:h-[81px]",
    heightPx: 81,
    maxW: "max-w-[150px] sm:max-w-[184px] md:max-w-[219px] lg:max-w-[242px]",
    glow: "logo-glow-nav",
  },
  footer: {
    height: "h-[55px] sm:h-[62px] md:h-[69px] lg:h-[74px]",
    heightPx: 74,
    maxW: "max-w-[173px] sm:max-w-[196px] md:max-w-[219px]",
    glow: "logo-glow-footer",
  },
  hero: {
    height: "h-[104px] sm:h-[126px] md:h-[149px] lg:h-[161px]",
    heightPx: 161,
    maxW: "max-w-[288px] sm:max-w-[331px] md:max-w-[374px] lg:max-w-[403px]",
    glow: "logo-glow-footer",
  },
  about: {
    height: "h-[81px] md:h-[92px]",
    heightPx: 92,
    maxW: "max-w-[158px]",
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
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full opacity-40 blur-2xl",
          dim.glow,
        )}
        aria-hidden
      />
      <Image
        src={SITE.logo}
        alt={SITE.name}
        width={displayWidth}
        height={dim.heightPx}
        priority={priority}
        sizes={imageSizes[size]}
        className={cn(
          dim.height,
          "relative w-auto object-contain object-left",
          dim.maxW,
          "drop-shadow-[0_2px_10px_rgba(11,31,58,0.1)]",
          "transition-transform duration-500 ease-out hover:scale-[1.02]",
        )}
      />
    </span>
  );
}
