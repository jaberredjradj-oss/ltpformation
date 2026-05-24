import type { CategoryVisualTheme } from "@/lib/category-visuals";

export const TRAINING_IMAGES = {
  heroBg: "/images/training/hero-bg-v2.jpg",
  incendie: "/images/training/incendie-v2.jpg",
  secourisme: "/images/training/secourisme-v2.jpg",
  surete: "/images/training/surete-v2.jpg",
  habilitation: "/images/training/habilitation-v2.jpg",
  formation: "/images/training/formation-v2.jpg",
  intervention: "/images/training/intervention-v2.jpg",
  classroom: "/images/training/classroom-v2.jpg",
  aboutTeam: "/images/training/about-workshop-v2.jpg",
} as const;

export type TrainingImageKey = keyof typeof TRAINING_IMAGES;

export const THEME_IMAGES: Record<CategoryVisualTheme, string> = {
  incendie: TRAINING_IMAGES.incendie,
  secourisme: TRAINING_IMAGES.secourisme,
  surete: TRAINING_IMAGES.surete,
  habilitation: TRAINING_IMAGES.habilitation,
  formation: TRAINING_IMAGES.formation,
  professionals: TRAINING_IMAGES.intervention,
};
