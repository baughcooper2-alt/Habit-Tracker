import { NextRequest, NextResponse } from "next/server";
import { setEntryValue } from "@/lib/entries";
import { isValidDateStr } from "@/lib/dates";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { habitId, date, value } = body ?? {};
  if (!habitId || !isValidDateStr(date) || typeof value !== "number") {
    return NextResponse.json({ error: "habitId, date, value required" }, { status: 400 });
  }
  const entry = await setEntryValue(habitId, date, value);
  return NextResponse.json({ value: entry.value });
}
