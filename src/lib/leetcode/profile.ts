import "server-only";

import { cache } from "react";
import type { z } from "zod";

import { isValidUsername } from "@/lib/username";

import { queryLeetCode } from "./client";
import { LeetCodeError } from "./errors";
import {
  CALENDAR_QUERY,
  CONTEST_QUERY,
  PROFILE_QUERY,
  RECENT_AC_QUERY,
  SKILLS_QUERY,
} from "./queries";
import {
  calendarResponseSchema,
  contestResponseSchema,
  profileResponseSchema,
  recentAcResponseSchema,
  skillsResponseSchema,
} from "./schemas";
import type {
  ContestStats,
  DifficultyCounts,
  LeetCodeProfile,
  OptionalSection,
  SubmissionCalendar,
  TagStat,
} from "./types";

const RECENT_LIMIT = 15;

type CountRow = { difficulty: string; count: number };

function toDifficultyCounts(rows: CountRow[]): DifficultyCounts {
  const get = (d: string) => rows.find((r) => r.difficulty === d)?.count ?? 0;
  return { all: get("All"), easy: get("Easy"), medium: get("Medium"), hard: get("Hard") };
}

function absoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://leetcode.com${url}`;
  return url;
}

function toCalendar(
  data: z.infer<typeof calendarResponseSchema>,
): SubmissionCalendar | null {
  const cal = data.matchedUser?.userCalendar;
  if (!cal) return null;
  const raw = JSON.parse(cal.submissionCalendar || "{}") as Record<string, number>;
  const days: Record<string, number> = {};
  for (const [epoch, count] of Object.entries(raw)) {
    const key = new Date(Number(epoch) * 1000).toISOString().slice(0, 10);
    days[key] = (days[key] ?? 0) + count;
  }
  return { days, activeYears: cal.activeYears };
}

function toContest(data: z.infer<typeof contestResponseSchema>): ContestStats | null {
  const ranking = data.userContestRanking;
  if (!ranking || ranking.attendedContestsCount === 0) return null;
  const history = (data.userContestRankingHistory ?? [])
    .filter((h) => h.attended)
    .map((h) => ({
      title: h.contest.title,
      startTime: h.contest.startTime,
      rating: Math.round(h.rating),
      ranking: h.ranking,
      solved: h.problemsSolved,
      totalProblems: h.totalProblems,
      finishTimeSeconds: h.finishTimeInSeconds,
    }))
    .sort((a, b) => a.startTime - b.startTime);
  return {
    rating: Math.round(ranking.rating),
    globalRanking: ranking.globalRanking,
    totalParticipants: ranking.totalParticipants,
    topPercentage: ranking.topPercentage,
    attended: ranking.attendedContestsCount,
    badge: ranking.badge?.name ?? null,
    history,
  };
}

/**
 * Fetches and normalizes everything we show for a user.
 *
 * The core profile query is required (it also tells us whether the user
 * exists). Every other section is fetched in parallel and allowed to fail
 * independently, so a single upstream hiccup degrades one card rather than
 * the whole dashboard.
 *
 * Wrapped in React `cache` so `generateMetadata` and the page share a call.
 */
export const getLeetCodeProfile = cache(
  async (username: string): Promise<LeetCodeProfile> => {
    if (!isValidUsername(username)) throw new LeetCodeError("INVALID_USERNAME");

    const vars = { username };
    const [core, calendar, skills, contest, recent] = await Promise.allSettled([
      queryLeetCode(PROFILE_QUERY, vars, profileResponseSchema),
      queryLeetCode(CALENDAR_QUERY, vars, calendarResponseSchema),
      queryLeetCode(SKILLS_QUERY, vars, skillsResponseSchema),
      queryLeetCode(CONTEST_QUERY, vars, contestResponseSchema),
      queryLeetCode(RECENT_AC_QUERY, { ...vars, limit: RECENT_LIMIT }, recentAcResponseSchema),
    ]);

    if (core.status === "rejected") throw core.reason;
    const user = core.value.matchedUser;
    if (!user) throw new LeetCodeError("USER_NOT_FOUND");

    const unavailable: OptionalSection[] = [];
    function settle<T, R>(
      result: PromiseSettledResult<T>,
      section: OptionalSection,
      map: (value: T) => R,
    ): R | null {
      if (result.status === "fulfilled") {
        try {
          return map(result.value);
        } catch {
          // Fall through to "unavailable" if the payload is malformed.
        }
      }
      unavailable.push(section);
      return null;
    }

    const allAc = user.submitStatsGlobal.acSubmissionNum.find((r) => r.difficulty === "All");
    const allTotal = user.submitStatsGlobal.totalSubmissionNum.find(
      (r) => r.difficulty === "All",
    );

    return {
      username: user.username,
      realName: user.profile.realName?.trim() || null,
      avatarUrl: absoluteUrl(user.profile.userAvatar),
      ranking: user.profile.ranking ?? null,
      reputation: user.profile.reputation ?? null,
      country: user.profile.countryName || null,
      company: user.profile.company || null,
      school: user.profile.school || null,
      skillTags: user.profile.skillTags ?? [],
      badges: (user.badges ?? []).map((b) => ({
        id: b.id,
        name: b.displayName,
        iconUrl: absoluteUrl(b.icon) ?? "",
      })),
      solved: toDifficultyCounts(user.submitStatsGlobal.acSubmissionNum),
      questionTotals: toDifficultyCounts(core.value.allQuestionsCount),
      submissions: {
        accepted: allAc?.submissions ?? 0,
        total: allTotal?.submissions ?? 0,
      },
      calendar: settle(calendar, "calendar", toCalendar),
      languages: settle(skills, "skills", (d) =>
        (d.matchedUser?.languageProblemCount ?? [])
          .map((l) => ({ name: l.languageName, solved: l.problemsSolved }))
          .filter((l) => l.solved > 0)
          .sort((a, b) => b.solved - a.solved),
      ),
      tags: settle(skills, "skills", (d) => {
        const t = d.matchedUser?.tagProblemCounts;
        if (!t) return [];
        const levels = ["fundamental", "intermediate", "advanced"] as const;
        return levels
          .flatMap((level): TagStat[] =>
            t[level].map((x) => ({
              name: x.tagName,
              slug: x.tagSlug,
              solved: x.problemsSolved,
              level,
            })),
          )
          .filter((x) => x.solved > 0)
          .sort((a, b) => b.solved - a.solved);
      }),
      contest: settle(contest, "contest", toContest),
      recent: settle(recent, "recent", (d) =>
        (d.recentAcSubmissionList ?? []).map((s) => ({
          id: s.id,
          title: s.title,
          slug: s.titleSlug,
          timestamp: Number(s.timestamp),
          lang: s.lang,
        })),
      ),
      unavailable: [...new Set(unavailable)],
      fetchedAt: new Date().toISOString(),
    };
  },
);
