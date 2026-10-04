import { ArrowUpRight } from "lucide-react";

import type { RecentSubmission } from "@/lib/leetcode/types";
import { formatRelative } from "@/lib/format";

export function RecentSubmissions({ items }: { items: RecentSubmission[] }) {
  return (
    <ul className="-mx-2 divide-y divide-line">
      {items.map((s) => (
        <li key={s.id}>
          <a
            href={`https://leetcode.com/problems/${s.slug}/`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-easy/80" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm text-ink-2 transition-colors group-hover:text-ink">
              {s.title}
            </span>
            <span className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-3 sm:inline">
              {s.lang}
            </span>
            <time
              dateTime={new Date(s.timestamp * 1000).toISOString()}
              className="shrink-0 text-right font-mono text-[11px] text-ink-3 sm:w-24"
            >
              {formatRelative(s.timestamp)}
            </time>
            <ArrowUpRight
              className="size-3.5 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
