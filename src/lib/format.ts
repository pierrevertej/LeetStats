const integer = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function formatNumber(value: number): string {
  return integer.format(value);
}

export function formatCompact(value: number): string {
  return value >= 10_000 ? compact.format(value) : integer.format(value);
}

export function formatPercent(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

export function formatDate(input: string | number, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof input === "number" ? new Date(input * 1000) : new Date(`${input}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  });
}

const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "3 hours ago" style formatting from unix seconds. */
export function formatRelative(unixSeconds: number, now = Date.now()): string {
  const diff = unixSeconds - now / 1000;
  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diff) >= seconds) return relative.format(Math.round(diff / seconds), unit);
  }
  return "just now";
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
