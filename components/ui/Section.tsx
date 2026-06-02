import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "white" | "surface" | "prestige";
  wash?: "none" | "blue" | "gold" | "blend" | "surface";
  size?: "default" | "compact" | "spacious";
}

const variants = {
  white: "bg-white",
  surface: "bg-surface",
  prestige: "section-prestige",
};

const washes = {
  none: "",
  blue: "section-wash-blue",
  gold: "section-wash-gold",
  blend: "section-wash-blend",
  surface: "section-wash-surface",
};

const sizes = {
  default: "py-12 sm:py-14 md:py-24 lg:py-28",
  compact: "py-10 sm:py-12 md:py-16",
  spacious: "py-14 sm:py-16 md:py-28 lg:py-32",
};

export function Section({
  id,
  children,
  className,
  variant = "white",
  wash = "none",
  size = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        sizes[size],
        wash !== "none" ? washes[wash] : variants[variant],
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
