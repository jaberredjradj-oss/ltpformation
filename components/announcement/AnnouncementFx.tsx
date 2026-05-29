"use client";

import { motion } from "framer-motion";
import type { AnnouncementAnimationType } from "@/lib/announcements/types";

const easeCinematic = [0.16, 1, 0.3, 1] as const;

function GlowSweep() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: "420%", opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, delay: 0.35, ease: easeCinematic }}
    />
  );
}

function ShootingStar() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-[8%] top-[14%] h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_10px_3px_rgba(201,162,39,0.8)]"
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ x: ["0%", "260%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
      transition={{ duration: 1.1, delay: 0.3, ease: easeCinematic }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(201,162,39,0))",
      }}
    />
  );
}

function Particles() {
  const dots = [
    { left: "18%", delay: 0.2 },
    { left: "38%", delay: 0.45 },
    { left: "58%", delay: 0.3 },
    { left: "78%", delay: 0.55 },
    { left: "88%", delay: 0.4 },
  ];

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((dot, index) => (
        <motion.span
          key={index}
          className="absolute bottom-2 h-1 w-1 rounded-full bg-[rgba(201,162,39,0.85)] shadow-[0_0_6px_1px_rgba(43,127,212,0.5)]"
          style={{ left: dot.left }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -42, opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, delay: dot.delay, ease: easeCinematic }}
        />
      ))}
    </span>
  );
}

function Rocket() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute bottom-2 left-4 text-[rgba(43,127,212,0.85)]"
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: -18, opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, delay: 0.3, ease: easeCinematic }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2c3.5 2 5 5.5 5 9 0 1.6-.5 3.1-1.3 4.4L12 19l-3.7-3.6C7.5 14.1 7 12.6 7 11c0-3.5 1.5-7 5-9z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </motion.span>
  );
}

export function AnnouncementFx({
  type,
}: {
  type: AnnouncementAnimationType;
}) {
  switch (type) {
    case "glow-sweep":
      return <GlowSweep />;
    case "shooting-star":
      return <ShootingStar />;
    case "particles":
      return <Particles />;
    case "rocket":
      return <Rocket />;
    case "none":
    default:
      return null;
  }
}
