"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ContestEntry } from "@/lib/leetcode/types";
import { formatDate, formatNumber } from "@/lib/format";

import { TooltipBox } from "./chart-tooltip";

export function RatingChart({ history, peak }: { history: ContestEntry[]; peak: number }) {
  const data = history.map((h, i) => ({
    ...h,
    delta: i > 0 ? h.rating - history[i - 1].rating : null,
  }));
  const ratings = history.map((h) => h.rating);
  const min = Math.floor((Math.min(...ratings) - 50) / 100) * 100;
  const max = Math.ceil((Math.max(...ratings) + 50) / 100) * 100;

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="rating-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgb(255 255 255 / 0.05)" />
          <XAxis
            dataKey="startTime"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(t: number) => {
              const d = new Date(t * 1000);
              return `${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} '${String(d.getUTCFullYear()).slice(2)}`;
            }}
            tick={{ fill: "var(--color-ink-3)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
            tickMargin={10}
          />
          <YAxis
            domain={[min, max]}
            tick={{ fill: "var(--color-ink-3)", fontSize: 11 }}
            tickFormatter={(v: number) => formatNumber(v)}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <ReferenceLine
            y={peak}
            stroke="var(--color-brand)"
            strokeOpacity={0.35}
          />
          <Tooltip
            cursor={{ stroke: "rgb(255 255 255 / 0.2)", strokeWidth: 1 }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as (typeof data)[number] | undefined;
              if (!active || !p) return null;
              return (
                <TooltipBox
                  title={
                    <>
                      <div>{p.title}</div>
                      <div className="font-normal text-ink-3">{formatDate(p.startTime)}</div>
                    </>
                  }
                  rows={[
                    {
                      color: "var(--color-brand)",
                      label: "Rating",
                      value: (
                        <>
                          {formatNumber(p.rating)}
                          {p.delta != null && (
                            <span className={p.delta >= 0 ? "text-easy" : "text-hard"}>
                              {" "}
                              {p.delta >= 0 ? "+" : ""}
                              {p.delta}
                            </span>
                          )}
                        </>
                      ),
                    },
                    { label: "Rank", value: formatNumber(p.ranking) },
                    { label: "Solved", value: `${p.solved} / ${p.totalProblems}` },
                  ]}
                />
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="rating"
            stroke="var(--color-brand)"
            strokeWidth={2}
            fill="url(#rating-fill)"
            dot={history.length <= 40 ? { r: 2.5, fill: "var(--color-brand)", strokeWidth: 0 } : false}
            activeDot={{ r: 5, fill: "var(--color-brand)", stroke: "var(--color-surface)", strokeWidth: 2 }}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
