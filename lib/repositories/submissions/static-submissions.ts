import { MOCK_DEVIS_REQUESTS } from "@/lib/admin/mock/devis-requests";
import { MOCK_PREINSCRIPTIONS } from "@/lib/admin/mock/preinscriptions";
import type {
  AdminDevisRequest,
  AdminPreinscription,
} from "@/lib/admin/types";
import type {
  CreateDevisInput,
  CreatePreinscriptionInput,
  SubmissionsRepository,
} from "@/lib/repositories/types";
import { formatSessionDateRange } from "@/lib/planning/format";

let devisStore: AdminDevisRequest[] = [...MOCK_DEVIS_REQUESTS];
let preinscriptionStore: AdminPreinscription[] = [...MOCK_PREINSCRIPTIONS];

function mapDevisInput(input: CreateDevisInput, id: string): AdminDevisRequest {
  const snapshot = input.sessionSnapshot as { dateRange?: string } | null;

  return {
    id,
    company: input.company,
    contactName: `${input.contactFirstName} ${input.contactLastName}`.trim(),
    email: input.email,
    phone: input.phone,
    formationSlug: input.formationSlug,
    formationTitle: input.formationTitle,
    sessionId: input.sessionId,
    sessionLabel: snapshot?.dateRange ?? null,
    participantCount: input.participantCount,
    onSiteTraining: input.onSiteTraining,
    status: "new",
    submittedAt: new Date().toISOString(),
  };
}

function mapPreinscriptionInput(
  input: CreatePreinscriptionInput,
  id: string,
): AdminPreinscription {
  const snapshot = input.sessionSnapshot as { dateRange?: string } | null;

  return {
    id,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    formationSlug: input.formationSlug,
    formationTitle: input.formationTitle,
    sessionId: input.sessionId,
    sessionLabel: snapshot?.dateRange ?? input.sessionId,
    cpfFinancing: input.cpfFinancing,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
}

export const staticSubmissionsRepository: SubmissionsRepository = {
  async createDevis(input) {
    const id = `devis-${Date.now().toString(36)}`;
    devisStore = [mapDevisInput(input, id), ...devisStore];
    return { id };
  },

  async createPreinscription(input) {
    const id = `pre-${Date.now().toString(36)}`;
    preinscriptionStore = [mapPreinscriptionInput(input, id), ...preinscriptionStore];
    return { id };
  },

  async listDevisRequests() {
    return [...devisStore].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  async listPreinscriptions() {
    return [...preinscriptionStore].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  async updateDevisStatus(id, status) {
    devisStore = devisStore.map((item) => (item.id === id ? { ...item, status } : item));
  },

  async updatePreinscriptionStatus(id, status) {
    preinscriptionStore = preinscriptionStore.map((item) =>
      item.id === id ? { ...item, status } : item,
    );
  },
};

export function resetStaticSubmissions(): void {
  devisStore = [...MOCK_DEVIS_REQUESTS];
  preinscriptionStore = [...MOCK_PREINSCRIPTIONS];
}

/** Helper for static snapshot labels when session object is available. */
export { formatSessionDateRange };
