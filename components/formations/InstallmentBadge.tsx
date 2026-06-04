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

export function InstallmentBadge({ className }: InstallmentBadgeProps) {
  return (
    <span className={cn("inline-flex max-w-full shrink-0", className)}>
      <Image
        src={INSTALLMENT_BADGE_SRC}
        alt="Paiement en 3 fois sans frais"
        width={INSTALLMENT_BADGE_WIDTH}
        height={INSTALLMENT_BADGE_HEIGHT}
        sizes="(max-width: 640px) 220px, 280px"
        quality={100}
        className="h-6 w-auto max-w-full object-contain object-left sm:h-7 md:h-8"
      />
    </span>
  );
}
