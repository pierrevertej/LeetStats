"use client";

import { usePathname } from "next/navigation";

import { Logo } from "./logo";
import { SearchForm } from "./search-form";

export function SiteHeader() {
  const pathname = usePathname();
  const onDashboard = pathname.startsWith("/u/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="shrink-0">
          <Logo />
        </div>
        {onDashboard ? (
          // Keyed by path so the field resets when navigating between profiles.
          <div className="min-w-0 max-w-xs flex-1" key={pathname}>
            <SearchForm variant="compact" />
          </div>
        ) : (
          <span className="hidden items-center gap-2 font-mono text-xs text-ink-3 sm:flex">
            <span className="size-1.5 rounded-full bg-easy shadow-[0_0_8px_var(--color-easy)]" />
            public profile data only
          </span>
        )}
      </div>
    </header>
  );
}
