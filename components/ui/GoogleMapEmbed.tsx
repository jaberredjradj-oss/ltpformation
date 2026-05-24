import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface GoogleMapEmbedProps {
  className?: string;
}

export function GoogleMapEmbed({ className }: GoogleMapEmbedProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200/80 shadow-[var(--shadow-soft)]",
        "h-[220px] min-[480px]:h-[260px] md:h-[300px] lg:h-[320px]",
        className,
      )}
    >
      <iframe
        title="Localisation LT Protect Formation"
        src={SITE.address.mapsEmbedUrl}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
