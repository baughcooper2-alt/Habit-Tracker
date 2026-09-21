import { NextRequest, NextResponse } from "next/server";
import { createHabit, listHabits } from "@/lib/habits";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "1";
  const habits = await listHabits({ includeArchived });
  return NextResponse.json({ habits });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.name || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (body.type !== "BOOLEAN" && body.type !== "QUANTITY") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  const habit = await createHabit({
    name: body.name,
    icon: body.icon ?? "✨",
    color: body.color ?? "sky",
    type: body.type,
    unit: body.unit ?? null,
    target: typeof body.target === "number" && body.target > 0 ? body.target : 1,
    quickAdds: Array.isArray(body.quickAdds) ? body.quickAdds : [],
  });
  return NextResponse.json({ habit }, { status: 201 });
}
