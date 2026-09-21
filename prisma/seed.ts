import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.habit.count();
  if (existing > 0) {
    console.log("Habits already exist, skipping seed.");
    return;
  }

  const habits = [
    { name: "School Work", icon: "📚", color: "sky", type: "BOOLEAN" as const, target: 1, sortOrder: 0 },
    { name: "LSAT Study", icon: "⚖️", color: "lilac", type: "BOOLEAN" as const, target: 1, sortOrder: 1 },
    { name: "Gym", icon: "🏋️", color: "peach", type: "BOOLEAN" as const, target: 1, sortOrder: 2 },
    {
      name: "Water Intake",
      icon: "💧",
      color: "sky",
      type: "QUANTITY" as const,
      unit: "oz",
      target: 100,
      quickAdds: "8,16,24",
      sortOrder: 3,
    },
    {
      name: "Calories",
      icon: "🍽️",
      color: "butter",
      type: "QUANTITY" as const,
      unit: "kcal",
      target: 2200,
      quickAdds: "100,250,500",
      sortOrder: 4,
    },
    {
      name: "Protein",
      icon: "🥩",
      color: "blush",
      type: "QUANTITY" as const,
      unit: "g",
      target: 150,
      quickAdds: "10,20,30",
      sortOrder: 5,
    },
    {
      name: "Fat",
      icon: "🥑",
      color: "mint",
      type: "QUANTITY" as const,
      unit: "g",
      target: 70,
      quickAdds: "5,10,15",
      sortOrder: 6,
    },
  ];

  for (const habit of habits) {
    await prisma.habit.create({ data: habit });
  }

  console.log(`Seeded ${habits.length} habits.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
