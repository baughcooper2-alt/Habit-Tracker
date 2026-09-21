"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { monthLabel, todayStr } from "@/lib/dates";
import type { HabitDTO, HabitStreak, MonthStatsResponse, YearStatsResponse } from "@/lib/types";
import { MonthGrid, YearGrid } from "@/components/Heatmap";
import MonthBars from "@/components/MonthBars";
import StreakList from "@/components/StreakList";

type View = "month" | "year";

export default function StatsPage() {
  const [view, setView] = useState<View>("month");
  const [now, setNow] = useState<{ y: number; m: number } | null>(null);
  const [monthData, setMonthData] = useState<MonthStatsResponse | null>(null);
  const [yearData, setYearData] = useState<YearStatsResponse | null>(null);
  const [habits, setHabits] = useState<HabitDTO[]>([]);
  const [streaks, setStreaks] = useState<Record<string, HabitStreak>>({});

  useEffect(() => {
    const t = todayStr();
    const [y, m] = t.split("-").map(Number);
    setNow({ y, m });
  }, []);

  useEffect(() => {
    api.listHabits().then((res) => setHabits(res.habits));
  }, []);

  useEffect(() => {
    if (habits.length === 0) return;
    api.getStreaks(habits.map((h) => h.id)).then((res) => {
      const map: Record<string, HabitStreak> = {};
      for (const s of res.streaks) map[s.habitId] = s;
      setStreaks(map);
    });
  }, [habits]);

  useEffect(() => {
    if (!now) return;
    if (view === "month") {
      api.getMonthStats(now.y, now.m).then(setMonthData);
    } else {
      api.getYearStats(now.y).then(setYearData);
    }
  }, [now, view]);

  if (!now) return null;

  function shiftMonth(delta: number) {
    setNow((prev) => {
      if (!prev) return prev;
      let m = prev.m + delta;
      let y = prev.y;
      if (m > 12) {
        m = 1;
        y += 1;
      } else if (m < 1) {
        m = 12;
        y -= 1;
      }
      return { y, m };
    });
  }

  function shiftYear(delta: number) {
    setNow((prev) => (prev ? { y: prev.y + delta, m: prev.m } : prev));
  }

  return (
    <div className="animate-fadein">
      <h1 className="text-2xl font-extrabold text-ink">Progress</h1>

      <div className="mt-4 flex gap-2">
        {(["month", "year"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition-colors ${
              view === v ? "bg-ink text-cream" : "bg-sand text-cocoa"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "month" && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink active:scale-95"
            >
              ‹
            </button>
            <h2 className="text-base font-extrabold text-ink">{monthLabel(now.y, now.m)}</h2>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink active:scale-95"
            >
              ›
            </button>
          </div>

          {monthData && (
            <>
              <div className="mt-4 flex gap-3">
                <StatPill label="Average" value={`${monthData.averagePercent}%`} />
                <StatPill
                  label="Best day"
                  value={monthData.bestDay ? `${monthData.bestDay.percent}%` : "–"}
                />
              </div>
              <div className="mt-4 rounded-3xl bg-white p-4 shadow-card">
                <MonthGrid year={now.y} month={now.m} days={monthData.days} />
              </div>
            </>
          )}
        </div>
      )}

      {view === "year" && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftYear(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink active:scale-95"
            >
              ‹
            </button>
            <h2 className="text-base font-extrabold text-ink">{now.y}</h2>
            <button
              type="button"
              onClick={() => shiftYear(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink active:scale-95"
            >
              ›
            </button>
          </div>

          {yearData && (
            <>
              <div className="mt-4 flex gap-3">
                <StatPill label="Average" value={`${yearData.averagePercent}%`} />
              </div>
              <div className="mt-4 rounded-3xl bg-white p-4 shadow-card">
                <MonthBars months={yearData.months} />
              </div>
              <div className="mt-4 rounded-3xl bg-white p-4 shadow-card">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cocoa">
                  Every day this year
                </p>
                <YearGrid days={yearData.days} />
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cocoa">Streaks</p>
        <StreakList habits={habits} streaks={streaks} />
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-white px-4 py-3 text-center shadow-soft">
      <p className="text-lg font-extrabold text-ink">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">{label}</p>
    </div>
  );
}
