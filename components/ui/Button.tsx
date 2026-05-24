"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "btn-luxury btn-luxury-primary text-white focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2",
  secondary:
    "btn-luxury bg-navy-950 text-white hover:bg-navy-900 shadow-[0_4px_20px_rgba(7,21,37,0.25)] focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2",
  outline:
    "btn-luxury btn-luxury-outline border border-slate-300/90 text-navy-950 bg-white hover:border-blue-400/60 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300/50 focus-visible:ring-offset-2",
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-[-0.01em]",
    variants[variant],
    className,
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ ease: easeCinematic, duration: 0.5 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ ease: easeCinematic, duration: 0.5 }}
      className="inline-block"
    >
      <Link href={href} className={classes}>
        {children}
      </Link>
    </motion.div>
  );
}
