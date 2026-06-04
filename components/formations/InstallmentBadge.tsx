import Image from "next/image";
import {
  INSTALLMENT_BADGE_HEIGHT,
  INSTALLMENT_BADGE_SRC,
  INSTALLMENT_BADGE_WIDTH,
} from "@/lib/formations/payment";
import { cn } from "@/lib/utils";

interface InstallmentBadgeProps {
  className?: string;
}

/** Display height aligned with the former text pill (`py-1` + `text-[10px]`). */
const BADGE_DISPLAY_HEIGHT_PX = 26;

export function InstallmentBadge({ className }: InstallmentBadgeProps) {
  const displayWidth = Math.round(
    (BADGE_DISPLAY_HEIGHT_PX / INSTALLMENT_BADGE_HEIGHT) * INSTALLMENT_BADGE_WIDTH,
  );

  return (
    <span
      className={cn("inline-flex shrink-0 items-center leading-none", className)}
      style={{ height: BADGE_DISPLAY_HEIGHT_PX }}
    >
      <Image
        src={INSTALLMENT_BADGE_SRC}
        alt="Paiement en 3 fois sans frais"
        width={displayWidth}
        height={BADGE_DISPLAY_HEIGHT_PX}
        sizes={`${displayWidth}px`}
        quality={100}
        className="block h-[26px] w-auto max-w-none object-contain"
      />
    </span>
  );
}
