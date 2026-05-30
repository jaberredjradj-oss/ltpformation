import { PLANNING_SESSIONS } from "@/lib/planning/sessions";
import type { PlanningSession } from "@/lib/planning/types";
import type { PlanningRepository } from "@/lib/repositories/types";

function cloneSessions(): PlanningSession[] {
  return PLANNING_SESSIONS.map((session) => ({ ...session, notes: [...session.notes] }));
}

/** In-memory fallback — read-only mutations log only. */
let memorySessions = cloneSessions();

export const staticPlanningRepository: PlanningRepository = {
  async listAll() {
    return memorySessions.map((session) => ({ ...session, notes: [...session.notes] }));
  },

  async getById(id) {
    const session = memorySessions.find((item) => item.id === id);
    return session ? { ...session, notes: [...session.notes] } : null;
  },

  async create(session) {
    memorySessions = [...memorySessions, session];
    return session;
  },

  async update(id, patch) {
    const index = memorySessions.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Session introuvable: ${id}`);
    }
    const updated = {
      ...memorySessions[index],
      ...patch,
      notes: patch.notes ?? memorySessions[index].notes,
    };
    memorySessions[index] = updated;
    return { ...updated, notes: [...updated.notes] };
  },

  async upsertMany(sessions) {
    memorySessions = sessions.map((session) => ({ ...session, notes: [...session.notes] }));
  },

  async delete(id) {
    const index = memorySessions.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Session introuvable: ${id}`);
    }
    memorySessions = memorySessions.filter((item) => item.id !== id);
  },
};

export function resetStaticPlanningSessions(): void {
  memorySessions = cloneSessions();
}
