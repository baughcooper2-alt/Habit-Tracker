"use client";

import { useState } from "react";
import type { HabitDTO } from "@/lib/types";
import { colorTheme } from "@/lib/colors";
import ProgressBar from "./ProgressBar";

export default function HabitCard({
  habit,
  value,
  onToggle,
  onIncrement,
  onSetExact,
}: {
  habit: HabitDTO;
  value: number;
  onToggle: () => void;
  onIncrement: (delta: number) => void;
  onSetExact: (value: number) => void;
}) {
  const theme = colorTheme(habit.color);

  if (habit.type === "BOOLEAN") {
    const done = value >= 1;
    return (
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left shadow-soft transition-all active:scale-[0.98] ${
          done
            ? `${theme.accent} border-transparent`
            : `${theme.soft} border-transparent`
        }`}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
            done ? "bg-white/25" : "bg-white/10"
          }`}
        >
          {habit.icon}
        </span>
        <span className={`flex-1 text-xs font-bold ${done ? "text-white" : "text-ink"}`}>
          {habit.name}
        </span>
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            done
              ? "border-white bg-white text-emerald-500 animate-pop"
              : "border-cocoa/30 text-transparent"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
    );
  }

  return (
    <QuantityCard
      habit={habit}
      value={value}
      onIncrement={onIncrement}
      onSetExact={onSetExact}
    />
  );
}

function QuantityCard({
  habit,
  value,
  onIncrement,
  onSetExact,
}: {
  habit: HabitDTO;
  value: number;
  onIncrement: (delta: number) => void;
  onSetExact: (value: number) => void;
}) {
  const theme = colorTheme(habit.color);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const percent = habit.target > 0 ? Math.round((value / habit.target) * 100) : 0;
  const met = value >= habit.target;

  const commitEdit = () => {
    const n = parseFloat(draft);
    if (!Number.isNaN(n)) onSetExact(Math.max(0, n));
    setEditing(false);
  };

  return (
    <div className={`rounded-lg border border-transparent ${theme.soft} px-2.5 py-1.5 shadow-soft`}>
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm">
          {habit.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-ink truncate">{habit.name}</span>
            <button
              type="button"
              onClick={() => {
                setDraft(String(value));
                setEditing(true);
              }}
              className={`shrink-0 text-[10px] font-semibold underline decoration-dotted underline-offset-2 ${
                met ? "text-emerald-400" : "text-cocoa"
              }`}
            >
              {met && "✓ "}
              {value}/{habit.target} {habit.unit}
            </button>
          </div>
          {editing && (
            <div className="mt-0.5 flex items-center gap-1.5">
              <input
                autoFocus
                type="number"
                inputMode="decimal"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                onBlur={commitEdit}
                className="w-16 rounded-md border border-cocoa/20 bg-black/25 px-1.5 py-0 text-[11px] font-semibold text-ink outline-none focus:border-ink/40"
              />
              <span className="text-[10px] font-medium text-cocoa">{habit.unit}</span>
            </div>
          )}
        </div>
      </div>

      <ProgressBar
        percent={percent}
        className="mt-1.5"
        trackClassName="bg-white/15"
        fillClassName={theme.accent}
        height="h-1"
      />

      <div className="mt-1.5 flex flex-wrap gap-1">
        {habit.quickAdds.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => onIncrement(amt)}
            className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm active:scale-95"
          >
            +{amt}
          </button>
        ))}
        {value > 0 && (
          <button
            type="button"
            onClick={() => onIncrement(-Math.min(value, habit.quickAdds[0] ?? value))}
            className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-cocoa active:scale-95"
          >
            −{habit.quickAdds[0] ?? value}
          </button>
        )}
      </div>
    </div>
  );
}
