import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={cn("shrink-0", filled ? "text-gold-500" : "text-slate-200", className)}
      fill="currentColor"
    >
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
    </svg>
  );
}

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  const rounded = Math.round(Math.min(max, Math.max(0, rating)) * 2) / 2;
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} sur ${max} étoiles`}
    >
      {Array.from({ length: max }).map((_, index) => (
        <StarIcon key={index} filled={index < rounded} className={iconClass} />
      ))}
    </div>
  );
}
