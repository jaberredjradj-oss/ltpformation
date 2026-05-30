import type { GoogleReview } from "@/lib/reviews/types";
import { GoogleReviewBadge } from "@/components/reviews/GoogleReviewBadge";
import { StarRating } from "@/components/reviews/StarRating";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: GoogleReview;
  className?: string;
}

function formatReviewDate(iso?: string): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const dateLabel = formatReviewDate(review.date);

  return (
    <article
      className={cn(
        "refined-card flex h-full min-h-[220px] min-w-[min(100%,320px)] flex-col p-5 sm:min-w-[300px] md:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy-950">{review.authorName}</p>
          <StarRating rating={review.rating} size="sm" className="mt-2" />
        </div>
        <GoogleReviewBadge />
      </div>

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-body-strong">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      {dateLabel && (
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400">
          {dateLabel}
        </p>
      )}
    </article>
  );
}
