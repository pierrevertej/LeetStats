/**
 * Decorative, static preview of the dashboard shown on the homepage.
 * Uses a deterministic PRNG so server and client render identically.
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEAT = [
  "var(--color-heat-0)",
  "var(--color-heat-1)",
  "var(--color-heat-2)",
  "var(--color-heat-3)",
  "var(--color-heat-4)",
];

function buildHeat() {
  const rand = mulberry32(215);
  return Array.from({ length: 30 }, (_, w) =>
    Array.from({ length: 7 }, () => {
      const r = rand() * (0.55 + w / 60);
      return r < 0.3 ? 0 : r < 0.5 ? 1 : r < 0.68 ? 2 : r < 0.85 ? 3 : 4;
    }),
  );
}

const RATING = [1500, 1532, 1518, 1576, 1610, 1598, 1655, 1702, 1688, 1741, 1795, 1782, 1840, 1868];

function ratingPath(w: number, h: number) {
  const min = 1480;
  const max = 1890;
  const pts = RATING.map((r, i) => [
    (i / (RATING.length - 1)) * w,
    h - ((r - min) / (max - min)) * h,
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return { line, area: `${line} L${w},${h} L0,${h} Z`, end: pts[pts.length - 1] };
}

export function HeroPreview() {
  const heat = buildHeat();
  const { line, area, end } = ratingPath(260, 80);

  return (
    <div aria-hidden className="relative">
      <div className="absolute -inset-x-6 -bottom-10 top-10 -z-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_40%,rgb(139_147_255/0.12),transparent)] blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface/80 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop-blur">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="ml-3 rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-ink-3">
            leet-stats-two.vercel.app/<span className="text-ink-2">you</span>
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[1.1fr_1fr_1fr] sm:p-4">
          {/* solved ring */}
          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-2/60 p-4">
            <svg viewBox="0 0 36 36" className="size-20 shrink-0 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-easy)" strokeWidth="3" strokeDasharray="28 94.2" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-medium)" strokeWidth="3" strokeDasharray="38 94.2" strokeDashoffset="-30" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-hard)" strokeWidth="3" strokeDasharray="14 94.2" strokeDashoffset="-70" />
            </svg>
            <div className="text-left">
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Solved</div>
              <div className="tabular text-2xl font-semibold tracking-tight">742</div>
              <div className="mt-1 flex gap-2 text-[11px] text-ink-2">
                <span className="flex items-center gap-1"><i className="size-1.5 rounded-full bg-easy" />231</span>
                <span className="flex items-center gap-1"><i className="size-1.5 rounded-full bg-medium" />389</span>
                <span className="flex items-center gap-1"><i className="size-1.5 rounded-full bg-hard" />122</span>
              </div>
            </div>
          </div>

          {/* rating */}
          <div className="rounded-xl border border-line bg-surface-2/60 p-4 text-left">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Contest rating</span>
              <span className="text-[11px] text-easy">+28</span>
            </div>
            <div className="tabular text-2xl font-semibold tracking-tight">1,868</div>
            <svg viewBox="0 0 260 80" className="mt-2 h-14 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hp-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.25" />
                  <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#hp-area)" />
              <path d={line} fill="none" stroke="var(--color-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              <circle cx={end[0]} cy={end[1]} r="3.5" fill="var(--color-brand)" />
            </svg>
          </div>

          {/* heatmap */}
          <div className="rounded-xl border border-line bg-surface-2/60 p-4 text-left">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Activity</span>
              <span className="text-[11px] text-ink-2">41 day streak</span>
            </div>
            <div className="mt-3 flex gap-[3px] overflow-hidden">
              {heat.map((week, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {week.map((lvl, d) => (
                    <span key={d} className="size-[7px] rounded-[2px]" style={{ background: HEAT[lvl] }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
