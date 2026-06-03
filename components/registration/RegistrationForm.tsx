"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildSessionSnapshot,
  DEFAULT_REGISTRATION_FORM_VALUES,
  hasValidationErrors,
  REGISTRATION_INTENT_COPY,
  resolveRegistrationContext,
  submitRegistration,
  validateRegistrationForm,
} from "@/lib/registration";
import type {
  RegistrationFormValues,
  RegistrationIntent,
} from "@/lib/registration/types";
import type { PlanningSession } from "@/lib/planning/types";
import { HONEYPOT_FIELD } from "@/lib/registration/antispam";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import { formatSessionDateRange } from "@/lib/planning/format";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui/FormField";
import { QuestionnairePlaceholder } from "@/components/questionnaires/QuestionnairePlaceholder";
import { DocumentUploadField } from "@/components/documents/DocumentUploadField";
import {
  countPreinscriptionDocuments,
  PreinscriptionDocumentsUpload,
} from "@/components/documents/PreinscriptionDocumentsUpload";
import type { DocumentKind } from "@/lib/documents/types";
import { RegistrationConsent } from "@/components/registration/RegistrationConsent";
import { uploadCandidateDocumentsRequest } from "@/lib/documents/client-upload";
import { RegistrationSessionInsight } from "@/components/registration/RegistrationSessionInsight";
import { RegistrationTrustStrip } from "@/components/registration/RegistrationTrustStrip";

interface RegistrationFormProps {
  intent: RegistrationIntent;
  sessions: PlanningSession[];
  initialFormationSlug?: string | null;
  initialSessionId?: string | null;
  onSuccess: () => void;
  onSelectionChange?: (selection: { formationSlug: string; sessionId: string }) => void;
}

export function RegistrationForm({
  intent,
  sessions,
  initialFormationSlug,
  initialSessionId,
  onSuccess,
  onSelectionChange,
}: RegistrationFormProps) {
  const router = useRouter();
  const copy = REGISTRATION_INTENT_COPY[intent];
  const isDevis = intent === "devis";
  const [formLoadedAt] = useState(() => Date.now());

  const [values, setValues] = useState<RegistrationFormValues>(() => ({
    ...DEFAULT_REGISTRATION_FORM_VALUES,
    formationSlug: initialFormationSlug ?? "",
    sessionId: initialSessionId ?? "",
  }));
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [preinscriptionDocuments, setPreinscriptionDocuments] = useState<
    Partial<Record<DocumentKind, File>>
  >({});
  const [fileError, setFileError] = useState<string | null>(null);

  const context = useMemo(
    () => resolveRegistrationContext(intent, sessions, values.formationSlug, values.sessionId),
    [intent, sessions, values.formationSlug, values.sessionId],
  );

  const selectedSessionAvailability = context.session
    ? resolveSessionAvailability(context.session)
    : null;

  const registrationBlocked =
    intent === "preinscription" &&
    selectedSessionAvailability !== null &&
    !selectedSessionAvailability.canRegister;

  function notifySelection(formationSlug: string, sessionId: string) {
    onSelectionChange?.({ formationSlug, sessionId });
  }

  function syncUrl(formationSlug: string, sessionId: string) {
    const params = new URLSearchParams();
    if (formationSlug) params.set("formation", formationSlug);
    if (sessionId) params.set("session", sessionId);
    const query = params.toString();
    router.replace(query ? `/${intent}?${query}` : `/${intent}`, { scroll: false });
  }

  function updateField<K extends keyof RegistrationFormValues>(
    key: K,
    value: RegistrationFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
    setSubmitError(null);
  }

  function handleFormationChange(formationSlug: string) {
    const nextContext = resolveRegistrationContext(intent, sessions, formationSlug, "");
    const sessionStillValid = nextContext.sessionOptions.some(
      (session) => session.id === values.sessionId,
    );
    const sessionId = sessionStillValid ? values.sessionId : "";

    setValues((current) => ({
      ...current,
      formationSlug,
      sessionId,
    }));
    syncUrl(formationSlug, sessionId);
    notifySelection(formationSlug, sessionId);
  }

  function handleSessionChange(sessionId: string) {
    updateField("sessionId", sessionId);
    syncUrl(values.formationSlug, sessionId);
    notifySelection(values.formationSlug, sessionId);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateRegistrationForm(values, intent) as Record<string, string>;

    if (!consentAccepted) {
      validationErrors.consent = "Veuillez accepter la politique de confidentialité.";
    }

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    if (registrationBlocked) {
      setErrors({
        sessionId: "Cette session est complète. Choisissez une autre date.",
      });
      return;
    }

    setSubmitting(true);

    const result = await submitRegistration({
      intent,
      values,
      consentAccepted,
      honeypot,
      formLoadedAt,
    });

    setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      }
      setSubmitError(result.error);
      return;
    }

    const hasDocuments =
      intent === "preinscription"
        ? countPreinscriptionDocuments(preinscriptionDocuments) > 0
        : attachedFiles.length > 0;

    if (hasDocuments) {
      const formData = new FormData();
      formData.append("entityType", intent === "devis" ? "devis" : "preinscription");
      formData.append("entityId", result.submissionId);
      formData.append("email", values.email.trim());

      if (intent === "preinscription") {
        for (const [kind, file] of Object.entries(preinscriptionDocuments)) {
          if (!file) continue;
          formData.append("files", file);
          formData.append("documentKinds", kind);
        }
      } else {
        attachedFiles.forEach((file) => {
          formData.append("files", file);
          formData.append("documentKinds", "other");
        });
      }

      const expectedFileCount =
        intent === "preinscription"
          ? countPreinscriptionDocuments(preinscriptionDocuments)
          : attachedFiles.length;
      formData.append("expectedFileCount", String(expectedFileCount));

      const uploadResult = await uploadCandidateDocumentsRequest(formData);
      if (!uploadResult.ok) {
        setFileError(uploadResult.error);
        setSubmitError(
          "Votre demande a été enregistrée, mais l'envoi des documents a échoué. Contactez-nous si besoin.",
        );
        return;
      }
    }

    if (context.session) {
      console.info("[registration]", {
        id: result.submissionId,
        snapshot: buildSessionSnapshot(context.session),
      });
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="relative refined-card space-y-6 p-5 md:p-6 lg:p-8" noValidate>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
          {copy.contactEyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-navy-950">
          {copy.title}
        </h2>
        {isDevis ? (
          <p className="mt-2 text-sm leading-relaxed text-body-strong">
            Pour les entreprises, demandes groupées et formations sur mesure.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-body-strong">
            Inscription individuelle — rapide et guidée.
          </p>
        )}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore="true"
          data-lpignore="true"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {isDevis && (
        <>
          <FormField label="Entreprise / organisme" htmlFor="company" required error={errors.company}>
            <FormInput
              id="company"
              name="company"
              autoComplete="organization"
              value={values.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </FormField>

          <FormField
            label="Effectif concerné"
            htmlFor="employeeCount"
            hint="Optionnel — nombre total de salariés ou personnes concernées."
            error={errors.employeeCount}
          >
            <FormInput
              id="employeeCount"
              name="employeeCount"
              type="number"
              min={1}
              value={values.employeeCount}
              onChange={(event) => updateField("employeeCount", event.target.value)}
            />
          </FormField>
        </>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label={isDevis ? "Prénom du contact" : "Prénom"}
          htmlFor="firstName"
          required
          error={errors.firstName}
        >
          <FormInput
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </FormField>

        <FormField
          label={isDevis ? "Nom du contact" : "Nom"}
          htmlFor="lastName"
          required
          error={errors.lastName}
        >
          <FormInput
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email" htmlFor="email" required error={errors.email}>
          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </FormField>

        <FormField label="Téléphone" htmlFor="phone" required error={errors.phone}>
          <FormInput
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </FormField>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
          {copy.projectEyebrow}
        </p>
      </div>

      <FormField label="Formation" htmlFor="formationSlug" required error={errors.formationSlug}>
        <FormSelect
          id="formationSlug"
          name="formationSlug"
          value={values.formationSlug}
          onChange={(event) => handleFormationChange(event.target.value)}
        >
          <option value="">Sélectionner une formation</option>
          {context.formationOptions.map((formation) => (
            <option key={formation.slug} value={formation.slug}>
              {formation.shortTitle}
            </option>
          ))}
        </FormSelect>
      </FormField>

      <FormField
        label="Session"
        htmlFor="sessionId"
        required={!isDevis}
        error={errors.sessionId}
        hint={
          isDevis
            ? "Optionnel — indiquez une date souhaitée si vous la connaissez."
            : "Choisissez la session souhaitée dans le planning."
        }
      >
        <FormSelect
          id="sessionId"
          name="sessionId"
          value={values.sessionId}
          disabled={!values.formationSlug}
          onChange={(event) => handleSessionChange(event.target.value)}
        >
          <option value="">
            {values.formationSlug ? "Sélectionner une session" : "Choisissez d'abord une formation"}
          </option>
          {context.sessionOptions.map((session) => {
            const availability = resolveSessionAvailability(session);
            const disabled = intent === "preinscription" && !availability.canRegister;

            return (
              <option key={session.id} value={session.id} disabled={disabled}>
                {formatSessionDateRange(session.startDate, session.endDate)} — {availability.label}
                {disabled ? " (complet)" : ""}
              </option>
            );
          })}
        </FormSelect>
      </FormField>

      <RegistrationSessionInsight session={context.session} />

      {isDevis ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Nombre de participants"
              htmlFor="participantCount"
              required
              error={errors.participantCount}
            >
              <FormInput
                id="participantCount"
                name="participantCount"
                type="number"
                min={1}
                max={200}
                value={values.participantCount}
                onChange={(event) =>
                  updateField("participantCount", Number(event.target.value) || 1)
                }
              />
            </FormField>

            <FormField
              label="Formation sur site"
              htmlFor="onSiteTraining"
              hint="Intra-entreprise ou dans vos locaux."
            >
              <FormSelect
                id="onSiteTraining"
                name="onSiteTraining"
                value={values.onSiteTraining}
                onChange={(event) =>
                  updateField(
                    "onSiteTraining",
                    event.target.value as RegistrationFormValues["onSiteTraining"],
                  )
                }
              >
                <option value="">À définir ensemble</option>
                <option value="yes">Oui, formation sur site / intra</option>
                <option value="no">Non, en centre LT Protect</option>
                <option value="unknown">Je ne sais pas encore</option>
              </FormSelect>
            </FormField>
          </div>

          <FormField
            label="Votre demande"
            htmlFor="message"
            hint="Précisez vos besoins : parcours, dates, contraintes logistiques, financement entreprise…"
          >
            <FormTextarea
              id="message"
              name="message"
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          </FormField>
        </>
      ) : (
        <>
          {context.cpfEligible && (
            <FormField
              label="Financement"
              htmlFor="cpfFinancing"
              hint="Indiquez si vous souhaitez mobiliser un financement personnel."
            >
              <FormSelect
                id="cpfFinancing"
                name="cpfFinancing"
                value={values.cpfFinancing}
                onChange={(event) =>
                  updateField(
                    "cpfFinancing",
                    event.target.value as RegistrationFormValues["cpfFinancing"],
                  )
                }
              >
                <option value="">Je ne sais pas encore</option>
                <option value="yes">Oui, je souhaite mobiliser un financement personnel</option>
                <option value="no">Non, autre mode de financement</option>
              </FormSelect>
            </FormField>
          )}

          <FormField
            label="Message"
            htmlFor="message"
            hint="Optionnel — précisez votre situation ou vos questions."
          >
            <FormTextarea
              id="message"
              name="message"
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          </FormField>

          <QuestionnairePlaceholder />
        </>
      )}

      {registrationBlocked && (
        <p className="rounded-xl border border-red-200/70 bg-red-50/60 px-4 py-3 text-sm text-red-800">
          La session sélectionnée est complète. Choisissez une autre date pour continuer.
        </p>
      )}

      {isDevis ? (
        <DocumentUploadField
          files={attachedFiles}
          onChange={(next) => {
            setAttachedFiles(next);
            setFileError(null);
          }}
          disabled={submitting}
          error={fileError}
        />
      ) : (
        <PreinscriptionDocumentsUpload
          documents={preinscriptionDocuments}
          onChange={(next) => {
            setPreinscriptionDocuments(next);
            setFileError(null);
          }}
          disabled={submitting}
          error={fileError}
        />
      )}

      <RegistrationConsent
        intent={intent}
        checked={consentAccepted}
        onChange={(checked) => {
          setConsentAccepted(checked);
          if (checked && errors.consent) {
            setErrors((current) => {
              const next = { ...current };
              delete next.consent;
              return next;
            });
          }
        }}
        error={errors.consent}
      />

      <RegistrationTrustStrip compact className="lg:hidden" />

      {submitError && (
        <p className="rounded-xl border border-red-200/70 bg-red-50/60 px-4 py-3 text-sm text-red-800">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || registrationBlocked}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Envoi en cours…" : copy.submitLabel}
      </button>
    </form>
  );
}
