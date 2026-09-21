export type HabitType = "BOOLEAN" | "QUANTITY";

export type HabitDTO = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  unit: string | null;
  target: number;
  quickAdds: number[];
  sortOrder: number;
  archived: boolean;
  createdAt: string; // yyyy-MM-dd
};

export type TodayEntry = {
  habitId: string;
  value: number;
};

export type TodayResponse = {
  date: string;
  habits: HabitDTO[];
  entries: TodayEntry[];
};

export type DayStat = {
  date: string;
  completed: number;
  total: number;
  percent: number;
};

export type MonthStatsResponse = {
  year: number;
  month: number;
  days: DayStat[];
  averagePercent: number;
  bestDay: DayStat | null;
};

export type YearStatsResponse = {
  year: number;
  days: DayStat[];
  months: { month: number; averagePercent: number }[];
  averagePercent: number;
};

export type HabitStreak = {
  habitId: string;
  current: number;
  best: number;
  last30Percent: number;
};
