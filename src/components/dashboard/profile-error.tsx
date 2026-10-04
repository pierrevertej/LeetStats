import { CloudOff, Gauge, SearchX, ServerCrash, UserX } from "lucide-react";
import Link from "next/link";

import type { LeetCodeErrorCode } from "@/lib/leetcode/errors";
import { SearchForm } from "@/components/search-form";

import { RetryButton } from "./retry-button";

const CONTENT: Record<
  LeetCodeErrorCode,
  { icon: typeof UserX; title: (u: string) => string; retry: boolean }
> = {
  USER_NOT_FOUND: { icon: UserX, title: (u) => `No LeetCode user named “${u}”`, retry: false },
  INVALID_USERNAME: { icon: SearchX, title: () => "That isn't a valid username", retry: false },
  RATE_LIMITED: { icon: Gauge, title: () => "Too many requests", retry: true },
  UPSTREAM_UNAVAILABLE: { icon: CloudOff, title: () => "Couldn't reach LeetCode", retry: true },
  UNEXPECTED_RESPONSE: { icon: ServerCrash, title: () => "Unexpected response from LeetCode", retry: true },
};

const HINTS: Partial<Record<LeetCodeErrorCode, string>> = {
  USER_NOT_FOUND:
    "Usernames are the handle in the profile URL (leetcode.com/u/handle), not the display name. Check the spelling and try again.",
};

export function ProfileError({
  code,
  message,
  username,
}: {
  code: LeetCodeErrorCode;
  message: string;
  username: string;
}) {
  const { icon: Icon, title, retry } = CONTENT[code];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="animate-fade-up relative">
        <div aria-hidden className="absolute inset-0 -z-10 rounded-full bg-hard/20 blur-2xl" />
        <div className="flex size-14 items-center justify-center rounded-2xl border border-line-strong bg-surface text-ink-2">
          <Icon className="size-6" aria-hidden />
        </div>
      </div>
      <h1 className="animate-fade-up mt-6 text-balance text-2xl font-semibold tracking-tight" style={{ animationDelay: "50ms" }}>
        {title(username)}
      </h1>
      <p className="animate-fade-up mt-2 text-pretty text-sm leading-relaxed text-ink-2" style={{ animationDelay: "100ms" }}>
        {message}
      </p>
      {HINTS[code] && (
        <p className="animate-fade-up mt-2 text-pretty text-xs leading-relaxed text-ink-3" style={{ animationDelay: "120ms" }}>
          {HINTS[code]}
        </p>
      )}

      <div className="animate-fade-up mt-8 w-full" style={{ animationDelay: "160ms" }}>
        {retry ? (
          <div className="flex items-center justify-center gap-3">
            <RetryButton />
            <Link href="/" className="rounded-lg px-4 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
              Back home
            </Link>
          </div>
        ) : (
          <SearchForm variant="hero" defaultValue="" autoFocus />
        )}
      </div>
    </div>
  );
}
