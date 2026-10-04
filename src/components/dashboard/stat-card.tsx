import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  index?: number;
  muted?: boolean;
}

/** A single headline number. Deliberately not a chart. */
export function StatCard({ label, value, hint, icon: Icon, index = 0, muted }: StatCardProps) {
  return (
    <div
      className="animate-fade-up group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong sm:p-5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{label}</span>
        <Icon className="size-4 text-ink-3 transition-colors group-hover:text-brand" aria-hidden />
      </div>
      <div
        className={cn(
          "tabular mt-3 text-2xl font-semibold tracking-tight sm:text-[28px]",
          muted && "text-ink-3",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs leading-snug text-ink-3 sm:truncate">{hint}</div>}
    </div>
  );
}
