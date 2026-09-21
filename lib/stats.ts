import { prisma } from "@/lib/prisma";
import {
  addDaysStr,
  daysInMonth,
  strToUtcDate,
  todayStr,
  utcDateToStr,
} from "@/lib/dates";
import { serializeHabit } from "@/lib/habits";
import type { DayStat, HabitStreak, MonthStatsResponse, YearStatsResponse } from "@/lib/types";
import type { Habit } from "@prisma/client";

export function isCompleted(habit: Habit, value: number | undefined): boolean {
  const v = value ?? 0;
  if (habit.type === "BOOLEAN") return v >= 1;
  return v >= habit.target;
}

function habitActiveOn(habit: Habit, dateStr: string): boolean {
  const created = utcDateToStr(habit.createdAt);
  return created <= dateStr;
}

async function computeRangeStats(
  startStr: string,
  endStr: string
): Promise<DayStat[]> {
  const [habits, entries] = await Promise.all([
    prisma.habit.findMany({ where: { archived: false } }),
    prisma.entry.findMany({
      where: { date: { gte: strToUtcDate(startStr), lte: strToUtcDate(endStr) } },
    }),
  ]);

  const entriesByDay = new Map<string, Map<string, number>>();
  for (const e of entries) {
    const dStr = utcDateToStr(e.date);
    if (!entriesByDay.has(dStr)) entriesByDay.set(dStr, new Map());
    entriesByDay.get(dStr)!.set(e.habitId, e.value);
  }

  const days: DayStat[] = [];
  let cursor = startStr;
  while (cursor <= endStr) {
    const activeHabits = habits.filter((h) => habitActiveOn(h, cursor));
    const dayEntries = entriesByDay.get(cursor);
    let completed = 0;
    for (const h of activeHabits) {
      if (isCompleted(h, dayEntries?.get(h.id))) completed += 1;
    }
    const total = activeHabits.length;
    days.push({
      date: cursor,
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
    cursor = addDaysStr(cursor, 1);
  }
  return days;
}

export async function getMonthStats(
  year: number,
  month: number
): Promise<MonthStatsResponse> {
  const dim = daysInMonth(year, month);
  const startStr = `${year}-${String(month).padStart(2, "0")}-01`;
  const endStr = `${year}-${String(month).padStart(2, "0")}-${String(dim).padStart(2, "0")}`;
  const today = todayStr();
  const cappedEnd = endStr > today ? today : endStr;

  const days = await computeRangeStats(startStr, cappedEnd);
  // pad remaining future days (of the month) with null-ish placeholders so the grid stays full
  let cursor = addDaysStr(cappedEnd, 1);
  while (cursor <= endStr) {
    days.push({ date: cursor, completed: 0, total: 0, percent: -1 });
    cursor = addDaysStr(cursor, 1);
  }

  const withData = days.filter((d) => d.total > 0);
  const averagePercent = withData.length
    ? Math.round(withData.reduce((s, d) => s + d.percent, 0) / withData.length)
    : 0;
  const bestDay =
    withData.length > 0
      ? withData.reduce((best, d) => (d.percent > best.percent ? d : best))
      : null;

  return { year, month, days, averagePercent, bestDay };
}

export async function getYearStats(year: number): Promise<YearStatsResponse> {
  const startStr = `${year}-01-01`;
  const endStr = `${year}-12-31`;
  const today = todayStr();
  const cappedEnd = endStr > today ? today : endStr;
  const startCapped = startStr > cappedEnd ? cappedEnd : startStr;

  const days =
    startStr > cappedEnd ? [] : await computeRangeStats(startCapped, cappedEnd);

  const byMonth = new Map<number, DayStat[]>();
  for (const d of days) {
    const m = parseInt(d.date.slice(5, 7), 10);
    if (!byMonth.has(m)) byMonth.set(m, []);
    if (d.total > 0) byMonth.get(m)!.push(d);
  }
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const list = byMonth.get(m) ?? [];
    const avg = list.length
      ? Math.round(list.reduce((s, d) => s + d.percent, 0) / list.length)
      : 0;
    return { month: m, averagePercent: avg };
  });

  const withData = days.filter((d) => d.total > 0);
  const averagePercent = withData.length
    ? Math.round(withData.reduce((s, d) => s + d.percent, 0) / withData.length)
    : 0;

  return { year, days, months, averagePercent };
}

export async function getHabitStreak(habitId: string): Promise<HabitStreak> {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });
  if (!habit) return { habitId, current: 0, best: 0, last30Percent: 0 };

  const createdStr = utcDateToStr(habit.createdAt);
  const today = todayStr();
  const entries = await prisma.entry.findMany({
    where: { habitId, date: { gte: strToUtcDate(createdStr), lte: strToUtcDate(today) } },
  });
  const byDate = new Map<string, number>();
  for (const e of entries) byDate.set(utcDateToStr(e.date), e.value);

  // Current streak: walk backward from today (allow today to be incomplete-in-progress,
  // so start from today if complete, else start counting from yesterday).
  let current = 0;
  let cursor = today;
  if (!isCompleted(habit, byDate.get(cursor))) {
    cursor = addDaysStr(cursor, -1);
  }
  while (cursor >= createdStr && isCompleted(habit, byDate.get(cursor))) {
    current += 1;
    cursor = addDaysStr(cursor, -1);
  }

  // Best streak: scan forward across the whole history.
  let best = 0;
  let running = 0;
  let d = createdStr;
  while (d <= today) {
    if (isCompleted(habit, byDate.get(d))) {
      running += 1;
      best = Math.max(best, running);
    } else {
      running = 0;
    }
    d = addDaysStr(d, 1);
  }

  // Last 30 days completion rate
  const last30Start = addDaysStr(today, -29) > createdStr ? addDaysStr(today, -29) : createdStr;
  let count = 0;
  let total = 0;
  d = last30Start;
  while (d <= today) {
    total += 1;
    if (isCompleted(habit, byDate.get(d))) count += 1;
    d = addDaysStr(d, 1);
  }
  const last30Percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return { habitId, current, best, last30Percent };
}

export { serializeHabit };
