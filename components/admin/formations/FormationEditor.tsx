"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createFormation,
  updateFormation,
  type SaveFormationInput,
} from "@/lib/admin/formations/actions";
import { CATEGORY_VISUAL_THEMES } from "@/lib/category-visuals";
import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import {
  FORMATION_TYPE_LABELS,
  type Formation,
  type FormationCategoryId,
  type FormationType,
} from "@/lib/formations/types";
import { adminStyles } from "@/components/admin/admin-styles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminToast } from "@/components/admin/AdminToast";
import { FormationCoverField } from "@/components/admin/formations/FormationCoverField";
import { cn } from "@/lib/utils";

interface FormationEditorProps {
  mode: "create" | "edit";
  initialFormation: Formation;
  initialActive: boolean;
  initialSortOrder: number;
}

const THEME_OPTIONS = Object.keys(CATEGORY_VISUAL_THEMES) as Array<
  keyof typeof CATEGORY_VISUAL_THEMES
>;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className={`mb-1.5 block ${adminStyles.label}`}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={adminStyles.surface}>
      <div className={adminStyles.sectionHeader}>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-6">{children}</div>
    </section>
  );
}

export function FormationEditor({
  mode,
  initialFormation,
  initialActive,
  initialSortOrder,
}: FormationEditorProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [formation, setFormation] = useState<Formation>(initialFormation);
  const [active, setActive] = useState(initialActive);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [saving, setSaving] = useState(false);

  const isCreate = mode === "create";
  const isFireSafety = formation.category === "securite-incendie";

  function patch<K extends keyof Formation>(key: K, value: Formation[K]) {
    setFormation((current) => ({ ...current, [key]: value }));
  }

  function patchPrice<K extends keyof Formation["price"]>(
    key: K,
    value: Formation["price"][K],
  ) {
    setFormation((current) => ({
      ...current,
      price: { ...current.price, [key]: value },
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);

    const payload: SaveFormationInput = { formation, active, sortOrder };
    try {
      const result = isCreate
        ? await createFormation(payload)
        : await updateFormation(formation.slug, payload);

      if (!result.ok) {
        showToast(result.error ?? "Enregistrement impossible.", "error");
        return;
      }

      showToast(isCreate ? "Formation créée." : "Formation enregistrée.");
      router.push("/admin/formations");
      router.refresh();
    } catch {
      showToast("Enregistrement impossible.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalogue"
        title={isCreate ? "Nouvelle formation" : `Éditer — ${formation.title}`}
        description={
          isCreate
            ? "Créez une formation. Le contenu détaillé pourra être enrichi ensuite."
            : "Modifiez les informations principales. Le contenu détaillé est conservé."
        }
      />

      <Section title="Identité">
        <Field label="Slug (URL)" hint={isCreate ? "Minuscules, format kebab-case." : "Verrouillé après création."}>
          <input
            className={cn(adminStyles.input, "px-3 py-2", !isCreate && "bg-slate-50 text-slate-500")}
            value={formation.slug}
            onChange={(e) => patch("slug", e.target.value)}
            placeholder="ex. ssiap-1-initial"
            disabled={!isCreate}
            required
          />
        </Field>
        <Field label="Titre">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.title}
            onChange={(e) => patch("title", e.target.value)}
            required
          />
        </Field>
        <Field label="Titre court (cartes)">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.shortTitle}
            onChange={(e) => patch("shortTitle", e.target.value)}
          />
        </Field>
        <Field label="Catégorie">
          <select
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.category}
            onChange={(e) => patch("category", e.target.value as FormationCategoryId)}
          >
            {FORMATION_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Type">
          <select
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.type}
            onChange={(e) => patch("type", e.target.value as FormationType)}
          >
            {(Object.keys(FORMATION_TYPE_LABELS) as FormationType[]).map((type) => (
              <option key={type} value={type}>
                {FORMATION_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Niveau" hint={isFireSafety ? undefined : "Réservé à la sécurité incendie."}>
          <select
            className={cn(adminStyles.input, "px-3 py-2", !isFireSafety && "bg-slate-50 text-slate-500")}
            value={formation.level ?? ""}
            onChange={(e) => patch("level", (e.target.value || null) as Formation["level"])}
            disabled={!isFireSafety}
          >
            <option value="">Aucun</option>
            <option value="1">Niveau 1</option>
            <option value="2">Niveau 2</option>
            <option value="3">Niveau 3</option>
          </select>
        </Field>
      </Section>

      <Section title="Tarif & durée">
        <Field label="Durée (heures)">
          <input
            type="number"
            min={0}
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.durationHours}
            onChange={(e) => patch("durationHours", Number(e.target.value))}
          />
        </Field>
        <Field label="Durée (libellé)" hint="ex. 70 heures (10 jours)">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.durationLabel}
            onChange={(e) => patch("durationLabel", e.target.value)}
          />
        </Field>
        <Field label="Tarif (montant €)">
          <input
            type="number"
            min={0}
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.price.amount}
            onChange={(e) => patchPrice("amount", Number(e.target.value))}
          />
        </Field>
        <Field label="Tarif (libellé)" hint="ex. 1 200 € TTC par participant">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.price.label}
            onChange={(e) => patchPrice("label", e.target.value)}
          />
        </Field>
        <Field label="Note tarif (optionnel)">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.price.note ?? ""}
            onChange={(e) => patchPrice("note", e.target.value)}
          />
        </Field>
        <Field label="Code certification (optionnel)">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.certificationCode ?? ""}
            onChange={(e) => patch("certificationCode", e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={formation.cpfEligible}
            onChange={(e) => patch("cpfEligible", e.target.checked)}
          />
          Éligible CPF
        </label>
        <Field label="Note CPF (optionnel)">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.cpfNote ?? ""}
            onChange={(e) => patch("cpfNote", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Résumé & média">
        <label className="block min-w-0 sm:col-span-2">
          <span className={`mb-1.5 block ${adminStyles.label}`}>Résumé</span>
          <textarea
            className={cn(adminStyles.input, "min-h-24 px-3 py-2")}
            value={formation.summary}
            onChange={(e) => patch("summary", e.target.value)}
            required
          />
        </label>
        <Field label="Visuel (thème)" hint="Utilisé comme image par défaut si aucune couverture personnalisée.">
          <select
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.imageKey}
            onChange={(e) => patch("imageKey", e.target.value as Formation["imageKey"])}
          >
            {THEME_OPTIONS.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </Field>
        <FormationCoverField
          mode={mode}
          slug={formation.slug}
          imageKey={formation.imageKey}
          value={formation.coverImageUrl}
          onChange={(url) => patch("coverImageUrl", url)}
        />
        <Field label="Statut du contenu">
          <select
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.contentStatus}
            onChange={(e) =>
              patch("contentStatus", e.target.value as Formation["contentStatus"])
            }
          >
            <option value="stub">Brouillon (programme en cours)</option>
            <option value="published">Publié</option>
          </select>
        </Field>
        <Field label="Ordre d'affichage" hint="Plus petit = affiché en premier.">
          <input
            type="number"
            className={cn(adminStyles.input, "px-3 py-2")}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active (visible sur le site public)
        </label>
      </Section>

      <Section title="Document PDF">
        <Field label="Nom du fichier PDF" hint="ex. ssiap-1-initial.pdf">
          <input
            className={cn(adminStyles.input, "px-3 py-2")}
            value={formation.pdfFilename}
            onChange={(e) => patch("pdfFilename", e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={formation.pdfAvailable}
            onChange={(e) => patch("pdfAvailable", e.target.checked)}
          />
          PDF disponible
        </label>
      </Section>

      <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <Link href="/admin/formations" className={adminStyles.btnSecondary}>
          Annuler
        </Link>
        <button type="submit" className={adminStyles.btnPrimary} disabled={saving}>
          {saving ? "Enregistrement…" : isCreate ? "Créer la formation" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
