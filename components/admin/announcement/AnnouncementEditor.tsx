"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ANNOUNCEMENT_ANIMATION_LABELS,
  ANNOUNCEMENT_ANIMATION_TYPES,
  type AnnouncementAnimationType,
  type AnnouncementInput,
  type SiteAnnouncement,
} from "@/lib/announcements/types";
import { saveAnnouncement } from "@/lib/admin/announcement-actions";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { AnnouncementIntro } from "@/components/announcement/AnnouncementIntro";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminToast } from "@/components/admin/AdminToast";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface FormationOption {
  slug: string;
  title: string;
  image: string | null;
}

interface AnnouncementEditorProps {
  initial: SiteAnnouncement | null;
  defaults: AnnouncementInput;
  formations: FormationOption[];
  loadError: string | null;
}

interface FormState {
  enabled: boolean;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  animationType: AnnouncementAnimationType;
  delaySeconds: number;
  durationSeconds: number;
}

function toFormState(
  initial: SiteAnnouncement | null,
  defaults: AnnouncementInput,
): FormState {
  const source = initial ?? defaults;
  return {
    enabled: source.enabled,
    title: source.title,
    description: source.description,
    ctaText: source.ctaText,
    ctaUrl: source.ctaUrl,
    animationType: source.animationType,
    delaySeconds: Math.round((initial?.displayDelay ?? defaults.displayDelay) / 1000),
    durationSeconds: Math.round(
      (initial?.displayDuration ?? defaults.displayDuration) / 1000,
    ),
  };
}

export function AnnouncementEditor({
  initial,
  defaults,
  formations,
  loadError,
}: AnnouncementEditorProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(() => toFormState(initial, defaults));
  const [previewKey, setPreviewKey] = useState(0);
  const [previewPhase, setPreviewPhase] = useState<"intro" | "card">("card");

  const replayPreview = useCallback((animationType: AnnouncementAnimationType) => {
    setPreviewKey((key) => key + 1);
    setPreviewPhase(animationType === "none" ? "card" : "intro");
  }, []);

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedFormation = useMemo(
    () =>
      formations.find(
        (formation) => `/formations/${formation.slug}` === form.ctaUrl,
      ) ?? null,
    [formations, form.ctaUrl],
  );

  const selectedFormationSlug = selectedFormation?.slug ?? "";

  const previewImage = useMemo(
    () =>
      selectedFormation?.image
        ? { src: selectedFormation.image, alt: selectedFormation.title }
        : null,
    [selectedFormation],
  );

  const previewAnnouncement: SiteAnnouncement = useMemo(
    () => ({
      id: initial?.id ?? "preview",
      enabled: form.enabled,
      title: form.title || "Titre de l'annonce",
      description: form.description,
      ctaText: form.ctaText,
      ctaUrl: form.ctaUrl,
      animationType: form.animationType,
      displayDelay: form.delaySeconds * 1000,
      displayDuration: form.durationSeconds * 1000,
      updatedAt: new Date().toISOString(),
    }),
    [initial?.id, form],
  );

  const handleFormationSelect = (slug: string) => {
    if (!slug) return;
    update("ctaUrl", `/formations/${slug}`);
  };

  const handleSave = () => {
    const payload: AnnouncementInput = {
      enabled: form.enabled,
      title: form.title.trim(),
      description: form.description.trim(),
      ctaText: form.ctaText.trim(),
      ctaUrl: form.ctaUrl.trim(),
      animationType: form.animationType,
      displayDelay: Math.max(0, form.delaySeconds) * 1000,
      displayDuration: Math.max(0, form.durationSeconds) * 1000,
    };

    startTransition(async () => {
      const result = await saveAnnouncement(payload);
      if (result.ok) {
        showToast("Annonce enregistrée.", "success");
        router.refresh();
      } else {
        showToast(result.error ?? "Enregistrement impossible.", "error");
      }
    });
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Communication"
        title="Annonce du site"
        description="Mettez en avant une nouvelle formation via une carte flottante premium sur le site public. Désactivée, elle n'apparaît pas et le site reste identique."
      />

      {loadError && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className={cn(adminStyles.surface, "p-5 md:p-6")}>
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Activer l&apos;annonce</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Affiche la carte sur toutes les pages publiques.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.enabled}
              onClick={() => update("enabled", !form.enabled)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                form.enabled ? "bg-blue-600" : "bg-slate-300",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  form.enabled ? "translate-x-[22px]" : "translate-x-0.5",
                )}
              />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className={adminStyles.label} htmlFor="ann-title">
                Titre
              </label>
              <input
                id="ann-title"
                type="text"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="NOUVEAU : Formation SSIAP 3 disponible"
                maxLength={120}
                className={cn(adminStyles.input, "mt-1 px-3 py-2")}
              />
            </div>

            <div>
              <label className={adminStyles.label} htmlFor="ann-description">
                Description courte
              </label>
              <textarea
                id="ann-description"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                rows={3}
                maxLength={320}
                className={cn(adminStyles.input, "mt-1 resize-none px-3 py-2")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminStyles.label} htmlFor="ann-cta-text">
                  Texte du bouton
                </label>
                <input
                  id="ann-cta-text"
                  type="text"
                  value={form.ctaText}
                  onChange={(event) => update("ctaText", event.target.value)}
                  placeholder="Découvrir la formation"
                  maxLength={60}
                  className={cn(adminStyles.input, "mt-1 px-3 py-2")}
                />
              </div>
              <div>
                <label className={adminStyles.label} htmlFor="ann-formation">
                  Formation associée
                </label>
                <select
                  id="ann-formation"
                  value={selectedFormationSlug}
                  onChange={(event) => handleFormationSelect(event.target.value)}
                  className={cn(adminStyles.input, "mt-1 px-3 py-2")}
                >
                  <option value="">— Lien personnalisé —</option>
                  {formations.map((formation) => (
                    <option key={formation.slug} value={formation.slug}>
                      {formation.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={adminStyles.label} htmlFor="ann-cta-url">
                Lien du bouton
              </label>
              <input
                id="ann-cta-url"
                type="text"
                value={form.ctaUrl}
                onChange={(event) => update("ctaUrl", event.target.value)}
                placeholder="/formations/ssiap-3-initial ou https://..."
                maxLength={500}
                className={cn(adminStyles.input, "mt-1 px-3 py-2")}
              />
              <p className="mt-1 text-xs text-slate-400">
                Lien interne (commençant par /) ou URL complète https://.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={adminStyles.label} htmlFor="ann-animation">
                  Animation
                </label>
                <select
                  id="ann-animation"
                  value={form.animationType}
                  onChange={(event) => {
                    const next = event.target.value as AnnouncementAnimationType;
                    update("animationType", next);
                    replayPreview(next);
                  }}
                  className={cn(adminStyles.input, "mt-1 px-3 py-2")}
                >
                  {ANNOUNCEMENT_ANIMATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ANNOUNCEMENT_ANIMATION_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminStyles.label} htmlFor="ann-delay">
                  Délai avant apparition (s)
                </label>
                <input
                  id="ann-delay"
                  type="number"
                  min={0}
                  max={60}
                  value={form.delaySeconds}
                  onChange={(event) =>
                    update("delaySeconds", Number(event.target.value))
                  }
                  className={cn(adminStyles.input, "mt-1 px-3 py-2")}
                />
              </div>
              <div>
                <label className={adminStyles.label} htmlFor="ann-duration">
                  Durée affichage (s, 0 = permanent)
                </label>
                <input
                  id="ann-duration"
                  type="number"
                  min={0}
                  max={120}
                  value={form.durationSeconds}
                  onChange={(event) =>
                    update("durationSeconds", Number(event.target.value))
                  }
                  className={cn(adminStyles.input, "mt-1 px-3 py-2")}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className={adminStyles.btnPrimary}
            >
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
            <span className="text-xs text-slate-400">
              {form.enabled
                ? "L'annonce sera visible sur le site public."
                : "L'annonce est désactivée (site inchangé)."}
            </span>
          </div>
        </section>

        <section className={cn(adminStyles.surfaceMuted, "p-5 md:p-6")}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Aperçu en direct</p>
            <button
              type="button"
              onClick={() => replayPreview(form.animationType)}
              className={adminStyles.btnSecondary}
            >
              Rejouer l&apos;animation
            </button>
          </div>

          <div className="relative mt-4 flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-[radial-gradient(ellipse_at_top,#0b1f3a,#15294a_55%,#0b1f3a)] p-6">
            {previewPhase === "intro" && (
              <div
                key={`intro-${previewKey}`}
                className="pointer-events-none absolute inset-0"
              >
                <AnnouncementIntro
                  type={form.animationType}
                  anchor="center"
                  onDone={() => setPreviewPhase("card")}
                />
              </div>
            )}

            {previewPhase === "card" && (
              <motion.div
                key={`card-${previewKey}`}
                className="w-full max-w-sm"
                initial={
                  form.animationType === "none"
                    ? { opacity: 0, y: 24, scale: 0.94, filter: "blur(10px)" }
                    : false
                }
                animate={
                  form.animationType === "none"
                    ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    : undefined
                }
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnnouncementCard
                  announcement={previewAnnouncement}
                  image={previewImage}
                  interactive={false}
                  reveal={form.animationType === "none" ? "none" : "materialize"}
                />
              </motion.div>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Aperçu non interactif. Sur le site, l&apos;animation d&apos;entrée se
            joue une fois, puis la carte apparaît en bas à droite et reste
            cliquable jusqu&apos;à fermeture (mémorisée par visiteur).
          </p>
        </section>
      </div>
    </div>
  );
}
