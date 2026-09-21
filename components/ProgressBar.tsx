export default function ProgressBar({
  percent,
  className = "",
  trackClassName = "bg-sand",
  fillClassName = "bg-ink",
  height = "h-2.5",
}: {
  percent: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  height?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`w-full overflow-hidden rounded-full ${height} ${trackClassName} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${fillClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
