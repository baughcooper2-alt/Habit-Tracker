"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { addDaysStr, todayStr } from "@/lib/dates";
import type { HabitDTO } from "@/lib/types";
import HabitCard from "@/components/HabitCard";
import ProgressRing from "@/components/ProgressRing";

function formatHeaderDate(dateStr: string, today: string) {
  if (dateStr === today) return "Today";
  if (dateStr === addDaysStr(today, -1)) return "Yesterday";
  if (dateStr === addDaysStr(today, 1)) return "Tomorrow";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function TodayPage() {
  const [today, setToday] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [habits, setHabits] = useState<HabitDTO[] | null>(null);
  const [values, setValues] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = todayStr();
    setToday(t);
    setDate(t);
  }, []);

  const load = useCallback(async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getToday(d);
      setHabits(res.habits);
      const map: Record<string, number> = {};
      for (const e of res.entries) map[e.habitId] = e.value;
      setValues(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) load(date);
  }, [date, load]);

  const { completed, total, percent } = useMemo(() => {
    if (!habits) return { completed: 0, total: 0, percent: 0 };
    let c = 0;
    for (const h of habits) {
      const v = values[h.id] ?? 0;
      const target = h.type === "BOOLEAN" ? 1 : h.target;
      if (v >= target) c += 1;
    }
    const t = habits.length;
    return { completed: c, total: t, percent: t > 0 ? Math.round((c / t) * 100) : 0 };
  }, [habits, values]);

  function updateLocal(habitId: string, value: number) {
    setValues((prev) => ({ ...prev, [habitId]: value }));
  }

  async function handleToggle(habitId: string) {
    if (!date) return;
    const prev = values[habitId] ?? 0;
    updateLocal(habitId, prev >= 1 ? 0 : 1);
    try {
      const { value } = await api.toggleEntry(habitId, date);
      updateLocal(habitId, value);
    } catch {
      updateLocal(habitId, prev);
    }
  }

  async function handleIncrement(habitId: string, delta: number) {
    if (!date) return;
    const prev = values[habitId] ?? 0;
    const optimistic = Math.max(0, prev + delta);
    updateLocal(habitId, optimistic);
    try {
      const { value } = await api.incrementEntry(habitId, date, delta);
      updateLocal(habitId, value);
    } catch {
      updateLocal(habitId, prev);
    }
  }

  async function handleSetExact(habitId: string, value: number) {
    if (!date) return;
    const prev = values[habitId] ?? 0;
    updateLocal(habitId, value);
    try {
      const { value: v } = await api.setEntry(habitId, date, value);
      updateLocal(habitId, v);
    } catch {
      updateLocal(habitId, prev);
    }
  }

  if (!date || !today) return null;

  return (
    <div className="animate-fadein">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-cocoa">{formatHeaderDate(date, today)}</p>
          <h1 className="text-2xl font-extrabold text-ink">
            {total > 0 && percent === 100 ? "All done! 🎉" : "Let's get it done"}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => setDate((d) => (d ? addDaysStr(d, -1) : d))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink active:scale-95"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next day"
            disabled={date >= today}
            onClick={() => setDate((d) => (d ? addDaysStr(d, 1) : d))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink disabled:opacity-30 active:scale-95"
          >
            ›
          </button>
        </div>
      </div>

      {date !== today && (
        <button
          type="button"
          onClick={() => setDate(today)}
          className="mt-2 text-xs font-bold text-cocoa underline underline-offset-2"
        >
          Jump back to today
        </button>
      )}

      <div className="mt-5 flex items-center gap-4 rounded-3xl bg-white px-5 py-4 shadow-card">
        <ProgressRing percent={percent} label={`${completed}/${total}`} />
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">
            {total === 0
              ? "No habits yet"
              : percent === 100
              ? "Every habit checked off."
              : `${total - completed} habit${total - completed === 1 ? "" : "s"} left`}
          </p>
          <p className="mt-0.5 text-xs text-cocoa">
            {total === 0
              ? "Add your first habit to get started."
              : "Progress updates the moment you log something."}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      {loading && !habits && (
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-sand" />
          ))}
        </div>
      )}

      {habits && habits.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-cocoa/25 px-5 py-8 text-center">
          <p className="text-3xl">🌱</p>
          <p className="mt-2 text-sm font-bold text-ink">No habits yet</p>
          <p className="mt-1 text-sm text-cocoa">
            Add school work, gym, water, LSAT study — whatever you want to stay on top of.
          </p>
          <Link
            href="/habits"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm font-bold text-cream"
          >
            Add a habit
          </Link>
        </div>
      )}

      {habits && habits.length > 0 && (
        <div className="mt-5 space-y-2.5">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              value={values[h.id] ?? 0}
              onToggle={() => handleToggle(h.id)}
              onIncrement={(delta) => handleIncrement(h.id, delta)}
              onSetExact={(value) => handleSetExact(h.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
