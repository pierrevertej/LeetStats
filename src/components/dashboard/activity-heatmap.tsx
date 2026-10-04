"use client";

import { useEffect, useRef, useState } from "react";

import type { ActivityStats, HeatmapCell } from "@/lib/stats/compute";
import { formatDate, formatNumber } from "@/lib/format";

const LEVEL_COLORS = [
  "var(--color-heat-0)",
  "var(--color-heat-1)",
  "var(--color-heat-2)",
  "var(--color-heat-3)",
  "var(--color-heat-4)",
];

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
/** Room for weekday labels (left) and month labels (top), in SVG units. */
const LEFT = 26;
const TOP = 16;

interface Hover {
  cell: HeatmapCell;
  x: number;
  y: number;
}

export function ActivityHeatmap({ activity }: { activity: ActivityStats }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hover | null>(null);

  // On narrow screens, start scrolled to the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const width = LEFT + activity.weeks.length * STEP - GAP;
  const height = TOP + 7 * STEP - GAP;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="scroll-thin overflow-x-auto pb-2"
        onMouseLeave={() => setHover(null)}
        onScroll={() => setHover(null)}
      >
        {/* One scalable SVG: fills the card on desktop, scrolls on phones. */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block w-full min-w-[680px]"
          role="img"
          aria-label={`${formatNumber(activity.totalSubmissions)} submissions over ${formatNumber(activity.activeDays)} active days in the past year`}
        >
          <g className="fill-ink-3 font-mono" fontSize={9} aria-hidden>
            {activity.monthLabels.map((m) => (
              <text key={m.index} x={LEFT + m.index * STEP} y={10}>
                {m.label}
              </text>
            ))}
            {["Mon", "Wed", "Fri"].map((d, i) => (
              <text key={d} x={0} y={TOP + (i * 2 + 1) * STEP + CELL - 2}>
                {d}
              </text>
            ))}
          </g>
          {activity.weeks.map((week, w) =>
            week.map((cell, d) =>
              cell.future ? null : (
                <rect
                  key={cell.date}
                  x={LEFT + w * STEP}
                  y={TOP + d * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={LEVEL_COLORS[cell.level]}
                  className="cursor-pointer"
                  stroke={hover?.cell.date === cell.date ? "rgb(255 255 255 / 0.7)" : "transparent"}
                  strokeWidth={1.2}
                  onMouseEnter={(e) => {
                    const host = scrollRef.current!.parentElement!.getBoundingClientRect();
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = r.left - host.left + r.width / 2;
                    setHover({ cell, x: Math.min(Math.max(x, 80), host.width - 80), y: r.top - host.top });
                  }}
                />
              ),
            ),
          )}
        </svg>
      </div>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-line-strong bg-[#0c0e13]/95 px-2.5 py-1.5 text-xs shadow-xl"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          <span className="font-medium text-ink">
            {hover.cell.count === 0
              ? "No submissions"
              : `${formatNumber(hover.cell.count)} submission${hover.cell.count === 1 ? "" : "s"}`}
          </span>
          <span className="text-ink-3"> · {formatDate(hover.cell.date, { weekday: "short" })}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-ink-3">
        <span>Less</span>
        {LEVEL_COLORS.map((c) => (
          <span key={c} className="size-[11px] rounded-[2.5px]" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
