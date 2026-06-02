"use client";

import { adminStyles } from "@/components/admin/admin-styles";
import type { CategoryVisualTheme } from "@/lib/category-visuals";
import { CATEGORY_VISUAL_THEMES } from "@/lib/category-visuals";
import { THEME_IMAGES } from "@/lib/training-images";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = Object.keys(CATEGORY_VISUAL_THEMES) as CategoryVisualTheme[];

const THEME_LABELS: Record<CategoryVisualTheme, string> = {
  incendie: "Incendie",
  secourisme: "Secourisme",
  surete: "Sûreté",
  habilitation: "Habilitation électrique",
  formation: "Formation (générique)",
  professionals: "Professionnels / intervention",
};

interface FormationThemeFieldProps {
  value: CategoryVisualTheme;
  onChange: (value: CategoryVisualTheme) => void;
  hasCustomCover: boolean;
}

export function FormationThemeField({
  value,
  onChange,
  hasCustomCover,
}: FormationThemeFieldProps) {
  const themeSrc = THEME_IMAGES[value];

  return (
    <div className="block min-w-0 sm:col-span-2">
      <span className={`mb-1.5 block ${adminStyles.label}`}>Visuel par défaut (thème)</span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={themeSrc}
            alt={`Thème ${THEME_LABELS[value]}`}
            className={cn(
              "h-full w-full object-cover transition",
              hasCustomCover && "opacity-40 grayscale",
            )}
          />
          <span
            className={cn(
              "absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium",
              hasCustomCover ? "bg-slate-700/85 text-white" : "bg-blue-600/90 text-white",
            )}
          >
            {hasCustomCover ? "Remplacé par l'image" : "Thème actif"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <select
            className={cn(adminStyles.input, "px-3 py-2")}
            value={value}
            onChange={(e) => onChange(e.target.value as CategoryVisualTheme)}
          >
            {THEME_OPTIONS.map((theme) => (
              <option key={theme} value={theme}>
                {THEME_LABELS[theme]}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-400">
            Le thème fournit l&apos;image de couverture par défaut de la formation.
          </p>
          {hasCustomCover && (
            <p className="mt-1 text-xs font-medium text-amber-700">
              Une image personnalisée est définie ci-dessous et remplace ce thème. Retirez-la
              pour réutiliser le thème.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
