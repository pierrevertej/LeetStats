"use client";

import { Loader2, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Re-runs the server render (and therefore the LeetCode fetch). */
export function RetryButton({ onRetry }: { onRetry?: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => (onRetry ? onRetry() : router.refresh()))}
      className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white/[0.08] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RotateCw className="size-4" aria-hidden />}
      Try again
    </button>
  );
}
