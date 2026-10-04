import type {
  ContestStats,
  LeetCodeProfile,
  SubmissionCalendar,
} from "@/lib/leetcode/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DAY_MS = 86_400_000;

function utcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function ratio(part: number, whole: number): number {
  return whole > 0 ? part / whole : 0;
}

/* ------------------------------------------------------------------ */
/* Solving                                                             */
/* ------------------------------------------------------------------ */

export interface SolvingStats {
  acceptanceRate: number;
  /** Fraction of all LeetCode problems the user has solved. */
  completion: number;
  /** Share of the user's solves by difficulty (sums to ~1). */
  mix: { easy: number; medium: number; hard: number };
  /** Fraction of each difficulty's problem pool solved. */
  coverage: { easy: number; medium: number; hard: number };
  /** Medium + Hard share — a rough "depth" indicator. */
  challengeShare: number;
}

export function computeSolvingStats(profile: LeetCodeProfile): SolvingStats {
  const { solved, questionTotals, submissions } = profile;
  return {
    acceptanceRate: ratio(submissions.accepted, submissions.total),
    completion: ratio(solved.all, questionTotals.all),
    mix: {
      easy: ratio(solved.easy, solved.all),
      medium: ratio(solved.medium, solved.all),
      hard: ratio(solved.hard, solved.all),
    },
    coverage: {
      easy: ratio(solved.easy, questionTotals.easy),
      medium: ratio(solved.medium, questionTotals.medium),
      hard: ratio(solved.hard, questionTotals.hard),
    },
    challengeShare: ratio(solved.medium + solved.hard, solved.all),
  };
}

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

export interface HeatmapCell {
  date: string;
  count: number;
  /** 0 (none) – 4 (highest) intensity bucket. */
  level: 0 | 1 | 2 | 3 | 4;
  /** Cells after "today" pad the final week and aren't rendered. */
  future: boolean;
}

export interface ActivityStats {
  /** Columns of 7 cells (Sun→Sat), oldest week first. */
  weeks: HeatmapCell[][];
  monthLabels: { index: number; label: string }[];
  totalSubmissions: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; count: number } | null;
  averagePerActiveDay: number;
  /** Submissions per weekday, Sun→Sat. */
  weekdayTotals: number[];
  /** Upper bound per intensity level, for the legend/tooltips. */
  thresholds: number[];
}

const WEEKS = 53;

/** Quantile-based buckets so a single huge day doesn't wash out the map. */
function computeThresholds(counts: number[]): number[] {
  const positive = counts.filter((c) => c > 0).sort((a, b) => a - b);
  if (positive.length === 0) return [1, 2, 3, 4];
  const q = (p: number) => positive[Math.min(positive.length - 1, Math.floor(p * positive.length))];
  const t = [q(0.25), q(0.5), q(0.75)];
  // Ensure strictly increasing thresholds.
  for (let i = 1; i < t.length; i++) t[i] = Math.max(t[i], t[i - 1] + 1);
  return t;
}

function levelFor(count: number, thresholds: number[]): HeatmapCell["level"] {
  if (count <= 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4;
}

export function computeActivityStats(
  calendar: SubmissionCalendar,
  now: Date = new Date(),
): ActivityStats {
  const today = startOfUtcDay(now);
  // Grid ends on the Saturday of the current week, starts WEEKS weeks earlier on a Sunday.
  const end = new Date(today.getTime() + (6 - today.getUTCDay()) * DAY_MS);
  const start = new Date(end.getTime() - (WEEKS * 7 - 1) * DAY_MS);

  const windowCounts: number[] = [];
  for (let t = start.getTime(); t <= today.getTime(); t += DAY_MS) {
    windowCounts.push(calendar.days[utcDayKey(new Date(t))] ?? 0);
  }
  const thresholds = computeThresholds(windowCounts);

  const weeks: HeatmapCell[][] = [];
  const monthLabels: ActivityStats["monthLabels"] = [];
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  let lastMonth = -1;
  let total = 0;
  let activeDays = 0;
  let bestDay: ActivityStats["bestDay"] = null;
  let longestStreak = 0;
  let run = 0;

  for (let w = 0; w < WEEKS; w++) {
    const week: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
      const key = utcDayKey(date);
      const future = date.getTime() > today.getTime();
      const count = future ? 0 : (calendar.days[key] ?? 0);

      if (d === 0 && date.getUTCMonth() !== lastMonth) {
        lastMonth = date.getUTCMonth();
        monthLabels.push({
          index: w,
          label: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
        });
      }

      if (!future) {
        total += count;
        weekdayTotals[d] += count;
        if (count > 0) {
          activeDays++;
          run++;
          longestStreak = Math.max(longestStreak, run);
          if (!bestDay || count > bestDay.count) bestDay = { date: key, count };
        } else {
          run = 0;
        }
      }
      week.push({ date: key, count, level: levelFor(count, thresholds), future });
    }
    weeks.push(week);
  }

  // Drop a month label that would collide with the next one at the left edge.
  if (monthLabels.length > 1 && monthLabels[1].index - monthLabels[0].index < 3) {
    monthLabels.shift();
  }
  // Likewise drop a label too close to the right edge to fit.
  if (monthLabels.length && WEEKS - monthLabels[monthLabels.length - 1].index < 3) {
    monthLabels.pop();
  }

  // Current streak: consecutive active days ending today, or yesterday
  // (so the streak isn't "broken" just because today isn't over yet).
  let currentStreak = 0;
  let cursor = today.getTime();
  if (!calendar.days[utcDayKey(new Date(cursor))]) cursor -= DAY_MS;
  while (calendar.days[utcDayKey(new Date(cursor))]) {
    currentStreak++;
    cursor -= DAY_MS;
  }

  return {
    weeks,
    monthLabels,
    totalSubmissions: total,
    activeDays,
    currentStreak,
    longestStreak,
    bestDay,
    averagePerActiveDay: ratio(total, activeDays),
    weekdayTotals,
    thresholds,
  };
}

/* ------------------------------------------------------------------ */
/* Contests                                                            */
/* ------------------------------------------------------------------ */

export interface ContestSummary {
  peakRating: number;
  lastChange: number | null;
  bestRanking: number | null;
  averageSolvedRatio: number;
}

export function computeContestSummary(contest: ContestStats): ContestSummary {
  const h = contest.history;
  const peakRating = h.reduce((max, e) => Math.max(max, e.rating), contest.rating);
  const lastChange = h.length >= 2 ? h[h.length - 1].rating - h[h.length - 2].rating : null;
  const bestRanking = h.length ? Math.min(...h.map((e) => e.ranking)) : null;
  const averageSolvedRatio = h.length
    ? h.reduce((sum, e) => sum + ratio(e.solved, e.totalProblems), 0) / h.length
    : 0;
  return { peakRating, lastChange, bestRanking, averageSolvedRatio };
}
