"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { RetryButton } from "@/components/dashboard/retry-button";

/** Fallback for unexpected rendering errors. Expected failures render inline. */
export default function ProfileErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-line-strong bg-surface text-ink-2">
        <TriangleAlert className="size-6" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-ink-2">
        We hit an unexpected error while building this dashboard.
        {error.digest && <span className="mt-1 block font-mono text-xs text-ink-3">ref {error.digest}</span>}
      </p>
      <div className="mt-8 flex items-center gap-3">
        <RetryButton onRetry={retry} />
        <Link href="/" className="rounded-lg px-4 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
          Back home
        </Link>
      </div>
    </div>
  );
}
