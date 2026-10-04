"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { DifficultyCounts } from "@/lib/leetcode/types";
import { formatNumber, formatPercent } from "@/lib/format";

import { TooltipBox } from "./chart-tooltip";

const DIFFICULTIES = [
  { key: "easy", label: "Easy", color: "var(--color-easy)" },
  { key: "medium", label: "Medium", color: "var(--color-medium)" },
  { key: "hard", label: "Hard", color: "var(--color-hard)" },
] as const;

interface Props {
  solved: DifficultyCounts;
  totals: DifficultyCounts;
}

export function DifficultyBreakdown({ solved, totals }: Props) {
  const data = DIFFICULTIES.map((d) => ({
    name: d.label,
    value: solved[d.key],
    fill: d.color,
  }));
  const hasSolves = solved.all > 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative size-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={hasSolves ? data : [{ name: "None", value: 1, fill: "var(--color-surface-2)" }]}
              dataKey="value"
              innerRadius="76%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={hasSolves ? 2 : 0}
              cornerRadius={4}
              stroke="none"
              isAnimationActive
              animationDuration={900}
            />
            {hasSolves && (
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  const p = payload?.[0];
                  if (!active || !p) return null;
                  const v = Number(p.value);
                  return (
                    <TooltipBox
                      rows={[
                        {
                          color: String(p.payload.fill),
                          label: p.name,
                          value: `${formatNumber(v)} · ${formatPercent(v / solved.all, 0)}`,
                        },
                      ]}
                    />
                  );
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular text-3xl font-semibold tracking-tight">
            {formatNumber(solved.all)}
          </span>
          <span className="font-mono text-[11px] text-ink-3">/ {formatNumber(totals.all)}</span>
        </div>
      </div>

      <ul className="w-full flex-1 space-y-4">
        {DIFFICULTIES.map((d) => {
          const s = solved[d.key];
          const t = totals[d.key];
          const coverage = t > 0 ? s / t : 0;
          return (
            <li key={d.key}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-2">
                  <span className="size-2 rounded-full" style={{ background: d.color }} />
                  {d.label}
                </span>
                <span className="tabular font-mono text-ink">
                  {formatNumber(s)}
                  <span className="text-ink-3"> / {formatNumber(t)}</span>
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"
                role="meter"
                aria-label={`${d.label} problems solved`}
                aria-valuemin={0}
                aria-valuemax={t}
                aria-valuenow={s}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-out"
                  style={{ width: `${Math.max(coverage * 100, s > 0 ? 1.5 : 0)}%`, background: d.color }}
                />
              </div>
              <div className="mt-1 text-right font-mono text-[11px] text-ink-3">
                {formatPercent(coverage)} of pool
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
