import type { HabitDTO, HabitStreak } from "@/lib/types";
import { colorTheme } from "@/lib/colors";

export default function StreakList({
  habits,
  streaks,
}: {
  habits: HabitDTO[];
  streaks: Record<string, HabitStreak>;
}) {
  if (habits.length === 0) return null;

  return (
    <div className="space-y-2">
      {habits.map((h) => {
        const s = streaks[h.id];
        const theme = colorTheme(h.color);
        return (
          <div
            key={h.id}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.soft} text-lg`}>
              {h.icon}
            </span>
            <span className="flex-1 text-sm font-bold text-ink">{h.name}</span>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-extrabold text-ink">
                  {s ? s.current : "–"}
                  {s && s.current > 0 ? " 🔥" : ""}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">streak</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-ink">{s ? s.best : "–"}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">best</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-ink">{s ? `${s.last30Percent}%` : "–"}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cocoa">30d</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
