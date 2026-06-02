"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_CONTACT_FORM_VALUES } from "@/lib/contact/types";
import type { ContactFormValues } from "@/lib/contact/types";
import { submitContactForm } from "@/lib/contact/actions";
import {
  hasContactValidationErrors,
  validateContactForm,
} from "@/lib/contact/validation";
import { HONEYPOT_FIELD } from "@/lib/registration/antispam";
import { easeCinematic } from "@/lib/motion";
import { FormField, FormInput, FormTextarea } from "@/components/ui/FormField";

export function ContactForm() {
  const [formLoadedAt] = useState(() => Date.now());
  const [values, setValues] = useState<ContactFormValues>(DEFAULT_CONTACT_FORM_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
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

    const validationErrors = validateContactForm(values) as Record<string, string>;
    if (hasContactValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    const result = await submitContactForm({
      values,
      honeypot,
      formLoadedAt,
    });

    setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) setErrors(result.fieldErrors);
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeCinematic }}
        className="refined-card mt-10 px-6 py-10 text-center md:mt-12 md:px-8 md:py-12"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Message envoyé
        </p>
        <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-navy-950">
          Merci pour votre message
        </p>
        <p className="editorial-lead mx-auto mt-3 max-w-md text-pretty">
          Notre équipe vous répond sous 24 h ouvrées.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setValues(DEFAULT_CONTACT_FORM_VALUES);
          }}
          className="mt-6 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          Envoyer un autre message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: easeCinematic }}
      onSubmit={handleSubmit}
      className="relative refined-card mt-8 space-y-5 p-5 md:mt-12 md:space-y-6 md:p-8"
      noValidate
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
          Écrivez-nous
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-navy-950">
          Un message rapide
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-body-strong">
          Une question simple ? Laissez-nous un mot, nous revenons vers vous rapidement.
        </p>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Ne pas remplir</label>
        <input
          id={`contact-${HONEYPOT_FIELD}`}
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
        <FormField label="Prénom" htmlFor="contact-firstName" required error={errors.firstName}>
          <FormInput
            id="contact-firstName"
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </FormField>

        <FormField label="Nom" htmlFor="contact-lastName" required error={errors.lastName}>
          <FormInput
            id="contact-lastName"
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Adresse email" htmlFor="contact-email" required error={errors.email}>
          <FormInput
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </FormField>

        <FormField label="Téléphone" htmlFor="contact-phone" hint="Optionnel">
          <FormInput
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Message" htmlFor="contact-message" required error={errors.message}>
        <FormTextarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="min-h-[140px]"
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
        {submitting ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </motion.form>
  );
}
