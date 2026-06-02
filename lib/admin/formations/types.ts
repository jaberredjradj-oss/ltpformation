import type {
  FormationCategoryId,
  FormationType,
} from "@/lib/formations/types";
import type { FormationSource } from "@/lib/repositories/formations/types";

/** Flat row shape consumed by the admin formations list UI. */
export interface AdminFormationRow {
  slug: string;
  title: string;
  shortTitle: string;
  category: FormationCategoryId;
  categoryLabel: string;
  type: FormationType;
  typeLabel: string;
  level: string | null;
  durationLabel: string;
  durationHours: number;
  priceLabel: string;
  priceAmount: number;
  cpfEligible: boolean;
  active: boolean;
  source: FormationSource;
  sortOrder: number;
  updatedAt: string | null;
}
