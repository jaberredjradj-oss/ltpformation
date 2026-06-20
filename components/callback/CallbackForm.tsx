"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DEFAULT_CALLBACK_FORM_VALUES,
  type CallbackFormSource,
  type CallbackFormValues,
} from "@/lib/callback/types";
import { submitCallbackForm } from "@/lib/callback/actions";
import {
  hasCallbackValidationErrors,
  validateCallbackForm,
} from "@/lib/callback/validation";
import { HONEYPOT_FIELD } from "@/lib/registration/antispam";
import { easeCinematic } from "@/lib/motion";
import { FormField, FormInput } from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

interface CallbackFormProps {
  source?: CallbackFormSource;
  className?: string;
  showIntro?: boolean;
  idPrefix?: string;
}

export function CallbackForm({
  source = "rappel",
  className,
  showIntro = true,
  idPrefix = "callback",
}: CallbackFormProps) {
  const router = useRouter();
  const [formLoadedAt] = useState(() => Date.now());
  const [values, setValues] = useState<CallbackFormValues>(DEFAULT_CALLBACK_FORM_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof CallbackFormValues>(key: K, value: CallbackFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
    setSubmitError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateCallbackForm(values) as Record<string, string>;
    if (hasCallbackValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    const result = await submitCallbackForm({
      values,
      source,
      honeypot,
      formLoadedAt,
    });

    setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) setErrors(result.fieldErrors);
      setSubmitError(result.error);
      return;
    }

    router.push("/merci");
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: easeCinematic }}
      onSubmit={handleSubmit}
      className={cn(
        "relative refined-card space-y-5 p-5 md:space-y-6 md:p-8",
        className,
      )}
      noValidate
    >
      {showIntro && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Rappel gratuit
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-navy-950">
            Parlons de votre projet de formation
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-strong">
            Laissez-nous vos coordonnées : un conseiller LT Protect Formation vous rappelle
            rapidement, sans engagement.
          </p>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor={`${idPrefix}-${HONEYPOT_FIELD}`}>Ne pas remplir</label>
        <input
          id={`${idPrefix}-${HONEYPOT_FIELD}`}
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

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Prénom"
          htmlFor={`${idPrefix}-firstName`}
          required
          error={errors.firstName}
        >
          <FormInput
            id={`${idPrefix}-firstName`}
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </FormField>

        <FormField label="Nom" htmlFor={`${idPrefix}-lastName`} required error={errors.lastName}>
          <FormInput
            id={`${idPrefix}-lastName`}
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Adresse email"
          htmlFor={`${idPrefix}-email`}
          required
          error={errors.email}
        >
          <FormInput
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </FormField>

        <FormField
          label="Numéro de téléphone"
          htmlFor={`${idPrefix}-phone`}
          required
          error={errors.phone}
        >
          <FormInput
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Entreprise" htmlFor={`${idPrefix}-company`} hint="Facultatif">
        <FormInput
          id={`${idPrefix}-company`}
          name="company"
          autoComplete="organization"
          value={values.company}
          onChange={(event) => updateField("company", event.target.value)}
        />
      </FormField>

      {submitError && (
        <p className="rounded-xl border border-red-200/70 bg-red-50/60 px-4 py-3 text-sm text-red-800">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(29,94,176,0.22)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(29,94,176,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Envoi en cours…" : "Je souhaite être rappelé"}
      </button>
    </motion.form>
  );
}
