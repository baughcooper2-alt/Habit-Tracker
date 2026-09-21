import { NextRequest, NextResponse } from "next/server";
import { listHabits } from "@/lib/habits";
import { getEntriesForDate } from "@/lib/entries";
import { isValidDateStr, todayStr } from "@/lib/dates";
import type { TodayResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? todayStr();
  if (!isValidDateStr(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const [habits, entries] = await Promise.all([
    listHabits(),
    getEntriesForDate(date),
  ]);
  const body: TodayResponse = { date, habits, entries };
  return NextResponse.json(body);
}
