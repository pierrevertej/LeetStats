import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
  /** Stagger index for the entrance animation. */
  index?: number;
}

export function Card({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
  index = 0,
}: CardProps) {
  return (
    <section
      className={cn(
        "animate-fade-up group/card relative flex min-w-0 flex-col rounded-2xl border border-line bg-surface",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] transition-colors duration-300 hover:border-line-strong",
        className,
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-medium tracking-tight text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-ink-3">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("min-w-0 flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line px-6 py-8 text-center">
      <div className="text-ink-3">{icon}</div>
      <p className="text-sm font-medium text-ink-2">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-ink-3">{body}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  // Only apply the default radius when the caller doesn't set one, since
  // two `rounded-*` utilities would conflict.
  return <div className={cn("skeleton", !className?.includes("rounded") && "rounded-md", className)} />;
}
