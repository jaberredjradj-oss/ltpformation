import { MOCK_DEVIS_REQUESTS } from "@/lib/admin/mock/devis-requests";
import { MOCK_PREINSCRIPTIONS } from "@/lib/admin/mock/preinscriptions";
import type { SubmissionsRepository } from "@/lib/admin/repositories/types";

export const mockSubmissionsRepository: SubmissionsRepository = {
  async listDevisRequests() {
    return [...MOCK_DEVIS_REQUESTS].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  async listPreinscriptions() {
    return [...MOCK_PREINSCRIPTIONS].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },
};
