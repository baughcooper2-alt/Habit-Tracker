"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { HabitDTO } from "@/lib/types";
import { colorTheme } from "@/lib/colors";
import HabitForm, { habitToFormValues, type HabitFormValues } from "@/components/HabitForm";

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitDTO[]>([]);
  const [archived, setArchived] = useState<HabitDTO[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [mode, setMode] = useState<{ kind: "create" } | { kind: "edit"; habit: HabitDTO } | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const res = await api.listHabits(true);
    setHabits(res.habits.filter((h) => !h.archived));
    setArchived(res.habits.filter((h) => h.archived));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function parseFormValues(values: HabitFormValues) {
    return {
      name: values.name.trim(),
      icon: values.icon,
      color: values.color,
      type: values.type,
      unit: values.type === "QUANTITY" ? values.unit.trim() || null : null,
      target: values.type === "QUANTITY" ? parseFloat(values.target) : 1,
      quickAdds:
        values.type === "QUANTITY"
          ? values.quickAdds
              .split(",")
              .map((s) => parseFloat(s.trim()))
              .filter((n) => !Number.isNaN(n) && n > 0)
          : [],
    };
  }

  async function handleCreate(values: HabitFormValues) {
    await api.createHabit(parseFormValues(values));
    setMode(null);
    await refresh();
  }

  async function handleEdit(id: string, values: HabitFormValues) {
    await api.updateHabit(id, parseFormValues(values));
    setMode(null);
    await refresh();
  }

  async function handleArchive(id: string, archived: boolean) {
    await api.updateHabit(id, { archived });
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this habit and all its logged history? This can't be undone.")) return;
    await api.deleteHabit(id);
    await refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const next = [...habits];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setHabits(next);
    await api.reorderHabits(next.map((h) => h.id));
  }

  return (
    <div className="animate-fadein">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Your habits</h1>
        {!mode && (
          <button
            type="button"
            onClick={() => setMode({ kind: "create" })}
            className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream active:scale-95"
          >
            + Add
          </button>
        )}
      </div>

      {mode && (
        <div className="mt-4">
          <HabitForm
            initial={mode.kind === "edit" ? habitToFormValues(mode.habit) : habitToFormValues()}
            submitLabel={mode.kind === "edit" ? "Save changes" : "Create habit"}
            onCancel={() => setMode(null)}
            onSubmit={(values) =>
              mode.kind === "edit" ? handleEdit(mode.habit.id, values) : handleCreate(values)
            }
          />
        </div>
      )}

      {!mode && (
        <>
          {loading ? (
            <div className="mt-5 space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-sand" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <p className="mt-6 text-sm text-cocoa">No habits yet. Tap “+ Add” to create your first one.</p>
          ) : (
            <div className="mt-5 space-y-2.5">
              {habits.map((h, i) => {
                const theme = colorTheme(h.color);
                return (
                  <div key={h.id} className="rounded-2xl bg-card px-4 py-3 shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${theme.soft} text-xl`}>
                        {h.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{h.name}</p>
                        <p className="truncate text-xs text-cocoa">
                          {h.type === "BOOLEAN" ? "Check off" : `${h.target} ${h.unit ?? ""} / day`}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-xs text-ink disabled:opacity-30"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === habits.length - 1}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-xs text-ink disabled:opacity-30"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <div className="mt-2.5 flex gap-2 border-t border-sand pt-2.5">
                      <button
                        type="button"
                        onClick={() => setMode({ kind: "edit", habit: h })}
                        className="flex-1 rounded-full bg-sand py-1.5 text-xs font-bold text-ink"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchive(h.id, true)}
                        className="flex-1 rounded-full bg-sand py-1.5 text-xs font-bold text-cocoa"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {archived.length > 0 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowArchived((s) => !s)}
                className="text-xs font-bold uppercase tracking-wide text-cocoa"
              >
                {showArchived ? "Hide" : "Show"} archived ({archived.length})
              </button>
              {showArchived && (
                <div className="mt-3 space-y-2.5">
                  {archived.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-3 rounded-2xl bg-sand/60 px-4 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg opacity-60">
                        {h.icon}
                      </span>
                      <p className="flex-1 text-sm font-bold text-cocoa">{h.name}</p>
                      <button
                        type="button"
                        onClick={() => handleArchive(h.id, false)}
                        className="rounded-full bg-sand px-3 py-1.5 text-xs font-bold text-ink"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(h.id)}
                        className="rounded-full bg-sand px-3 py-1.5 text-xs font-bold text-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
