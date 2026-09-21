import type {
  HabitDTO,
  HabitStreak,
  MonthStatsResponse,
  TodayResponse,
  YearStatsResponse,
} from "@/lib/types";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getToday: (date: string) => jsonFetch<TodayResponse>(`/api/today?date=${date}`),

  listHabits: (includeArchived = false) =>
    jsonFetch<{ habits: HabitDTO[] }>(
      `/api/habits${includeArchived ? "?includeArchived=1" : ""}`
    ),

  createHabit: (data: Partial<HabitDTO>) =>
    jsonFetch<{ habit: HabitDTO }>("/api/habits", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateHabit: (id: string, data: Partial<HabitDTO>) =>
    jsonFetch<{ habit: HabitDTO }>(`/api/habits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteHabit: (id: string) =>
    jsonFetch<{ ok: true }>(`/api/habits/${id}`, { method: "DELETE" }),

  reorderHabits: (ids: string[]) =>
    jsonFetch<{ ok: true }>("/api/habits/reorder", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  toggleEntry: (habitId: string, date: string) =>
    jsonFetch<{ value: number }>("/api/entries/toggle", {
      method: "POST",
      body: JSON.stringify({ habitId, date }),
    }),

  incrementEntry: (habitId: string, date: string, delta: number) =>
    jsonFetch<{ value: number }>("/api/entries/increment", {
      method: "POST",
      body: JSON.stringify({ habitId, date, delta }),
    }),

  setEntry: (habitId: string, date: string, value: number) =>
    jsonFetch<{ value: number }>("/api/entries/set", {
      method: "POST",
      body: JSON.stringify({ habitId, date, value }),
    }),

  getMonthStats: (year: number, month: number) =>
    jsonFetch<MonthStatsResponse>(`/api/stats/month?year=${year}&month=${month}`),

  getYearStats: (year: number) =>
    jsonFetch<YearStatsResponse>(`/api/stats/year?year=${year}`),

  getStreaks: (habitIds: string[]) =>
    jsonFetch<{ streaks: HabitStreak[] }>(
      `/api/stats/streaks?habitIds=${habitIds.join(",")}`
    ),
};
