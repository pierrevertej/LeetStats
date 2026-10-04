import { Skeleton } from "@/components/ui/card";

function CardSkeleton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>{children}</div>;
}

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:space-y-5 sm:px-6 sm:py-10" aria-busy="true">
      <span className="sr-only" role="status">Loading profile…</span>

      <div className="flex items-center gap-4 sm:gap-5">
        <Skeleton className="size-16 rounded-2xl sm:size-20" />
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i} className="p-4 sm:p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-7 w-24" />
            <Skeleton className="mt-2 h-3 w-32 max-w-full" />
          </CardSkeleton>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-5">
        <CardSkeleton className="lg:col-span-3">
          <Skeleton className="h-4 w-40" />
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            <Skeleton className="size-44 rounded-full" />
            <div className="w-full flex-1 space-y-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardSkeleton>
        <CardSkeleton className="lg:col-span-2">
          <Skeleton className="h-4 w-32" />
          <div className="mt-6 grid grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardSkeleton>
      </div>

      <CardSkeleton>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-6 h-[110px] w-full" />
      </CardSkeleton>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <CardSkeleton className="lg:col-span-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-6 h-56 w-full" />
        </CardSkeleton>
        <CardSkeleton>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-56 w-full" />
        </CardSkeleton>
      </div>
    </div>
  );
}
