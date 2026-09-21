import { NextRequest, NextResponse } from "next/server";
import { getHabitStreak } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("habitIds") ?? "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (!ids.length) {
    return NextResponse.json({ streaks: [] });
  }
  const streaks = await Promise.all(ids.map((id) => getHabitStreak(id)));
  return NextResponse.json({ streaks });
}
