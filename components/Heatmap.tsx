import { strToUtcDate, weekdayLabels } from "@/lib/dates";
import type { DayStat } from "@/lib/types";

export function cellColor(percent: number): React.CSSProperties {
  if (percent < 0) {
    return { backgroundColor: "transparent", border: "1px dashed #E8DFD3" };
  }
  if (percent === 0) return { backgroundColor: "#F3EEE4" };
  const alpha = 0.22 + (percent / 100) * 0.68;
  return { backgroundColor: `rgba(63, 58, 54, ${alpha.toFixed(2)})` };
}

export function MonthGrid({
  year,
  month,
  days,
  onSelectDay,
}: {
  year: number;
  month: number;
  days: DayStat[];
  onSelectDay?: (date: string) => void;
}) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const leadingBlanks = Array.from({ length: firstDow });

  return (
    <div>
      <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-cocoa">
        {weekdayLabels().map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {leadingBlanks.map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {days.map((d) => {
          const dayNum = parseInt(d.date.slice(8, 10), 10);
          return (
            <button
              type="button"
              key={d.date}
              disabled={d.percent < 0 || !onSelectDay}
              onClick={() => onSelectDay?.(d.date)}
              style={cellColor(d.percent)}
              title={d.percent >= 0 ? `${d.date}: ${d.percent}%` : d.date}
              className="flex aspect-square items-center justify-center rounded-lg text-[11px] font-bold text-ink transition-transform active:scale-90"
            >
              <span style={{ opacity: d.percent >= 55 ? 0.9 : 0.7, color: d.percent >= 55 ? "#fff" : "#3F3A36" }}>
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function YearGrid({ days }: { days: DayStat[] }) {
  if (days.length === 0) return null;
  const firstDate = strToUtcDate(days[0].date);
  const startPad = firstDate.getUTCDay();

  const cells: (DayStat | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...days,
  ];
  const weeks: (DayStat | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-1" style={{ minWidth: weeks.length * 12 }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, di) => {
              const d = week[di];
              return (
                <div
                  key={di}
                  title={d ? `${d.date}: ${d.percent}%` : undefined}
                  style={d ? cellColor(d.percent) : { backgroundColor: "transparent" }}
                  className="h-2.5 w-2.5 rounded-[3px]"
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
