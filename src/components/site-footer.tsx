export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          LeetStats reads publicly visible LeetCode profile data. Not affiliated with LeetCode.
        </p>
        <p className="font-mono">Data cached for up to 10 minutes.</p>
      </div>
    </footer>
  );
}
