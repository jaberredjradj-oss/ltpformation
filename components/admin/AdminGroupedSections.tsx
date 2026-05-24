"use client";

import type { AdminListGroupSection } from "@/lib/admin/list-controls/types";
import { AdminListSection } from "@/components/admin/AdminListSection";

interface AdminGroupedSectionsProps<T> {
  groups: AdminListGroupSection<T>[];
  renderItems: (items: T[]) => React.ReactNode;
}

export function AdminGroupedSections<T>({ groups, renderItems }: AdminGroupedSectionsProps<T>) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <AdminListSection key={group.key} title={group.label} count={group.items.length}>
          {renderItems(group.items)}
        </AdminListSection>
      ))}
    </div>
  );
}
