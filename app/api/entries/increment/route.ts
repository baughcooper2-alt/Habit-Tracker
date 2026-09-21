import { NextRequest, NextResponse } from "next/server";
import { incrementEntryValue } from "@/lib/entries";
import { isValidDateStr } from "@/lib/dates";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { habitId, date, delta } = body ?? {};
  if (!habitId || !isValidDateStr(date) || typeof delta !== "number") {
    return NextResponse.json({ error: "habitId, date, delta required" }, { status: 400 });
  }
  const entry = await incrementEntryValue(habitId, date, delta);
  return NextResponse.json({ value: entry.value });
}
