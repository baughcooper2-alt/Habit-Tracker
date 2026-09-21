"use client";

import { useState } from "react";
import type { HabitDTO, HabitType } from "@/lib/types";
import { COLOR_KEYS, colorTheme } from "@/lib/colors";

const EMOJI_PRESETS = [
  "📚", "⚖️", "🏋️", "💧", "🍽️", "🥩", "🥑", "🏃", "🧘", "😴",
  "📖", "💊", "🧠", "✍️", "🎯", "☀️", "🧹", "💻", "🎨", "🧑‍🍳",
];

export type HabitFormValues = {
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  unit: string;
  target: string;
  quickAdds: string;
};

export function habitToFormValues(h?: HabitDTO): HabitFormValues {
  return {
    name: h?.name ?? "",
    icon: h?.icon ?? "✨",
    color: h?.color ?? "sky",
    type: h?.type ?? "BOOLEAN",
    unit: h?.unit ?? "",
    target: h ? String(h.target) : "",
    quickAdds: h?.quickAdds?.length ? h.quickAdds.join(", ") : "",
  };
}

export default function HabitForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: HabitFormValues;
  submitLabel: string;
  onSubmit: (values: HabitFormValues) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof HabitFormValues>(key: K, v: HabitFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) {
      setErr("Give it a name.");
      return;
    }
    if (values.type === "QUANTITY" && (!values.target || parseFloat(values.target) <= 0)) {
      setErr("Set a daily target greater than 0.");
      return;
    }
    setErr(null);
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-card p-4 shadow-card">
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
          Name
        </label>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Gym, Water Intake"
          className="w-full rounded-xl border border-cocoa/20 bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-ink/40"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
          Icon
        </label>
        <div className="flex flex-wrap gap-1.5">
          {EMOJI_PRESETS.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => set("icon", e)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all ${
                values.icon === e ? "bg-ink" : "bg-sand"
              }`}
            >
              {e}
            </button>
          ))}
          <input
            value={values.icon}
            onChange={(e) => set("icon", e.target.value.slice(0, 2))}
            className="h-9 w-14 rounded-full border border-cocoa/20 bg-cream text-center text-lg outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_KEYS.map((c) => {
            const theme = colorTheme(c);
            return (
              <button
                type="button"
                key={c}
                onClick={() => set("color", c)}
                className={`h-9 w-9 rounded-full ${theme.accent} transition-all ${
                  values.color === c ? "ring-2 ring-offset-2 ring-ink" : ""
                }`}
                aria-label={c}
              />
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
          Type
        </label>
        <div className="flex gap-2">
          {(["BOOLEAN", "QUANTITY"] as HabitType[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => set("type", t)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                values.type === t ? "bg-ink text-cream" : "bg-sand text-cocoa"
              }`}
            >
              {t === "BOOLEAN" ? "Check off" : "Track amount"}
            </button>
          ))}
        </div>
      </div>

      {values.type === "QUANTITY" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
              Daily target
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={values.target}
              onChange={(e) => set("target", e.target.value)}
              placeholder="100"
              className="w-full rounded-xl border border-cocoa/20 bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-ink/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
              Unit
            </label>
            <input
              value={values.unit}
              onChange={(e) => set("unit", e.target.value)}
              placeholder="oz, kcal, g, min"
              className="w-full rounded-xl border border-cocoa/20 bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-ink/40"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-cocoa">
              Quick-add buttons
            </label>
            <input
              value={values.quickAdds}
              onChange={(e) => set("quickAdds", e.target.value)}
              placeholder="8, 16, 24"
              className="w-full rounded-xl border border-cocoa/20 bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-ink/40"
            />
            <p className="mt-1 text-[11px] text-cocoa">Comma-separated amounts, e.g. 8, 16, 24</p>
          </div>
        </div>
      )}

      {err && <p className="text-sm font-semibold text-rose-600">{err}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full bg-sand py-2.5 text-sm font-bold text-cocoa"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-full bg-ink py-2.5 text-sm font-bold text-cream disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
