import { NextRequest, NextResponse } from "next/server";
import { getYearStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get("year") ?? "", 10);
  if (!year) {
    return NextResponse.json({ error: "year required" }, { status: 400 });
  }
  const stats = await getYearStats(year);
  return NextResponse.json(stats);
}
