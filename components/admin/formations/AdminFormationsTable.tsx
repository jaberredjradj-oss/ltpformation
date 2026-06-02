"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AdminFormationRow } from "@/lib/admin/formations/types";
import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type { FormationSource } from "@/lib/repositories/formations/types";
import { adminStyles } from "@/components/admin/admin-styles";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFilterSelect } from "@/components/admin/AdminFilterSelect";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from "@/components/admin/AdminDataTable";

interface AdminFormationsTableProps {
  rows: AdminFormationRow[];
}

const SOURCE_LABELS: Record<FormationSource, string> = {
  static: "Catalogue",
  admin: "Créée",
  "static-override": "Personnalisée",
};

function sourceTone(source: FormationSource) {
  if (source === "admin") return "blue" as const;
  if (source === "static-override") return "gold" as const;
  return "neutral" as const;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "Toutes les catégories" },
  ...FORMATION_CATEGORIES.map((category) => ({
    value: category.id,
    label: category.label,
  })),
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Actives" },
  { value: "inactive", label: "Désactivées" },
];

export function AdminFormationsTable({ rows }: AdminFormationsTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (status === "active" && !row.active) return false;
      if (status === "inactive" && row.active) return false;
      if (!query) return true;
      return (
        row.title.toLowerCase().includes(query) ||
        row.slug.toLowerCase().includes(query) ||
        row.categoryLabel.toLowerCase().includes(query)
      );
    });
  }, [rows, search, category, status]);

  const activeCount = useMemo(() => rows.filter((row) => row.active).length, [rows]);

  function renderStatus(row: AdminFormationRow) {
    return (
      <AdminStatusBadge
        label={row.active ? "Active" : "Désactivée"}
        tone={row.active ? "success" : "neutral"}
        className="whitespace-nowrap"
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Formations"
        description={`${rows.length} formations au catalogue • ${activeCount} actives. Recherchez et filtrez le catalogue.`}
      />

      <div className="mb-5 flex justify-end">
        <Link href="/admin/formations/new" className={adminStyles.btnPrimary}>
          + Nouvelle formation
        </Link>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="block min-w-0">
          <span className={`mb-1.5 block ${adminStyles.label}`}>Recherche</span>
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Titre, slug, catégorie…"
          />
        </label>
        <AdminFilterSelect
          label="Catégorie"
          value={category}
          options={CATEGORY_OPTIONS}
          onChange={setCategory}
        />
        <AdminFilterSelect
          label="Statut"
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          title="Aucune formation"
          description="Aucune formation ne correspond à votre recherche."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filtered.map((row) => (
              <div key={row.slug} className={adminStyles.mobileCard}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={`/admin/formations/${row.slug}/edit`}
                    className="text-base font-semibold break-words text-navy-950 hover:text-blue-600"
                  >
                    {row.title}
                  </Link>
                  {renderStatus(row)}
                </div>
                <p className="mt-1 break-all text-xs text-slate-500">{row.slug}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <AdminStatusBadge label={row.categoryLabel} tone="blue" />
                  <AdminStatusBadge label={row.typeLabel} className="whitespace-nowrap" />
                  <AdminStatusBadge
                    label={SOURCE_LABELS[row.source]}
                    tone={sourceTone(row.source)}
                    className="whitespace-nowrap"
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1 text-sm text-body-strong">
                  <p>{row.durationLabel}</p>
                  <p>{row.priceLabel}</p>
                  <p>CPF : {row.cpfEligible ? "Oui" : "Non"}</p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <Link
                    href={`/admin/formations/${row.slug}/edit`}
                    className={adminStyles.btnSecondary}
                  >
                    Éditer
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <AdminDataTable className="hidden md:block">
            <AdminTable>
              <AdminTableHead>
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Formation</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Catégorie</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Durée</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Tarif</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">CPF</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Statut</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Actions</th>
                </tr>
              </AdminTableHead>
              <AdminTableBody>
                {filtered.map((row) => (
                  <AdminTableRow key={row.slug}>
                    <AdminTableCell>
                      <Link
                        href={`/admin/formations/${row.slug}/edit`}
                        className="font-semibold break-words text-navy-950 hover:text-blue-600"
                      >
                        {row.title}
                      </Link>
                      <p className="mt-0.5 break-all text-xs text-slate-500">{row.slug}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="break-words text-sm">{row.categoryLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="text-sm">{row.typeLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="whitespace-nowrap text-sm">{row.durationLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="break-words text-sm">{row.priceLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="text-sm">{row.cpfEligible ? "Oui" : "Non"}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge
                        label={SOURCE_LABELS[row.source]}
                        tone={sourceTone(row.source)}
                        className="whitespace-nowrap"
                      />
                    </AdminTableCell>
                    <AdminTableCell>{renderStatus(row)}</AdminTableCell>
                    <AdminTableCell>
                      <Link
                        href={`/admin/formations/${row.slug}/edit`}
                        className={adminStyles.btnSecondary}
                      >
                        Éditer
                      </Link>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          </AdminDataTable>
        </>
      )}
    </>
  );
}
