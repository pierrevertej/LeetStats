"use client";

import { ArrowRight, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition, type FormEvent } from "react";

import { cn } from "@/lib/cn";
import { isValidUsername, normalizeUsername } from "@/lib/username";

interface SearchFormProps {
  variant?: "hero" | "compact";
  defaultValue?: string;
  autoFocus?: boolean;
}

export function SearchForm({ variant = "hero", defaultValue = "", autoFocus }: SearchFormProps) {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hero = variant === "hero";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const username = normalizeUsername(value);
    if (!username) {
      setError("Enter a LeetCode username to analyze.");
      return;
    }
    if (!isValidUsername(username)) {
      setError("Usernames can only contain letters, numbers, “-”, “_” and “.”.");
      return;
    }
    setError(null);
    startTransition(() => router.push(`/u/${encodeURIComponent(username)}`));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative w-full" role="search">
      <label htmlFor={inputId} className="sr-only">
        LeetCode username
      </label>
      <div
        className={cn(
          "group relative flex items-center rounded-xl border bg-surface/80 backdrop-blur transition-[border-color,box-shadow] duration-200",
          "focus-within:border-brand/60 focus-within:shadow-[0_0_0_4px_rgb(139_147_255/0.12)]",
          error ? "border-hard/60" : "border-line-strong hover:border-white/20",
          hero ? "h-14 p-1.5 sm:h-16" : "h-10 p-1",
        )}
      >
        <Search
          aria-hidden
          className={cn(
            "pointer-events-none shrink-0 text-ink-3 transition-colors group-focus-within:text-brand",
            hero ? "ml-3 size-5" : "ml-2 size-4",
          )}
        />
        {hero && (
          <span className="pointer-events-none ml-2 hidden font-mono text-sm text-ink-3 sm:inline">
            leetcode.com/u/
          </span>
        )}
        <input
          id={inputId}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus={autoFocus}
          placeholder={hero ? "username" : "Search username…"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3",
            hero ? "pl-2 font-mono text-base sm:pl-0.5 sm:text-lg" : "pl-2 text-sm",
          )}
        />
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "relative inline-flex h-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg font-medium text-white transition-all duration-200",
            "bg-gradient-to-b from-[#9aa1ff] to-[#6f78f0] shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(0_0_0/0.4)]",
            "hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80",
            hero ? "px-4 text-sm sm:px-6 sm:text-[15px]" : "px-3 text-xs",
          )}
        >
          {isPending ? (
            <Loader2 className={cn("animate-spin", hero ? "size-4" : "size-3.5")} aria-hidden />
          ) : null}
          <span>{isPending ? "Analyzing" : "Analyze"}</span>
          {!isPending && hero ? (
            <ArrowRight className="hidden size-4 sm:block" aria-hidden />
          ) : null}
        </button>
      </div>
      <p
        id={errorId}
        role="alert"
        className={cn(
          "text-sm text-[#ff8a9b] transition-all",
          error ? "mt-2 opacity-100" : "h-0 opacity-0",
          hero ? "text-left" : "absolute",
        )}
      >
        {error}
      </p>
    </form>
  );
}
