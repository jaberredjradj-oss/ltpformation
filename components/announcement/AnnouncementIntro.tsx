"use client";

import { useEffect } from "react";
import { motion, type Easing } from "framer-motion";
import type { AnnouncementAnimationType } from "@/lib/announcements/types";

const ease = [0.16, 1, 0.3, 1] as const;

type AnchorKey = "bottom-right" | "center";

const ANCHORS: Record<AnchorKey, { left: string; top: string }> = {
  "bottom-right": { left: "80%", top: "82%" },
  center: { left: "50%", top: "50%" },
};

export const INTRO_DURATIONS: Record<AnnouncementAnimationType, number> = {
  "shooting-star": 2900,
  "glow-sweep": 2800,
  particles: 3000,
  rocket: 3100,
  none: 0,
};

interface AnnouncementIntroProps {
  type: AnnouncementAnimationType;
  anchor?: AnchorKey;
  onDone: () => void;
}

/** Radiating spark lines for a "launch" feel at the impact point. */
function Sparks({
  left,
  top,
  delay,
  count = 7,
}: {
  left: string;
  top: string;
  delay: number;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const angle = (360 / count) * index;
        return (
          <motion.span
            key={index}
            aria-hidden
            className="absolute h-[2px] w-40 rounded-full"
            style={{
              left,
              top,
              transformOrigin: "0% 50%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(201,162,39,0))",
            }}
            initial={{ rotate: angle, scaleX: 0, opacity: 0 }}
            animate={{ rotate: angle, scaleX: [0, 1, 0.4], opacity: [0, 1, 0] }}
            transition={{ duration: 0.75, delay, ease }}
          />
        );
      })}
    </>
  );
}

/** Luminous flash + expanding rings landing on the card anchor. */
function Burst({
  left,
  top,
  delay,
  scale = 3.5,
  sparks = false,
}: {
  left: string;
  top: string;
  delay: number;
  scale?: number;
  sparks?: boolean;
}) {
  return (
    <>
      {/* Soft wide bloom */}
      <motion.span
        aria-hidden
        className="absolute h-80 w-80 rounded-full blur-3xl"
        style={{
          left,
          top,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.6), rgba(96,170,240,0.35) 45%, transparent 72%)",
        }}
        initial={{ x: "-50%", y: "-50%", scale: 0.2, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.2, scale], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.05, delay, ease }}
      />
      {/* Hot core flash */}
      <motion.span
        aria-hidden
        className="absolute h-10 w-10 rounded-full"
        style={{
          left,
          top,
          background:
            "radial-gradient(circle, rgba(255,255,255,1), rgba(201,162,39,0.7) 45%, transparent 72%)",
        }}
        initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0, scale], opacity: [0, 1, 0] }}
        transition={{ duration: 0.75, delay, ease }}
      />
      {/* Blue shockwave ring */}
      <motion.span
        aria-hidden
        className="absolute h-14 w-14 rounded-full border-2"
        style={{ left, top, borderColor: "rgba(96,170,240,0.85)" }}
        initial={{ x: "-50%", y: "-50%", scale: 0.2, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.2, scale + 3.2], opacity: [1, 0] }}
        transition={{ duration: 1.05, delay, ease }}
      />
      {/* Gold shockwave ring */}
      <motion.span
        aria-hidden
        className="absolute h-10 w-10 rounded-full border"
        style={{ left, top, borderColor: "rgba(201,162,39,0.8)" }}
        initial={{ x: "-50%", y: "-50%", scale: 0.2, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.2, scale + 4.4], opacity: [0.9, 0] }}
        transition={{ duration: 1.15, delay: delay + 0.07, ease }}
      />
      {sparks && <Sparks left={left} top={top} delay={delay + 0.02} />}
    </>
  );
}

const SPREAD_DOTS = [
  { dx: -140, dy: -98 },
  { dx: 136, dy: -108 },
  { dx: -168, dy: 18 },
  { dx: 162, dy: 28 },
  { dx: -78, dy: 132 },
  { dx: 84, dy: 126 },
  { dx: 0, dy: -160 },
  { dx: 16, dy: 158 },
];

/** Particles bursting outward from the impact — the energy that "reveals" the card. */
function Spread({
  left,
  top,
  delay,
}: {
  left: string;
  top: string;
  delay: number;
}) {
  return (
    <>
      {SPREAD_DOTS.map((dot, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="absolute h-2 w-2 rounded-full"
          style={{
            left,
            top,
            marginLeft: -4,
            marginTop: -4,
            background:
              index % 2 === 0 ? "rgba(201,162,39,0.98)" : "rgba(96,170,240,0.98)",
            boxShadow: "0 0 10px 2px rgba(255,255,255,0.6)",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: dot.dx, y: dot.dy, opacity: [0, 1, 0], scale: [0.4, 1, 0.2] }}
          transition={{ duration: 0.85, delay, ease }}
        />
      ))}
    </>
  );
}

function ShootingStar({ anchor }: { anchor: { left: string; top: string } }) {
  // Crosses the viewport from far off-screen into the card anchor.
  const START = { left: "-22%", top: "-42%" };
  const tail = [0.04, 0.09, 0.15, 0.22, 0.3, 0.38, 0.48];
  const travel = 1.65;

  return (
    <>
      {/* Brief sky wash as the comet crosses — visible before the card. */}
      <motion.span
        aria-hidden
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 30% 20%, rgba(96,170,240,0.22), transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0] }}
        transition={{ duration: 1.4, delay: 0.35, ease }}
      />

      {tail.map((delay, index) => (
        <motion.span
          key={`tail-${index}`}
          aria-hidden
          className="absolute rounded-full blur-[3px]"
          style={{
            width: 22 - index * 2,
            height: 22 - index * 2,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95), rgba(96,170,240,0.5) 50%, transparent 75%)",
          }}
          initial={{ left: START.left, top: START.top, x: "-50%", y: "-50%", opacity: 0 }}
          animate={{
            left: anchor.left,
            top: anchor.top,
            x: "-50%",
            y: "-50%",
            opacity: [0, 0.9, 0],
          }}
          transition={{
            left: { duration: travel, delay, ease },
            top: { duration: travel, delay, ease },
            opacity: { duration: travel + 0.1, delay, times: [0, 0.3, 1] },
          }}
        />
      ))}

      <motion.span
        aria-hidden
        className="absolute"
        initial={{ left: START.left, top: START.top, x: "-50%", y: "-50%", opacity: 0 }}
        animate={{
          left: anchor.left,
          top: anchor.top,
          x: "-50%",
          y: "-50%",
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          left: { duration: travel, ease },
          top: { duration: travel, ease },
          opacity: { duration: travel + 0.15, times: [0, 0.08, 0.84, 1] },
        }}
      >
        <span
          className="block h-[8px] w-[min(92vw,640px)] origin-right rotate-[42deg] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(96,170,240,0.45) 20%, rgba(255,255,255,0.94) 78%, #ffffff)",
            boxShadow: "0 0 48px 12px rgba(96,170,240,0.7)",
          }}
        />
        <span
          className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white"
          style={{
            boxShadow:
              "0 0 42px 16px rgba(255,255,255,0.98), 0 0 80px 32px rgba(201,162,39,0.6)",
          }}
        />
      </motion.span>

      <Burst left={anchor.left} top={anchor.top} delay={1.52} scale={7.2} sparks />
      <Spread left={anchor.left} top={anchor.top} delay={1.6} />
    </>
  );
}

function Rocket({ anchor }: { anchor: { left: string; top: string } }) {
  const START = { left: "14%", top: "148%" };
  const LAUNCH_TOP = "128%";

  const pathLeft = [START.left, "12%", "22%", "38%", anchor.left];
  const pathTop = [START.top, "128%", "88%", "48%", anchor.top];
  const flightTimes = [0, 0.22, 0.48, 0.72, 1];
  const flightEase: Easing[] = ["easeInOut", "easeOut", "easeOut", [0.42, 0, 0.9, 0.26]];
  const flight = { duration: 2.1, times: flightTimes, ease: flightEase };

  const trail = [0.0, 0.07, 0.14, 0.21, 0.28, 0.35, 0.42, 0.49];
  const engineSparks = [
    { delay: 0.34, dx: -5 },
    { delay: 0.46, dx: 6 },
    { delay: 0.58, dx: -4 },
    { delay: 0.7, dx: 5 },
    { delay: 0.82, dx: -3 },
  ];
  const smoke = [
    { delay: 0.18, x: -6 },
    { delay: 0.34, x: 5 },
    { delay: 0.5, x: -3 },
  ];
  const spread = [
    { dx: -130, dy: -92 },
    { dx: 126, dy: -100 },
    { dx: -150, dy: 24 },
    { dx: 146, dy: 32 },
    { dx: -68, dy: 120 },
    { dx: 76, dy: 114 },
  ];

  return (
    <>
      {/* Launch pad glow — visible takeoff before the rocket rises. */}
      <motion.span
        aria-hidden
        className="absolute h-48 w-48 rounded-full blur-3xl"
        style={{
          left: START.left,
          top: LAUNCH_TOP,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9), rgba(201,162,39,0.55) 40%, transparent 70%)",
        }}
        initial={{ x: "-50%", y: "-50%", scale: 0.15, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.15, 1.3, 2.2], opacity: [0, 1, 0] }}
        transition={{ duration: 0.95, times: [0, 0.5, 1], ease }}
      />

      <motion.span
        aria-hidden
        className="absolute h-16 w-16 rounded-full border-2"
        style={{ left: START.left, top: LAUNCH_TOP, borderColor: "rgba(201,162,39,0.85)" }}
        initial={{ x: "-50%", y: "-50%", scale: 0.15, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.15, 9], opacity: [0, 0.95, 0] }}
        transition={{ duration: 1.05, delay: 0.28, ease }}
      />

      {/* 3) Lingering smoke rising from the launch area */}
      {smoke.map((puff, index) => (
        <motion.span
          key={`smoke-${index}`}
          aria-hidden
          className="absolute h-7 w-7 rounded-full blur-md"
          style={{
            left: `calc(${START.left} + ${puff.x}px)`,
            top: LAUNCH_TOP,
            background:
              "radial-gradient(circle, rgba(226,232,240,0.6), rgba(148,163,184,0.2) 60%, transparent 80%)",
          }}
          initial={{ x: "-50%", y: "-50%", scale: 0.4, opacity: 0 }}
          animate={{ x: "-50%", y: "-90%", scale: [0.4, 2.8], opacity: [0, 0.55, 0] }}
          transition={{ duration: 1.3, delay: puff.delay, ease }}
        />
      ))}

      {/* 3+4) Powerful glowing exhaust trail following the curved path */}
      {trail.map((delay, index) => (
        <motion.span
          key={`trail-${index}`}
          aria-hidden
          className="absolute h-6 w-6 rounded-full blur-[2px]"
          style={{
            background:
              index % 3 === 0
                ? "radial-gradient(circle, rgba(201,162,39,0.95), rgba(201,162,39,0) 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.98), rgba(96,170,240,0.6) 50%, transparent 75%)",
          }}
          initial={{ left: START.left, top: START.top, x: "-50%", y: "-50%", opacity: 0, scale: 0.3 }}
          animate={{ left: pathLeft, top: pathTop, opacity: [0, 0.95, 0], scale: [0.3, 2.2, 0.1] }}
          transition={{
            left: { ...flight, delay },
            top: { ...flight, delay },
            opacity: { duration: 2.1, delay, times: [0, 0.3, 1] },
            scale: { duration: 2.1, delay, ease },
          }}
        />
      ))}

      {/* Engine sparks scattering off the path */}
      {engineSparks.map((spark, index) => (
        <motion.span
          key={`spark-${index}`}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: pathLeft[1],
            top: pathTop[1],
            marginLeft: -3,
            marginTop: -3,
            background: "rgba(201,162,39,0.95)",
            boxShadow: "0 0 8px 2px rgba(255,255,255,0.6)",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
          animate={{ x: spark.dx, y: 70, opacity: [0, 1, 0], scale: [1, 0.3] }}
          transition={{ duration: 0.7, delay: spark.delay, ease }}
        />
      ))}

      {/* 2) The rocket — outer span drives the curved path */}
      <motion.span
        aria-hidden
        className="absolute"
        initial={{ left: START.left, top: START.top, x: "-50%", y: "-50%", opacity: 0 }}
        animate={{ left: pathLeft, top: pathTop, x: "-50%", y: "-50%", opacity: [0, 1, 1, 0] }}
        transition={{
          left: flight,
          top: flight,
          opacity: { duration: 2.1, times: [0, 0.1, 0.9, 1] },
        }}
        style={{ filter: "drop-shadow(0 0 32px rgba(96,170,240,0.95))" }}
      >
        {/* Inner span — vibration, slight rotation and motion blur during takeoff */}
        <motion.span
          aria-hidden
          className="relative block"
          initial={{ rotate: 42 }}
          animate={{ rotate: [41, 43], x: [-0.9, 0.9], y: [-0.7, 0.7], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
          transition={{
            rotate: { duration: 0.16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
            x: { duration: 0.12, repeat: Infinity, repeatType: "mirror" },
            y: { duration: 0.1, repeat: Infinity, repeatType: "mirror" },
            filter: { duration: 2.1, times: [0, 0.62, 1] },
          }}
        >
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-full h-52 w-3 -translate-x-1/2 origin-top rounded-full blur-[4px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.82), rgba(96,170,240,0.42) 45%, transparent)",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 0.4, 1, 0.6], opacity: [0, 0.5, 0.85, 0] }}
            transition={{ duration: 2.1, times: [0, 0.3, 0.62, 1], ease }}
          />
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-full h-16 w-5 -translate-x-1/2 origin-top rounded-b-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(201,162,39,0.92) 38%, rgba(43,127,212,0.55) 74%, transparent)",
              filter: "blur(1px)",
            }}
            initial={{ scaleY: 0.3, opacity: 0 }}
            animate={{ scaleY: [0.3, 1.3, 0.95, 1.4, 1.1], opacity: [0, 1, 1, 1, 0.85] }}
            transition={{ duration: 0.28, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          <svg width="58" height="58" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 1.5c3.4 2.2 5.1 5.7 5.1 9.4 0 1.9-.5 3.7-1.5 5.3H8.4c-1-1.6-1.5-3.4-1.5-5.3 0-3.7 1.7-7.2 5.1-9.4z"
              fill="rgba(255,255,255,0.16)"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.4" r="2" stroke="#9fc6f4" strokeWidth="1.2" />
            <path
              d="M8.4 16.2c-1.7.5-2.9 1.8-3.3 3.6 1.8-.1 3.3-.7 4.2-1.8M15.6 16.2c1.7.5 2.9 1.8 3.3 3.6-1.8-.1-3.3-.7-4.2-1.8"
              fill="rgba(201,162,39,0.18)"
              stroke="rgba(201,162,39,0.95)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.span>

      {/* 5) Arrival — particle spread bursting from the impact energy */}
      {spread.map((dot, index) => (
        <motion.span
          key={`spread-${index}`}
          aria-hidden
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: anchor.left,
            top: anchor.top,
            marginLeft: -4,
            marginTop: -4,
            background:
              index % 2 === 0 ? "rgba(201,162,39,0.98)" : "rgba(96,170,240,0.98)",
            boxShadow: "0 0 10px 2px rgba(255,255,255,0.6)",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: dot.dx, y: dot.dy, opacity: [0, 1, 0], scale: [0.4, 1, 0.2] }}
          transition={{ duration: 0.9, delay: 1.95, ease }}
        />
      ))}

      <Burst left={anchor.left} top={anchor.top} delay={1.9} scale={7.5} sparks />
    </>
  );
}

const GOLD_PARTICLE = "rgba(201,162,39,0.98)";
const BLUE_PARTICLE = "rgba(96,170,240,0.98)";

/** Start positions spread across the viewport — particles travel in to assemble. */
const PARTICLE_ORIGINS = [
  { left: "6%", top: "8%" },
  { left: "48%", top: "3%" },
  { left: "94%", top: "12%" },
  { left: "96%", top: "42%" },
  { left: "92%", top: "78%" },
  { left: "52%", top: "96%" },
  { left: "8%", top: "88%" },
  { left: "4%", top: "52%" },
  { left: "18%", top: "28%" },
  { left: "82%", top: "32%" },
  { left: "72%", top: "68%" },
  { left: "24%", top: "72%" },
  { left: "34%", top: "14%" },
  { left: "66%", top: "18%" },
  { left: "14%", top: "58%" },
  { left: "86%", top: "58%" },
  { left: "40%", top: "6%" },
  { left: "60%", top: "94%" },
];

function Particles({ anchor }: { anchor: { left: string; top: string } }) {
  const particles = PARTICLE_ORIGINS.map((origin, index) => ({
    ...origin,
    delay: index * 0.028,
    gold: index % 2 === 0,
  }));

  return (
    <>
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border-2 border-[rgba(120,185,250,0.25)]"
        style={{
          margin: "auto",
          width: "min(96vw, 720px)",
          height: "min(88vh, 640px)",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: [0, 0.55, 0], scale: [1.08, 0.92, 0.85] }}
        transition={{ duration: 1.65, ease }}
      />

      <motion.span
        aria-hidden
        className="absolute rounded-full border"
        style={{
          left: anchor.left,
          top: anchor.top,
          width: "min(72vmin, 560px)",
          height: "min(72vmin, 560px)",
          borderColor: "rgba(120,185,250,0.45)",
        }}
        initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [1, 0.2], opacity: [0, 0.65, 0] }}
        transition={{ duration: 1.6, times: [0, 0.42, 1], ease }}
      />

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="absolute h-2.5 w-2.5 rounded-full"
          style={{
            background: particle.gold ? GOLD_PARTICLE : BLUE_PARTICLE,
            boxShadow: "0 0 14px 4px rgba(96,170,240,0.6)",
          }}
          initial={{
            left: particle.left,
            top: particle.top,
            x: "-50%",
            y: "-50%",
            opacity: 0,
            scale: 0.35,
          }}
          animate={{
            left: anchor.left,
            top: anchor.top,
            x: "-50%",
            y: "-50%",
            opacity: [0, 1, 1, 0],
            scale: [0.35, 1.25, 0.35],
          }}
          transition={{
            left: { duration: 1.55, delay: particle.delay, ease },
            top: { duration: 1.55, delay: particle.delay, ease },
            opacity: { duration: 1.65, delay: particle.delay, times: [0, 0.22, 0.78, 1] },
            scale: { duration: 1.65, delay: particle.delay, ease },
          }}
        />
      ))}

      <Burst left={anchor.left} top={anchor.top} delay={1.72} scale={7} sparks />
      <Spread left={anchor.left} top={anchor.top} delay={1.8} />
    </>
  );
}

function GlowSweep({ anchor }: { anchor: { left: string; top: string } }) {
  return (
    <>
      {/* Full-viewport ambient wash as the wave crosses. */}
      <motion.span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(43,127,212,0.12) 35%, rgba(201,162,39,0.1) 55%, transparent 80%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.5, delay: 0.2, ease }}
      />

      {/* Wide luminous wave — most of the screen. */}
      <motion.span
        aria-hidden
        className="absolute -top-[30vh] -bottom-[30vh] left-0 w-[78%] -skew-x-12 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(43,127,212,0.65), rgba(201,162,39,0.55), rgba(255,255,255,0.25), transparent)",
        }}
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "340%", opacity: [0, 1, 0] }}
        transition={{ duration: 1.55, ease }}
      />
      <motion.span
        aria-hidden
        className="absolute -top-[30vh] -bottom-[30vh] left-0 w-32 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          filter: "blur(6px)",
        }}
        initial={{ x: "-120%", opacity: 0 }}
        animate={{ x: "680%", opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, delay: 0.04, ease }}
      />

      {/* Impact bloom at the card anchor when the wave arrives. */}
      <motion.span
        aria-hidden
        className="absolute h-96 w-96 rounded-full blur-3xl"
        style={{
          left: anchor.left,
          top: anchor.top,
          background:
            "radial-gradient(circle, rgba(96,170,240,0.7), rgba(201,162,39,0.35) 50%, transparent 72%)",
        }}
        initial={{ x: "-50%", y: "-50%", scale: 0.3, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.3, 1.45, 1.1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, delay: 0.85, ease }}
      />

      <Burst left={anchor.left} top={anchor.top} delay={1.05} scale={6.8} sparks />
      <Spread left={anchor.left} top={anchor.top} delay={1.12} />
    </>
  );
}

export function AnnouncementIntro({
  type,
  anchor = "bottom-right",
  onDone,
}: AnnouncementIntroProps) {
  useEffect(() => {
    const duration = INTRO_DURATIONS[type] || 0;
    if (duration === 0) {
      onDone();
      return;
    }
    const timer = window.setTimeout(onDone, duration);
    return () => window.clearTimeout(timer);
  }, [type, onDone]);

  if (type === "none") return null;

  const point = ANCHORS[anchor];

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {type === "shooting-star" && <ShootingStar anchor={point} />}
      {type === "rocket" && <Rocket anchor={point} />}
      {type === "particles" && <Particles anchor={point} />}
      {type === "glow-sweep" && <GlowSweep anchor={point} />}
    </div>
  );
}
