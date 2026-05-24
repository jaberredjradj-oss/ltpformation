"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function Card({ children, className, delay = 0, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.8, delay, ease: easeCinematic }}
      whileHover={hover ? { y: -2, transition: { duration: 0.4, ease: easeCinematic } } : undefined}
      className={cn("refined-card", className)}
    >
      {children}
    </motion.div>
  );
}
