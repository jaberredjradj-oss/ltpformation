import { MOCK_CONTACT_MESSAGES } from "@/lib/admin/mock/contact-messages";
import type { AdminContactMessage, ContactMessageStatus } from "@/lib/admin/types";
import type { MessagesRepository } from "@/lib/repositories/types";

/** Ligne du store démo — champs corbeille internes, absents des vues admin. */
export type TrashableContactMessage = AdminContactMessage & {
  deletedAt?: string;
  deleteExpiresAt?: string;
};

let messageStore: TrashableContactMessage[] = [...MOCK_CONTACT_MESSAGES];

export function softDeleteStaticMessage(
  id: string,
  deletedAt: string,
  deleteExpiresAt: string,
): void {
  messageStore = messageStore.map((item) =>
    item.id === id && !item.deletedAt ? { ...item, deletedAt, deleteExpiresAt } : item,
  );
}

export function restoreStaticMessage(id: string): void {
  messageStore = messageStore.map((item) =>
    item.id === id ? { ...item, deletedAt: undefined, deleteExpiresAt: undefined } : item,
  );
}

/** Purge définitive (démo) — supprime la ligne si elle est en corbeille. */
export function purgeStaticMessage(id: string): boolean {
  const target = messageStore.find((item) => item.id === id && item.deletedAt);
  if (!target) return false;
  messageStore = messageStore.filter((item) => item.id !== id);
  return true;
}

export function listStaticTrashedMessages(): TrashableContactMessage[] {
  return messageStore.filter((item) => item.deletedAt);
}

export const staticMessagesRepository: MessagesRepository = {
  async createMessage(input) {
    const id = `msg-${Date.now().toString(36)}`;
    messageStore = [
      {
        id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone ?? undefined,
        message: input.message,
        status: "unread",
        submittedAt: new Date().toISOString(),
      },
      ...messageStore,
    ];
    return { id };
  },

  async listContactMessages() {
    return messageStore
      .filter((item) => !item.deletedAt)
      .map((item): AdminContactMessage => {
        const { deletedAt, deleteExpiresAt, ...rest } = item;
        void deletedAt;
        void deleteExpiresAt;
        return rest;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async updateMessageStatus(id, status: ContactMessageStatus) {
    messageStore = messageStore.map((item) => (item.id === id ? { ...item, status } : item));
  },
};

export function resetStaticMessages(): void {
  messageStore = [...MOCK_CONTACT_MESSAGES];
}
