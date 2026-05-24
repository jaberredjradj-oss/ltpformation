export type CategoryVisualTheme =
  | "incendie"
  | "secourisme"
  | "surete"
  | "habilitation"
  | "formation"
  | "professionals";

export const CATEGORY_VISUAL_THEMES: Record<
  CategoryVisualTheme,
  { gradient: string; icon: string; glow: string }
> = {
  incendie: {
    gradient: "from-[#1a2744] via-[#2a3f6b] to-[#4a2c1a]",
    glow: "bg-orange-400/20",
    icon: "M12 2C12 2 8 8 8 13a4 4 0 108 0c0-5-4-11-4-11z",
  },
  secourisme: {
    gradient: "from-[#0f2744] via-[#1e3a5f] to-[#1a4a6e]",
    glow: "bg-blue-400/25",
    icon: "M12 4v16M4 12h16",
  },
  surete: {
    gradient: "from-[#0b1f3a] via-[#1a3358] to-[#2d4a6e]",
    glow: "bg-gold-400/20",
    icon: "M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z",
  },
  habilitation: {
    gradient: "from-[#0b1f3a] via-[#1e3a5f] to-[#1d5eb0]",
    glow: "bg-yellow-400/20",
    icon: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  },
  formation: {
    gradient: "from-[#1e3a5f] via-[#2b7fd4] to-[#4a9ee8]",
    glow: "bg-white/20",
    icon: "M4 20V8l8-4 8 4v12M4 12l8 4 8-4M12 16V4",
  },
  professionals: {
    gradient: "from-[#0b1f3a] via-[#132744] to-[#1e3a5f]",
    glow: "bg-blue-300/15",
    icon: "M16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 12a4 4 0 100-8 4 4 0 000 8z",
  },
};
