import { formatNumber } from "@/lib/format";

interface RankedBarsProps {
  items: { label: string; value: number; sublabel?: string }[];
  /** Accessible description of what the values represent. */
  unit: string;
}

/**
 * Horizontal ranked bars in plain HTML: crisp labels at any width, value
 * at the bar tip, native hover. Recharts would add little here.
 */
export function RankedBars({ items, unit }: RankedBarsProps) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="group" title={`${item.label}: ${formatNumber(item.value)} ${unit}`}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-ink-2 transition-colors group-hover:text-ink">
              {item.label}
              {item.sublabel && <span className="ml-2 font-mono text-[10px] text-ink-3">{item.sublabel}</span>}
            </span>
            <span className="tabular shrink-0 font-mono text-xs text-ink">{formatNumber(item.value)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand/70 to-brand transition-[filter] duration-200 group-hover:brightness-125"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
