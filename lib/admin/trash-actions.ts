"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import type { TrashEntityType } from "@/lib/admin/types";
import { getTrashRepository } from "@/lib/repositories";

const VALID_ENTITY_TYPES: readonly TrashEntityType[] = ["preinscription", "devis", "message"];

function revalidateTrashPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/preinscriptions");
  revalidatePath("/admin/demandes");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/corbeille");
}

function validate(entityType: string, id: string): TrashEntityType | null {
  if (!VALID_ENTITY_TYPES.includes(entityType as TrashEntityType)) return null;
  if (typeof id !== "string" || id.trim().length === 0) return null;
  return entityType as TrashEntityType;
}

/** Suppression logique : place l'enregistrement (et ses documents) en corbeille 7 jours. */
export async function trashItem(entityType: string, id: string) {
  await assertAdminAccess();

  const type = validate(entityType, id);
  if (!type) {
    return { ok: false as const, error: "Élément invalide." };
  }

  try {
    const repo = await getTrashRepository();
    await repo.softDelete(type, id);
  } catch {
    return { ok: false as const, error: "Suppression impossible. Réessayez." };
  }

  revalidateTrashPaths();
  return { ok: true as const };
}

/** Restaure l'enregistrement et ses documents depuis la corbeille. */
export async function restoreItem(entityType: string, id: string) {
  await assertAdminAccess();

  const type = validate(entityType, id);
  if (!type) {
    return { ok: false as const, error: "Élément invalide." };
  }

  try {
    const repo = await getTrashRepository();
    await repo.restore(type, id);
  } catch {
    return { ok: false as const, error: "Restauration impossible. Réessayez." };
  }

  revalidateTrashPaths();
  return { ok: true as const };
}

/** Suppression définitive et irréversible de l'enregistrement en corbeille. */
export async function purgeItem(entityType: string, id: string) {
  await assertAdminAccess();

  const type = validate(entityType, id);
  if (!type) {
    return { ok: false as const, error: "Élément invalide." };
  }

  try {
    const repo = await getTrashRepository();
    await repo.purge(type, id);
  } catch {
    return { ok: false as const, error: "Suppression définitive impossible. Réessayez." };
  }

  revalidateTrashPaths();
  return { ok: true as const };
}
