"use client";

import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminStringListFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  addLabel?: string;
}

export function AdminStringListField({
  label,
  items,
  onChange,
  placeholder,
  hint,
  multiline = false,
  addLabel = "Ajouter une ligne",
}: AdminStringListFieldProps) {
  function updateAt(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    onChange([...items, ""]);
  }

  return (
    <div className="block min-w-0 sm:col-span-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className={adminStyles.label}>{label}</span>
        <span className="text-[11px] text-slate-400">{items.length} élément(s)</span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                className={cn(adminStyles.input, "min-h-16 px-3 py-2")}
                value={item}
                placeholder={placeholder}
                onChange={(e) => updateAt(index, e.target.value)}
              />
            ) : (
              <input
                className={cn(adminStyles.input, "px-3 py-2")}
                value={item}
                placeholder={placeholder}
                onChange={(e) => updateAt(index, e.target.value)}
              />
            )}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className={adminStyles.btnGhost}
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Monter"
                title="Monter"
              >
                ↑
              </button>
              <button
                type="button"
                className={adminStyles.btnGhost}
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Descendre"
                title="Descendre"
              >
                ↓
              </button>
              <button
                type="button"
                className="text-xs font-medium text-red-500 transition-colors hover:text-red-700"
                onClick={() => removeAt(index)}
                aria-label="Supprimer la ligne"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={cn(adminStyles.btnSecondary, "mt-2")} onClick={add}>
        + {addLabel}
      </button>

      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
