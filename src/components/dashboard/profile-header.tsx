import { Building2, ExternalLink, GraduationCap, MapPin } from "lucide-react";

import type { LeetCodeProfile } from "@/lib/leetcode/types";
import { formatNumber } from "@/lib/format";

import { Avatar } from "./avatar";

export function ProfileHeader({ profile }: { profile: LeetCodeProfile }) {
  const meta = [
    profile.country && { icon: MapPin, text: profile.country },
    profile.company && { icon: Building2, text: profile.company },
    profile.school && { icon: GraduationCap, text: profile.school },
  ].filter(Boolean) as { icon: typeof MapPin; text: string }[];

  return (
    <div className="animate-fade-up flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <Avatar src={profile.avatarUrl} name={profile.username} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              {profile.realName ?? profile.username}
            </h1>
            {profile.contest?.badge && (
              <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
                {profile.contest.badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 font-mono text-sm text-ink-2">@{profile.username}</p>
          {meta.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
              {meta.map(({ icon: Icon, text }) => (
                <li key={text} className="flex min-w-0 items-center gap-1.5">
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <a
          href={`https://leetcode.com/u/${profile.username}/`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          View on LeetCode
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
        {profile.reputation != null && (
          <p className="font-mono text-[11px] text-ink-3">
            reputation {formatNumber(profile.reputation)}
          </p>
        )}
      </div>
    </div>
  );
}
