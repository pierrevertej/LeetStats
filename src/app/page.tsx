import { Activity, BarChart3, Trophy } from "lucide-react";
import Link from "next/link";

import { HeroPreview } from "@/components/home/hero-preview";
import { SearchForm } from "@/components/search-form";

const EXAMPLES = ["lee215", "votrubac", "neal_wu", "awice"];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Solve breakdown",
    body: "Easy, medium and hard counts with coverage of each problem pool and your acceptance rate.",
  },
  {
    icon: Activity,
    title: "Activity heatmap",
    body: "A year of submissions at a glance, with streaks, busiest days and weekly rhythm.",
  },
  {
    icon: Trophy,
    title: "Contest history",
    body: "Rating trajectory across every contest, plus peak rating, global rank and top percentile.",
  },
];

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Backdrop: engineering grid + soft brand glow */}
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-220px] -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_147_255/0.22),transparent)] blur-2xl"
      />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
          <span className="size-1.5 rounded-full bg-brand" />
          LeetCode profile analytics
        </span>

        <h1
          className="animate-fade-up mt-6 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          Your LeetCode,{" "}
          <span className="text-gradient">quantified.</span>
        </h1>

        <p
          className="animate-fade-up mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Enter any LeetCode username to get a clean dashboard of their public stats:
          problems solved, difficulty mix, a year of activity and contest rating history.
        </p>

        <div className="animate-fade-up mt-9 w-full max-w-xl" style={{ animationDelay: "180ms" }}>
          <SearchForm variant="hero" autoFocus />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-ink-3">Try</span>
            {EXAMPLES.map((name) => (
              <Link
                key={name}
                href={`/u/${name}`}
                className="rounded-md border border-line bg-surface/60 px-2.5 py-1 font-mono text-xs text-ink-2 transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-ink"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="animate-fade-up mx-auto max-w-5xl px-4 sm:px-6"
        style={{ animationDelay: "260ms" }}
      >
        <HeroPreview />
      </section>

      <section className="mx-auto grid max-w-5xl gap-px overflow-hidden px-4 py-20 sm:grid-cols-3 sm:px-6">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="p-5 sm:p-6">
            <div className="flex size-9 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-brand">
              <Icon className="size-4" aria-hidden />
            </div>
            <h2 className="mt-4 text-[15px] font-medium tracking-tight">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
