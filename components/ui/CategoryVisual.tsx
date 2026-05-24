import { cn } from "@/lib/utils";
import {
  CATEGORY_VISUAL_THEMES,
  type CategoryVisualTheme,
} from "@/lib/category-visuals";
import { THEME_IMAGES } from "@/lib/training-images";
import { TrainingPhoto } from "./TrainingPhoto";

interface CategoryVisualProps {
  theme: CategoryVisualTheme;
  label: string;
  subtitle?: string;
  className?: string;
  featured?: boolean;
  image?: string;
  hideLabels?: boolean;
}

export function CategoryVisual({
  theme,
  label,
  subtitle,
  className,
  featured = false,
  image,
  hideLabels = false,
}: CategoryVisualProps) {
  const config = CATEGORY_VISUAL_THEMES[theme];
  const photoSrc = image ?? THEME_IMAGES[theme];

  return (
    <TrainingPhoto
      src={photoSrc}
      alt={label}
      overlay={featured ? "editorial" : "cinematic"}
      className={className}
      sizes={featured ? "(max-width: 768px) 100vw, 640px" : "(max-width: 768px) 50vw, 320px"}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl",
          config.glow,
        )}
      />

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <div className="glass-chip flex h-11 w-11 items-center justify-center rounded-xl">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
              aria-hidden
            >
              <path d={config.icon} />
            </svg>
          </div>
          <span className="h-1 w-8 rounded-full bg-gradient-to-r from-gold-400 to-blue-400 opacity-80" />
        </div>

        <div>
          {!hideLabels && subtitle && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300/90">
              {subtitle}
            </p>
          )}
          {!hideLabels && (
            <p
              className={cn(
                "font-semibold text-white drop-shadow-sm",
                featured ? "text-lg md:text-xl" : "text-sm",
              )}
            >
              {label}
            </p>
          )}
        </div>
      </div>
    </TrainingPhoto>
  );
}
