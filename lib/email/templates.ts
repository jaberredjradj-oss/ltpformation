import type { DecisionEmailContent, DecisionEmailKind, DecisionEmailTemplateInput } from "@/lib/email/types";

const SIGNATURE = "Cordialement,\nL'équipe LT Protect Formation";

function buildAcceptedMessage({ firstName, formationTitle }: DecisionEmailTemplateInput): string {
  return `Bonjour ${firstName},

Nous avons le plaisir de vous informer que votre demande de pré-inscription pour la formation ${formationTitle} a été acceptée.

Notre équipe vous recontactera prochainement afin de finaliser les modalités d'inscription, les documents nécessaires et les informations pratiques liées à votre session.

${SIGNATURE}`;
}

function buildRefusedMessage({ firstName, formationTitle }: DecisionEmailTemplateInput): string {
  return `Bonjour ${firstName},

Après étude de votre demande, nous ne pouvons malheureusement pas confirmer votre pré-inscription pour la formation ${formationTitle} à ce stade.

Vous pouvez nous contacter afin d'échanger sur une autre session ou une formation plus adaptée à votre situation.

${SIGNATURE}`;
}

function buildDevisFollowUpMessage({ firstName, formationTitle }: DecisionEmailTemplateInput): string {
  return `Bonjour ${firstName},

Nous avons bien étudié votre demande de devis concernant la formation ${formationTitle}.

Notre équipe va revenir vers vous avec les informations nécessaires : disponibilité, modalités, tarif et organisation de la session.

${SIGNATURE}`;
}

export function buildContactReplyContent(firstName: string): { subject: string; message: string } {
  const greeting = firstName.trim() || "Bonjour";
  return {
    subject: "Réponse à votre message — LT Protect Formation",
    message: `${greeting},

Merci pour votre message. Nous revenons vers vous avec les éléments suivants :

[Votre réponse ici]

N'hésitez pas à nous contacter si vous avez besoin de précisions complémentaires.

${SIGNATURE}`,
  };
}

export function buildDecisionEmailContent(
  kind: DecisionEmailKind,
  input: DecisionEmailTemplateInput,
): DecisionEmailContent {
  switch (kind) {
    case "preinscription.accepted":
      return {
        kind,
        subject: "Votre pré-inscription a été acceptée — LT Protect Formation",
        message: buildAcceptedMessage(input),
      };
    case "preinscription.refused":
      return {
        kind,
        subject: "Votre demande de pré-inscription — LT Protect Formation",
        message: buildRefusedMessage(input),
      };
    case "devis.followup":
      return {
        kind,
        subject: "Votre demande de devis — LT Protect Formation",
        message: buildDevisFollowUpMessage(input),
      };
  }
}

export function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}
