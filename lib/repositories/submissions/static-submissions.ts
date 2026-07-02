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

/** Lignes du store démo — champs corbeille internes, absents des vues admin. */
type TrashFields = { deletedAt?: string; deleteExpiresAt?: string };
export type TrashablePreinscription = AdminPreinscription & TrashFields;
export type TrashableDevis = AdminDevisRequest & TrashFields;

let devisStore: TrashableDevis[] = [...MOCK_DEVIS_REQUESTS];
let preinscriptionStore: TrashablePreinscription[] = [...MOCK_PREINSCRIPTIONS];

function softDeleteById<T extends TrashFields & { id: string }>(
  store: T[],
  id: string,
  deletedAt: string,
  deleteExpiresAt: string,
): T[] {
  return store.map((item) =>
    item.id === id && !item.deletedAt ? { ...item, deletedAt, deleteExpiresAt } : item,
  );
}

function restoreById<T extends TrashFields & { id: string }>(store: T[], id: string): T[] {
  return store.map((item) =>
    item.id === id ? { ...item, deletedAt: undefined, deleteExpiresAt: undefined } : item,
  );
}

export function softDeleteStaticPreinscription(
  id: string,
  deletedAt: string,
  deleteExpiresAt: string,
): void {
  preinscriptionStore = softDeleteById(preinscriptionStore, id, deletedAt, deleteExpiresAt);
}

export function restoreStaticPreinscription(id: string): void {
  preinscriptionStore = restoreById(preinscriptionStore, id);
}

/** Purge définitive (démo) — supprime la ligne si elle est en corbeille. */
export function purgeStaticPreinscription(id: string): boolean {
  const target = preinscriptionStore.find((item) => item.id === id && item.deletedAt);
  if (!target) return false;
  preinscriptionStore = preinscriptionStore.filter((item) => item.id !== id);
  return true;
}

export function listStaticTrashedPreinscriptions(): TrashablePreinscription[] {
  return preinscriptionStore.filter((item) => item.deletedAt);
}

export function softDeleteStaticDevis(
  id: string,
  deletedAt: string,
  deleteExpiresAt: string,
): void {
  devisStore = softDeleteById(devisStore, id, deletedAt, deleteExpiresAt);
}

export function restoreStaticDevis(id: string): void {
  devisStore = restoreById(devisStore, id);
}

/** Purge définitive (démo) — supprime la ligne si elle est en corbeille. */
export function purgeStaticDevis(id: string): boolean {
  const target = devisStore.find((item) => item.id === id && item.deletedAt);
  if (!target) return false;
  devisStore = devisStore.filter((item) => item.id !== id);
  return true;
}

export function listStaticTrashedDevis(): TrashableDevis[] {
  return devisStore.filter((item) => item.deletedAt);
}

function stripTrashFields<T extends TrashFields>(item: T): Omit<T, keyof TrashFields> {
  const { deletedAt, deleteExpiresAt, ...rest } = item;
  void deletedAt;
  void deleteExpiresAt;
  return rest;
}

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
    return devisStore
      .filter((item) => !item.deletedAt)
      .map((item): AdminDevisRequest => stripTrashFields(item))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async listPreinscriptions() {
    return preinscriptionStore
      .filter((item) => !item.deletedAt)
      .map((item): AdminPreinscription => stripTrashFields(item))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
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
