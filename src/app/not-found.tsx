import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-ink-2">This page doesn&apos;t exist. Try analyzing a username instead.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-line-strong bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/[0.08]"
      >
        Go home
      </Link>
    </div>
  );
}
