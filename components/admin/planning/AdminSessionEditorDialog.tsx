"use client";

import { useMemo, useState } from "react";
import type {
  AdminEditableSession,
  AdminFormationOption,
  AdminSessionInput,
} from "@/lib/admin/types";
import { FORMATION_CATEGORIES, FORMATION_CATEGORY_BY_ID } from "@/lib/formations/categories";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminSessionEditorDialogProps {
  open: boolean;
  session: AdminEditableSession | null;
  formations: AdminFormationOption[];
  onClose: () => void;
  onSave: (input: AdminSessionInput) => Promise<{ ok: boolean; error?: string }>;
}

const STATUS_OPTIONS: { value: AdminSessionInput["status"]; label: string }[] = [
  { value: "open", label: "Ouverte" },
  { value: "limited", label: "Dernières places" },
  { value: "full", label: "Complète" },
  { value: "cancelled", label: "Annulée" },
];

function timeToLabel(time: string): string | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  return `${hours}h${match[2]}`;
}

function parseNullableInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

const fieldInput = "mt-1.5 px-3 py-2";

function AdminSessionEditorForm({
  session,
  formations,
  onClose,
  onSave,
}: {
  session: AdminEditableSession | null;
  formations: AdminFormationOption[];
  onClose: () => void;
  onSave: AdminSessionEditorDialogProps["onSave"];
}) {
  const isEdit = session !== null;

  const [formationSlug, setFormationSlug] = useState(session?.formationSlug ?? "");
  const [formationTitle, setFormationTitle] = useState(session?.formationTitle ?? "");
  const [sessionType, setSessionType] = useState(session?.sessionType ?? "");
  const [category, setCategory] = useState<string>(session?.category ?? "securite-incendie");
  const [startDate, setStartDate] = useState(session?.startDate ?? "");
  const [endDate, setEndDate] = useState(session?.endDate ?? "");
  const [examDate, setExamDate] = useState(session?.examDate ?? "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduleLabel, setScheduleLabel] = useState(session?.scheduleLabel ?? "");
  const [location, setLocation] = useState(session?.location ?? "");
  const [seatsTotal, setSeatsTotal] = useState(session?.seatsTotal?.toString() ?? "");
  const [seatsTaken, setSeatsTaken] = useState(session?.seatsTaken?.toString() ?? "");
  const [status, setStatus] = useState<AdminSessionInput["status"]>(session?.status ?? "open");
  const [visible, setVisible] = useState(session?.visible ?? true);
  const [cpfEligible, setCpfEligible] = useState(session?.cpfEligible ?? false);
  const [certificationCode, setCertificationCode] = useState(session?.certificationCode ?? "");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const composedScheduleLabel = useMemo(() => {
    if (scheduleLabel.trim()) return scheduleLabel.trim();
    const start = timeToLabel(startTime);
    const end = timeToLabel(endTime);
    if (start && end) return `${start} - ${end}`;
    return "";
  }, [scheduleLabel, startTime, endTime]);

  function handleFormationChange(slug: string) {
    setFormationSlug(slug);
    const formation = formations.find((item) => item.slug === slug);
    if (formation) {
      setFormationTitle(formation.title);
      setCategory(formation.category);
      setCpfEligible(formation.cpfEligible);
      setCertificationCode(formation.certificationCode ?? "");
    }
  }

  function validate(input: AdminSessionInput): string | null {
    if (!input.formationTitle.trim()) return "Le nom de la session est obligatoire.";
    if (!input.startDate) return "La date de début est obligatoire.";
    if (!input.endDate) return "La date de fin est obligatoire.";
    if (input.endDate < input.startDate) {
      return "La date de fin doit être identique ou postérieure à la date de début.";
    }
    if (input.examDate && input.examDate < input.startDate) {
      return "La date d'examen ne peut pas précéder le début de la session.";
    }
    if (!input.location.trim()) return "Le lieu est obligatoire.";
    if (input.seatsTotal !== null && input.seatsTotal < 0) {
      return "Le nombre de places totales ne peut pas être négatif.";
    }
    if (input.seatsTaken !== null && input.seatsTaken < 0) {
      return "Le nombre de places prises ne peut pas être négatif.";
    }
    if (
      input.seatsTotal !== null &&
      input.seatsTaken !== null &&
      input.seatsTaken > input.seatsTotal
    ) {
      return "Les places prises ne peuvent pas dépasser les places totales.";
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const categoryLabel = FORMATION_CATEGORY_BY_ID[
      category as keyof typeof FORMATION_CATEGORY_BY_ID
    ]?.label ?? session?.categoryLabel ?? "";

    const input: AdminSessionInput = {
      id: session?.id,
      formationSlug: formationSlug || null,
      formationTitle: formationTitle.trim(),
      sessionType: sessionType.trim(),
      category,
      categoryLabel,
      startDate,
      endDate,
      examDate: examDate || null,
      scheduleLabel: composedScheduleLabel,
      location: location.trim(),
      seatsTotal: parseNullableInt(seatsTotal),
      seatsTaken: parseNullableInt(seatsTaken),
      status,
      visible,
      cpfEligible,
      certificationCode: certificationCode.trim() || null,
    };

    const validationError = validate(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const result = await onSave(input);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error ?? "Enregistrement impossible.");
      }
    } catch {
      setError("Enregistrement impossible. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(adminStyles.surface, "flex max-h-[90vh] w-full max-w-2xl flex-col")}
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEdit ? "Modifier la session" : "Créer une session"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Les modifications sont immédiatement reflétées sur le planning public et la
          pré-inscription.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-900">Formation associée</span>
            <select
              value={formationSlug}
              onChange={(event) => handleFormationChange(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            >
              <option value="">— Aucune (titre libre) —</option>
              {formations.map((formation) => (
                <option key={formation.slug} value={formation.slug}>
                  {formation.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-900">Nom de la session *</span>
            <input
              type="text"
              value={formationTitle}
              onChange={(event) => setFormationTitle(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder="Ex. SSIAP 1 — Initial"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Type de session</span>
            <input
              type="text"
              value={sessionType}
              onChange={(event) => setSessionType(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder="Ex. Initial, Recyclage…"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Catégorie</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            >
              {FORMATION_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Date de début *</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Date de fin *</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Date d&apos;examen</span>
            <input
              type="date"
              value={examDate ?? ""}
              onChange={(event) => setExamDate(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Lieu *</span>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder="Ex. Centre de formation — Lyon"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Heure de début</span>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Heure de fin</span>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-900">Libellé horaires affiché</span>
            <input
              type="text"
              value={scheduleLabel}
              onChange={(event) => setScheduleLabel(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder={composedScheduleLabel || "9h00 - 17h00"}
            />
            <span className="mt-1 block text-xs text-slate-500">
              Laissez vide pour générer automatiquement à partir des heures.
            </span>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Places totales</span>
            <input
              type="number"
              min={0}
              value={seatsTotal}
              onChange={(event) => setSeatsTotal(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder="Ex. 12"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Places prises</span>
            <input
              type="number"
              min={0}
              value={seatsTaken}
              onChange={(event) => setSeatsTaken(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder="Ex. 8"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Statut</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as AdminSessionInput["status"])
              }
              className={cn(adminStyles.input, fieldInput)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-900">Code certification</span>
            <input
              type="text"
              value={certificationCode}
              onChange={(event) => setCertificationCode(event.target.value)}
              className={cn(adminStyles.input, fieldInput)}
              placeholder="Ex. RNCP…"
            />
          </label>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <input
                type="checkbox"
                checked={visible}
                onChange={(event) => setVisible(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
              />
              Visible sur le site public
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <input
                type="checkbox"
                checked={cpfEligible}
                onChange={(event) => setCpfEligible(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
              />
              Éligible CPF
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className={adminStyles.btnSecondary}>
          Annuler
        </button>
        <button type="submit" disabled={saving} className={adminStyles.btnPrimary}>
          {saving ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer la session"}
        </button>
      </div>
    </form>
  );
}

export function AdminSessionEditorDialog({
  open,
  session,
  formations,
  onClose,
  onSave,
}: AdminSessionEditorDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <AdminSessionEditorForm
        key={session?.id ?? "new"}
        session={session}
        formations={formations}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}
