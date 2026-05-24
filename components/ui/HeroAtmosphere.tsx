"use client";

export function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="animated-mesh absolute inset-0 opacity-35" />
      <div className="hero-light-rays absolute inset-0" />
      <div className="premium-noise absolute inset-0 opacity-[0.08]" />

      <div className="hero-particles absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${10 + ((i * 11) % 80)}%`,
              top: `${12 + ((i * 17) % 75)}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${16 + (i % 4) * 3}s`,
              opacity: 0.12 + (i % 3) * 0.06,
              width: i % 2 === 0 ? "2px" : "3px",
              height: i % 2 === 0 ? "2px" : "3px",
            }}
          />
        ))}
      </div>

      <div className="absolute -right-48 top-0 h-[560px] w-[560px] rounded-full bg-blue-500/10 blur-[110px] float-glow" />
      <div
        className="absolute -left-40 bottom-0 h-[440px] w-[440px] rounded-full bg-gold-400/8 blur-[100px] float-glow"
        style={{ animationDelay: "-4s" }}
      />
      <div className="absolute left-1/3 top-1/4 h-[280px] w-[280px] rounded-full bg-blue-400/6 blur-[90px] float-glow" style={{ animationDelay: "-2s" }} />
    </div>
  );
}
