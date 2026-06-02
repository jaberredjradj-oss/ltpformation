import type { Formation } from "@/lib/formations/types";

/**
 * A formation as managed in the database, with the admin-only metadata
 * (active flag, ordering, custom cover image, source) that the public
 * `Formation` shape does not carry.
 */
export type FormationSource = "static" | "admin" | "static-override";

export interface ManagedFormation {
  formation: Formation;
  active: boolean;
  sortOrder: number;
  coverImageUrl: string | null;
  /** "static" = in-memory baseline (not persisted); others come from the DB. */
  source: FormationSource;
  updatedAt: string | null;
}

export interface FormationWriteInput {
  formation: Formation;
  active: boolean;
  sortOrder?: number;
  coverImageUrl?: string | null;
  source?: "admin" | "static-override";
}

/**
 * Persistence boundary for admin-managed formations. Only the Supabase
 * implementation exists; when real data is disabled the overlay is simply
 * skipped and the static catalog is used as-is.
 */
export interface FormationsRepository {
  listAll(): Promise<ManagedFormation[]>;
  getBySlug(slug: string): Promise<ManagedFormation | null>;
  create(input: FormationWriteInput): Promise<ManagedFormation>;
  update(slug: string, input: FormationWriteInput): Promise<ManagedFormation>;
  delete(slug: string): Promise<void>;
}
