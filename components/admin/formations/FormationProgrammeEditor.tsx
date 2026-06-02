"use client";

import { adminStyles } from "@/components/admin/admin-styles";
import { AdminStringListField } from "@/components/admin/formations/AdminStringListField";
import type { FormationModule, FormationProgramme } from "@/lib/formations/types";
import { cn } from "@/lib/utils";

interface FormationProgrammeEditorProps {
  programme: FormationProgramme;
  onChange: (programme: FormationProgramme) => void;
}

function emptyModule(): FormationModule {
  return { title: "", hours: undefined, content: [] };
}

export function FormationProgrammeEditor({
  programme,
  onChange,
}: FormationProgrammeEditorProps) {
  const modules = programme.modules ?? [];

  function patchProgramme(patch: Partial<FormationProgramme>) {
    onChange({ ...programme, ...patch });
  }

  function updateModule(index: number, patch: Partial<FormationModule>) {
    patchProgramme({
      modules: modules.map((module, i) =>
        i === index ? { ...module, ...patch } : module,
      ),
    });
  }

  function removeModule(index: number) {
    patchProgramme({ modules: modules.filter((_, i) => i !== index) });
  }

  function moveModule(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= modules.length) return;
    const next = [...modules];
    [next[index], next[target]] = [next[target], next[index]];
    patchProgramme({ modules: next });
  }

  function addModule() {
    patchProgramme({ modules: [...modules, emptyModule()] });
  }

  return (
    <div className="block min-w-0 sm:col-span-2">
      <div className="mb-3 grid gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className={`mb-1.5 block ${adminStyles.label}`}>
            Volume horaire total (optionnel)
          </span>
          <input
            type="number"
            min={0}
            className={cn(adminStyles.input, "px-3 py-2")}
            value={programme.totalHours ?? ""}
            placeholder="ex. 70"
            onChange={(e) =>
              patchProgramme({
                totalHours: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
        </label>
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => (
          <div key={index} className={cn(adminStyles.surfaceMuted, "p-4")}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Module {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className={adminStyles.btnGhost}
                  onClick={() => moveModule(index, -1)}
                  disabled={index === 0}
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={adminStyles.btnGhost}
                  onClick={() => moveModule(index, 1)}
                  disabled={index === modules.length - 1}
                  title="Descendre"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="text-xs font-medium text-red-500 transition-colors hover:text-red-700"
                  onClick={() => removeModule(index)}
                  title="Supprimer le module"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
              <label className="block min-w-0">
                <span className={`mb-1.5 block ${adminStyles.label}`}>Titre du module</span>
                <input
                  className={cn(adminStyles.input, "px-3 py-2")}
                  value={module.title}
                  placeholder="ex. Prévention des incendies"
                  onChange={(e) => updateModule(index, { title: e.target.value })}
                />
              </label>
              <label className="block min-w-0">
                <span className={`mb-1.5 block ${adminStyles.label}`}>Heures (optionnel)</span>
                <input
                  type="number"
                  min={0}
                  className={cn(adminStyles.input, "px-3 py-2")}
                  value={module.hours ?? ""}
                  placeholder="ex. 14"
                  onChange={(e) =>
                    updateModule(index, {
                      hours: e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>

            <div className="mt-3">
              <AdminStringListField
                label="Contenu du module"
                items={module.content}
                onChange={(content) => updateModule(index, { content })}
                placeholder="Point abordé dans ce module"
                addLabel="Ajouter un point"
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={cn(adminStyles.btnAccent, "mt-3")} onClick={addModule}>
        + Ajouter un module
      </button>
    </div>
  );
}
