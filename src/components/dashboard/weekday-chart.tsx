"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { formatNumber, formatPercent } from "@/lib/format";

import { TooltipBox } from "./chart-tooltip";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayChart({ totals }: { totals: number[] }) {
  const sum = totals.reduce((a, b) => a + b, 0);
  const peak = Math.max(...totals);
  const data = totals.map((value, i) => ({ day: DAYS[i], value, isPeak: value === peak && peak > 0 }));

  return (
    <div className="h-44 w-full lg:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="22%">
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-ink-3)", fontSize: 11 }}
            tickMargin={8}
          />
          <Tooltip
            cursor={{ fill: "rgb(255 255 255 / 0.04)", radius: 6 }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as (typeof data)[number] | undefined;
              if (!active || !p) return null;
              return (
                <TooltipBox
                  title={p.day}
                  rows={[
                    { label: "Submissions", value: formatNumber(p.value) },
                    { label: "Share", value: formatPercent(sum ? p.value / sum : 0, 0) },
                  ]}
                />
              );
            }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            shape={(props: { x?: number; y?: number; width?: number; height?: number; payload?: { isPeak: boolean } }) => {
              const { x = 0, y = 0, width = 0, height = 0, payload } = props;
              const r = Math.min(4, width / 2, height);
              return (
                <path
                  d={`M${x},${y + height} V${y + r} Q${x},${y} ${x + r},${y} H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${y + height} Z`}
                  fill={payload?.isPeak ? "var(--color-brand)" : "rgb(139 147 255 / 0.35)"}
                />
              );
            }}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
