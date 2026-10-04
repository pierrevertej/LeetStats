import Link from "next/link";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ls-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b93ff" />
          <stop offset="1" stopColor="#b18cff" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#151821" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="rgb(255 255 255 / 0.1)" />
      <rect x="7" y="17" width="4" height="8" rx="1.5" fill="url(#ls-logo)" opacity="0.55" />
      <rect x="14" y="12" width="4" height="13" rx="1.5" fill="url(#ls-logo)" opacity="0.8" />
      <rect x="21" y="7" width="4" height="18" rx="1.5" fill="url(#ls-logo)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-md text-[15px] font-semibold tracking-tight"
      aria-label="LeetStats home"
    >
      <LogoMark className="size-7 transition-transform duration-300 group-hover:-rotate-6" />
      <span>
        Leet<span className="text-ink-2">Stats</span>
      </span>
    </Link>
  );
}
