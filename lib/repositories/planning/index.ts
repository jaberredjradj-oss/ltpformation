import { isRealDataEnabled } from "@/lib/db/env";
import { staticPlanningRepository } from "@/lib/repositories/planning/static-planning";
import { supabasePlanningRepository } from "@/lib/repositories/planning/supabase-planning";
import type { PlanningRepository } from "@/lib/repositories/types";

export async function getPlanningRepository(): Promise<PlanningRepository> {
  if (isRealDataEnabled()) {
    return supabasePlanningRepository;
  }
  return staticPlanningRepository;
}

export async function loadPlanningSessions() {
  const repository = await getPlanningRepository();
  return repository.listAll();
}

export async function findPlanningSessionById(id: string) {
  const repository = await getPlanningRepository();
  return repository.getById(id);
}
