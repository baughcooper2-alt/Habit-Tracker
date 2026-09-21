import { NextRequest, NextResponse } from "next/server";
import { getMonthStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get("year") ?? "", 10);
  const month = parseInt(req.nextUrl.searchParams.get("month") ?? "", 10);
  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: "year and month required" }, { status: 400 });
  }
  const stats = await getMonthStats(year, month);
  return NextResponse.json(stats);
}
