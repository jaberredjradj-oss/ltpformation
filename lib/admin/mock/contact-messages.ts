import type { AdminContactMessage } from "@/lib/admin/types";

export const MOCK_CONTACT_MESSAGES: AdminContactMessage[] = [
  {
    id: "msg-001",
    firstName: "Julie",
    lastName: "Lambert",
    email: "julie.lambert@gmail.com",
    phone: "06 34 56 78 90",
    message:
      "Bonjour, pourriez-vous me confirmer les prérequis pour intégrer la formation SSIAP 1 en reconversion ?",
    status: "unread",
    submittedAt: "2026-05-21T08:15:00.000Z",
  },
  {
    id: "msg-002",
    firstName: "Marc",
    lastName: "Lefèvre",
    email: "marc.lefevre@entreprise.fr",
    message:
      "Nous souhaitons organiser une session SST pour 10 salariés. Quelles sont vos prochaines disponibilités ?",
    status: "unread",
    submittedAt: "2026-05-20T17:40:00.000Z",
  },
  {
    id: "msg-003",
    firstName: "Émilie",
    lastName: "Garnier",
    email: "emilie.garnier@outlook.com",
    phone: "07 65 43 21 09",
    message: "Est-il possible de visiter le centre avant de s'inscrire ? Merci.",
    status: "answered",
    submittedAt: "2026-05-19T12:05:00.000Z",
  },
  {
    id: "msg-004",
    firstName: "Philippe",
    lastName: "Roux",
    email: "p.roux@pmail.com",
    message:
      "Bonjour, j'ai une question sur le financement CPF pour la formation TFP APS. Pouvez-vous m'orienter ?",
    status: "archived",
    submittedAt: "2026-05-15T09:50:00.000Z",
  },
];
