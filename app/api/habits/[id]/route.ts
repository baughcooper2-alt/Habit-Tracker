import { NextRequest, NextResponse } from "next/server";
import { deleteHabit, updateHabit } from "@/lib/habits";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  try {
    const habit = await updateHabit(params.id, {
      name: body.name,
      icon: body.icon,
      color: body.color,
      unit: body.unit,
      target: body.target,
      quickAdds: body.quickAdds,
      archived: body.archived,
    });
    return NextResponse.json({ habit });
  } catch (e) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteHabit(params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }
}
