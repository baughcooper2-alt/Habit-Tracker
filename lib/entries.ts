import { prisma } from "@/lib/prisma";
import { strToUtcDate } from "@/lib/dates";

export async function getEntriesForDate(dateStr: string) {
  const date = strToUtcDate(dateStr);
  const entries = await prisma.entry.findMany({ where: { date } });
  return entries.map((e) => ({ habitId: e.habitId, value: e.value }));
}

export async function getEntriesForRange(startStr: string, endStr: string) {
  const start = strToUtcDate(startStr);
  const end = strToUtcDate(endStr);
  const entries = await prisma.entry.findMany({
    where: { date: { gte: start, lte: end } },
  });
  return entries;
}

export async function setEntryValue(
  habitId: string,
  dateStr: string,
  value: number
) {
  const date = strToUtcDate(dateStr);
  const clamped = Math.max(0, value);
  const entry = await prisma.entry.upsert({
    where: { habitId_date: { habitId, date } },
    update: { value: clamped },
    create: { habitId, date, value: clamped },
  });
  return entry;
}

export async function toggleEntryValue(habitId: string, dateStr: string) {
  const date = strToUtcDate(dateStr);
  const existing = await prisma.entry.findUnique({
    where: { habitId_date: { habitId, date } },
  });
  const next = existing && existing.value >= 1 ? 0 : 1;
  const entry = await prisma.entry.upsert({
    where: { habitId_date: { habitId, date } },
    update: { value: next },
    create: { habitId, date, value: next },
  });
  return entry;
}

export async function incrementEntryValue(
  habitId: string,
  dateStr: string,
  delta: number
) {
  const date = strToUtcDate(dateStr);
  const existing = await prisma.entry.findUnique({
    where: { habitId_date: { habitId, date } },
  });
  const next = Math.max(0, (existing?.value ?? 0) + delta);
  const entry = await prisma.entry.upsert({
    where: { habitId_date: { habitId, date } },
    update: { value: next },
    create: { habitId, date, value: next },
  });
  return entry;
}
