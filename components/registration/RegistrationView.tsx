"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { RegistrationIntent } from "@/lib/registration/types";
import type { PlanningSession } from "@/lib/planning/types";
import { resolveRegistrationContext } from "@/lib/registration/resolve-context";
import { RegistrationHero } from "@/components/registration/RegistrationHero";
import { DevisEditorialIntro } from "@/components/registration/DevisEditorialIntro";
import { RegistrationContextCard } from "@/components/registration/RegistrationContextCard";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";
import { RegistrationTrustStrip } from "@/components/registration/RegistrationTrustStrip";
import { Container } from "@/components/ui/Container";

interface RegistrationViewProps {
  intent: RegistrationIntent;
  sessions: PlanningSession[];
}

export function RegistrationView({ intent, sessions }: RegistrationViewProps) {
  const searchParams = useSearchParams();
  const urlFormationSlug = searchParams.get("formation") ?? "";
  const urlSessionId = searchParams.get("session") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [sidebarSelection, setSidebarSelection] = useState({
    formationSlug: urlFormationSlug,
    sessionId: urlSessionId,
  });

  const context = useMemo(
    () =>
      resolveRegistrationContext(
        intent,
        sessions,
        sidebarSelection.formationSlug || null,
        sidebarSelection.sessionId || null,
      ),
    [intent, sessions, sidebarSelection.formationSlug, sidebarSelection.sessionId],
  );

  if (submitted) {
    return (
      <RegistrationSuccess intent={intent} onReset={() => setSubmitted(false)} />
    );
  }

  return (
    <>
      <RegistrationHero intent={intent} />

      <section className="section-wash-surface pb-16 md:pb-20">
        <Container>
          {intent === "devis" && <DevisEditorialIntro />}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:gap-10">
            <RegistrationForm
              key={`${urlFormationSlug}-${urlSessionId}`}
              intent={intent}
              sessions={sessions}
              initialFormationSlug={urlFormationSlug || null}
              initialSessionId={urlSessionId || null}
              onSuccess={() => setSubmitted(true)}
              onSelectionChange={setSidebarSelection}
            />
            <aside className="min-w-0 space-y-5 lg:sticky lg:top-28 lg:self-start">
              <RegistrationContextCard context={context} />
              <RegistrationTrustStrip className="hidden lg:grid" />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
