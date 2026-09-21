// All "day" values in this app are plain calendar dates (no time, no timezone
// math) represented either as a "yyyy-MM-dd" string or as a UTC-midnight
// Date object. We never convert between timezones — the client always tells
// the server which calendar date it means, and the server stores/reads that
// exact date at UTC midnight so it round-trips losslessly.

export function todayStr(): string {
  const d = new Date();
  return dateToStr(d);
}

export function dateToStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// yyyy-MM-dd -> UTC-midnight Date, for storing/querying in the DB
export function strToUtcDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

// UTC-midnight Date from the DB -> yyyy-MM-dd
export function utcDateToStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDaysStr(dateStr: string, days: number): string {
  const d = strToUtcDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return utcDateToStr(d);
}

export function daysInMonth(year: number, month: number): number {
  // month is 1-indexed
  return new Date(year, month, 0).getDate();
}

export function isValidDateStr(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function weekdayLabels(): string[] {
  return ["S", "M", "T", "W", "T", "F", "S"];
}
