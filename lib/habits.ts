import { prisma } from "@/lib/prisma";
import { utcDateToStr } from "@/lib/dates";
import type { HabitDTO, HabitType } from "@/lib/types";
import type { Habit } from "@prisma/client";

export function serializeHabit(h: Habit): HabitDTO {
  return {
    id: h.id,
    name: h.name,
    icon: h.icon,
    color: h.color,
    type: h.type,
    unit: h.unit,
    target: h.target,
    quickAdds: h.quickAdds
      ? h.quickAdds
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !Number.isNaN(n))
      : [],
    sortOrder: h.sortOrder,
    archived: h.archived,
    createdAt: utcDateToStr(h.createdAt),
  };
}

export async function listHabits(opts: { includeArchived?: boolean } = {}) {
  const habits = await prisma.habit.findMany({
    where: opts.includeArchived ? {} : { archived: false },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return habits.map(serializeHabit);
}

export async function getHabit(id: string) {
  const h = await prisma.habit.findUnique({ where: { id } });
  return h ? serializeHabit(h) : null;
}

export async function createHabit(input: {
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  unit?: string | null;
  target: number;
  quickAdds?: number[];
}) {
  const count = await prisma.habit.count();
  const h = await prisma.habit.create({
    data: {
      name: input.name.trim(),
      icon: input.icon || "✨",
      color: input.color || "sky",
      type: input.type,
      unit: input.type === "QUANTITY" ? input.unit || null : null,
      target: input.type === "QUANTITY" ? input.target : 1,
      quickAdds:
        input.type === "QUANTITY" && input.quickAdds?.length
          ? input.quickAdds.join(",")
          : null,
      sortOrder: count,
    },
  });
  return serializeHabit(h);
}

export async function updateHabit(
  id: string,
  input: Partial<{
    name: string;
    icon: string;
    color: string;
    unit: string | null;
    target: number;
    quickAdds: number[];
    archived: boolean;
  }>
) {
  const h = await prisma.habit.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.unit !== undefined ? { unit: input.unit } : {}),
      ...(input.target !== undefined ? { target: input.target } : {}),
      ...(input.quickAdds !== undefined
        ? { quickAdds: input.quickAdds.length ? input.quickAdds.join(",") : null }
        : {}),
      ...(input.archived !== undefined ? { archived: input.archived } : {}),
    },
  });
  return serializeHabit(h);
}

export async function reorderHabits(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.habit.update({ where: { id }, data: { sortOrder: index } })
    )
  );
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
}
