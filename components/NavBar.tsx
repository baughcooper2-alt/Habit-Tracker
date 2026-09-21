"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today", icon: "🏠" },
  { href: "/stats", label: "Stats", icon: "📊" },
  { href: "/habits", label: "Habits", icon: "🗂️" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-sand bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around px-2 pb-1 pt-1.5">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-[72px] flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 text-xs font-semibold transition-colors ${
                active ? "bg-sand text-ink" : "text-cocoa hover:text-ink"
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
