"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState } from "react";
import { signInAdmin } from "@/lib/admin/auth-actions";
import { SITE } from "@/lib/constants";
import { adminStyles } from "@/components/admin/admin-styles";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await signInAdmin(email, password);
      if (!result.ok) {
        setError(result.error);
      }
    } catch (error) {
      if (isRedirectError(error)) throw error;
      setError("Connexion impossible pour le moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo size="about" />
          <p className="mt-4 text-sm font-semibold text-slate-900">Administration</p>
          <p className="mt-1 text-xs text-slate-500">{SITE.name}</p>
        </div>

        <form onSubmit={handleSubmit} className={cn(adminStyles.surface, "p-8")}>
          <h1 className="text-xl font-semibold text-slate-900">Connexion</h1>
          <p className="mt-2 text-sm text-slate-600">
            Accès réservé aux équipes LT Protect Formation.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-slate-900">Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={cn(adminStyles.input, "mt-1.5 px-3.5 py-2.5")}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-900">Mot de passe</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={cn(adminStyles.input, "mt-1.5 px-3.5 py-2.5")}
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cn(adminStyles.btnPrimary, "mt-6 h-10 w-full")}
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
