import { NextRequest, NextResponse } from "next/server";
import { toggleEntryValue } from "@/lib/entries";
import { isValidDateStr } from "@/lib/dates";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { habitId, date } = body ?? {};
  if (!habitId || !isValidDateStr(date)) {
    return NextResponse.json({ error: "habitId, date required" }, { status: 400 });
  }
  const entry = await toggleEntryValue(habitId, date);
  return NextResponse.json({ value: entry.value });
}
