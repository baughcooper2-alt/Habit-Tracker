const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function MonthBars({
  months,
}: {
  months: { month: number; averagePercent: number }[];
}) {
  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {months.map((m) => (
        <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-24 w-full items-end overflow-hidden rounded-lg bg-sand">
            <div
              className="w-full rounded-lg bg-ink transition-all duration-500"
              style={{ height: `${Math.max(4, m.averagePercent)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-cocoa">
            {MONTH_LABELS[m.month - 1]}
          </span>
        </div>
      ))}
    </div>
  );
}
