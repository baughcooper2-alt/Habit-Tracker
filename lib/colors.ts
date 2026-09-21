export type ColorKey =
  | "sky"
  | "mint"
  | "peach"
  | "blush"
  | "lilac"
  | "butter"
  | "sand";

export const COLOR_KEYS: ColorKey[] = [
  "sky",
  "mint",
  "peach",
  "blush",
  "lilac",
  "butter",
  "sand",
];

type ColorTheme = {
  soft: string; // pale card background
  accent: string; // solid fill (progress bars, checked state)
  accentText: string; // text on solid fill
  text: string; // accent-colored text on pale bg
  ring: string;
  border: string;
};

const COLOR_MAP: Record<ColorKey, ColorTheme> = {
  sky: {
    soft: "bg-skytint",
    accent: "bg-sky-400",
    accentText: "text-white",
    text: "text-sky-700",
    ring: "ring-sky-300",
    border: "border-sky-200",
  },
  mint: {
    soft: "bg-mint",
    accent: "bg-emerald-400",
    accentText: "text-white",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
    border: "border-emerald-200",
  },
  peach: {
    soft: "bg-peach",
    accent: "bg-orange-400",
    accentText: "text-white",
    text: "text-orange-700",
    ring: "ring-orange-300",
    border: "border-orange-200",
  },
  blush: {
    soft: "bg-blush",
    accent: "bg-rose-400",
    accentText: "text-white",
    text: "text-rose-700",
    ring: "ring-rose-300",
    border: "border-rose-200",
  },
  lilac: {
    soft: "bg-lilac",
    accent: "bg-violet-400",
    accentText: "text-white",
    text: "text-violet-700",
    ring: "ring-violet-300",
    border: "border-violet-200",
  },
  butter: {
    soft: "bg-butter",
    accent: "bg-amber-400",
    accentText: "text-white",
    text: "text-amber-700",
    ring: "ring-amber-300",
    border: "border-amber-200",
  },
  sand: {
    soft: "bg-sand",
    accent: "bg-stone-400",
    accentText: "text-white",
    text: "text-stone-700",
    ring: "ring-stone-300",
    border: "border-stone-200",
  },
};

export function colorTheme(key: string): ColorTheme {
  return COLOR_MAP[(key as ColorKey) in COLOR_MAP ? (key as ColorKey) : "sky"];
}
