import { NextRequest, NextResponse } from "next/server";
import { reorderHabits } from "@/lib/habits";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!Array.isArray(body?.ids)) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }
  await reorderHabits(body.ids);
  return NextResponse.json({ ok: true });
}
