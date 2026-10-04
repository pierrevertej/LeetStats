import type { ReactNode } from "react";

/** Shared tooltip chrome for all charts so hover states feel consistent. */
export function TooltipBox({ title, rows }: { title?: ReactNode; rows: { color?: string; label: ReactNode; value: ReactNode }[] }) {
  return (
    <div className="pointer-events-none min-w-36 rounded-lg border border-line-strong bg-[#0c0e13]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {title && <div className="mb-1.5 font-medium text-ink">{title}</div>}
      <div className="space-y-1">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-ink-2">
              {row.color && (
                <span className="size-2 rounded-full" style={{ background: row.color }} />
              )}
              {row.label}
            </span>
            <span className="tabular font-mono text-ink">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
