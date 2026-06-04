import { cn } from "@/lib/utils";

interface InstallmentBadgeProps {
  className?: string;
}

const BADGE_LABEL = "Payable en 3 fois sans frais";

/** Vector badge at 26px display height (matches prior layout footprint). */
const VIEWBOX_WIDTH = 352;
const VIEWBOX_HEIGHT = 52;

export function InstallmentBadge({ className }: InstallmentBadgeProps) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center leading-none", className)}
      aria-label={BADGE_LABEL}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="block h-[26px] w-auto max-w-none"
        role="img"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{BADGE_LABEL}</title>
        <rect
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          rx={VIEWBOX_HEIGHT / 2}
          fill="#FFE047"
        />
        <g
          transform="translate(12 19)"
          stroke="#0f172a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="22" height="14" rx="2.5" />
          <path d="M0 5h22" />
          <circle cx="5" cy="10" r="1.25" fill="#0f172a" stroke="none" />
          <circle cx="9" cy="10" r="1.25" fill="#0f172a" stroke="none" />
        </g>
        <text
          x="42"
          y={VIEWBOX_HEIGHT / 2}
          fill="#0f172a"
          fontSize="17"
          fontWeight="600"
          fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
          dominantBaseline="central"
        >
          {BADGE_LABEL}
        </text>
      </svg>
    </span>
  );
}
