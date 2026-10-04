import {
  Activity,
  Award,
  CalendarDays,
  CircleSlash,
  Code2,
  Flame,
  Globe2,
  Inbox,
  Layers,
  ListChecks,
  Target,
  Trophy,
  WifiOff,
} from "lucide-react";
import type { ReactNode } from "react";

import type { LeetCodeProfile, OptionalSection } from "@/lib/leetcode/types";
import {
  computeActivityStats,
  computeContestSummary,
  computeSolvingStats,
} from "@/lib/stats/compute";
import { formatCompact, formatDate, formatDuration, formatNumber, formatPercent } from "@/lib/format";
import { Card, EmptyState } from "@/components/ui/card";

import { ActivityHeatmap } from "./activity-heatmap";
import { DifficultyBreakdown } from "./difficulty-breakdown";
import { ProfileHeader } from "./profile-header";
import { RankedBars } from "./ranked-bars";
import { RatingChart } from "./rating-chart";
import { RecentSubmissions } from "./recent-submissions";
import { StatCard } from "./stat-card";
import { WeekdayChart } from "./weekday-chart";

function Unavailable({ section }: { section: string }) {
  return (
    <EmptyState
      icon={<WifiOff className="size-5" />}
      title={`Couldn't load ${section}`}
      body="LeetCode didn't return this part of the profile. Refresh in a moment to try again."
    />
  );
}

function MiniStat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">{label}</div>
      <div className="tabular mt-1 truncate text-lg font-semibold tracking-tight">{value}</div>
      {hint && <div className="truncate text-[11px] text-ink-3">{hint}</div>}
    </div>
  );
}

export function Dashboard({ profile }: { profile: LeetCodeProfile }) {
  const failed = (s: OptionalSection) => profile.unavailable.includes(s);
  const solving = computeSolvingStats(profile);
  const activity = profile.calendar ? computeActivityStats(profile.calendar) : null;
  const contest = profile.contest;
  const contestSummary = contest ? computeContestSummary(contest) : null;

  return (
    <div className="relative isolate overflow-x-clip">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 -z-10 h-80" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-200px] -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_147_255/0.14),transparent)] blur-2xl"
      />

      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:space-y-5 sm:px-6 sm:py-10">
        <ProfileHeader profile={profile} />

        {/* Headline numbers */}
        <div className="grid grid-cols-2 gap-3 pt-2 sm:gap-4 lg:grid-cols-4">
          <StatCard
            index={1}
            icon={ListChecks}
            label="Solved"
            value={formatNumber(profile.solved.all)}
            hint={`${formatPercent(solving.completion)} of ${formatNumber(profile.questionTotals.all)} problems`}
          />
          <StatCard
            index={2}
            icon={Target}
            label="Acceptance"
            value={profile.submissions.total ? formatPercent(solving.acceptanceRate) : "—"}
            muted={!profile.submissions.total}
            hint={
              profile.submissions.total
                ? `${formatNumber(profile.submissions.accepted)} of ${formatNumber(profile.submissions.total)} submissions`
                : "No submissions yet"
            }
          />
          <StatCard
            index={3}
            icon={Globe2}
            label="Global rank"
            value={profile.ranking ? `#${formatCompact(profile.ranking)}` : "—"}
            muted={!profile.ranking}
            hint={profile.ranking ? "LeetCode profile ranking" : "Not ranked"}
          />
          <StatCard
            index={4}
            icon={Trophy}
            label="Contest rating"
            value={contest ? formatNumber(contest.rating) : "—"}
            muted={!contest}
            hint={
              contest
                ? contest.topPercentage != null
                  ? `Top ${contest.topPercentage}% · #${formatCompact(contest.globalRanking)}`
                  : `#${formatCompact(contest.globalRanking)} globally`
                : failed("contest")
                  ? "Couldn't load contests"
                  : "No rated contests"
            }
          />
        </div>

        {/* Solving */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-5">
          <Card
            index={5}
            className="lg:col-span-3"
            title="Difficulty breakdown"
            description="Problems solved by difficulty, and how much of each pool is covered"
          >
            <DifficultyBreakdown solved={profile.solved} totals={profile.questionTotals} />
          </Card>

          <Card index={6} className="lg:col-span-2" title="Solving profile" description="Derived from accepted problems">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <MiniStat
                label="Challenge share"
                value={formatPercent(solving.challengeShare, 0)}
                hint="Medium + hard solves"
              />
              <MiniStat
                label="Hard ratio"
                value={formatPercent(solving.mix.hard, 0)}
                hint={`${formatNumber(profile.solved.hard)} hard problems`}
              />
              <MiniStat
                label="Submissions"
                value={formatNumber(profile.submissions.total)}
                hint={`${formatNumber(profile.submissions.accepted)} accepted`}
              />
              <MiniStat
                label="Per solve"
                value={
                  profile.solved.all
                    ? (profile.submissions.total / profile.solved.all).toFixed(1)
                    : "—"
                }
                hint="Avg. submissions per problem"
              />
            </div>
            {/* Mix bar: proportional stacked strip with 2px surface gaps */}
            {profile.solved.all > 0 && (
              <div className="mt-7">
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                  {(["easy", "medium", "hard"] as const).map((d) =>
                    solving.mix[d] > 0 ? (
                      <div
                        key={d}
                        className="h-full"
                        style={{ flex: `${solving.mix[d]} 1 0%`, background: `var(--color-${d})` }}
                        title={`${d}: ${formatPercent(solving.mix[d], 0)}`}
                      />
                    ) : null,
                  )}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-3">
                  <span>easy {formatPercent(solving.mix.easy, 0)}</span>
                  <span>medium {formatPercent(solving.mix.medium, 0)}</span>
                  <span>hard {formatPercent(solving.mix.hard, 0)}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Activity */}
        <Card
          index={7}
          title="Submission activity"
          description="Daily submissions over the past year (UTC)"
          action={
            activity && activity.currentStreak > 0 && (
              <span className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-2 sm:inline-flex">
                <Flame className="size-3.5 text-medium" aria-hidden />
                {activity.currentStreak} day streak
              </span>
            )
          }
        >
          {activity ? (
            <div className="space-y-6">
              <ActivityHeatmap activity={activity} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-5 sm:grid-cols-5">
                <MiniStat label="Submissions" value={formatNumber(activity.totalSubmissions)} hint="past 12 months" />
                <MiniStat label="Active days" value={formatNumber(activity.activeDays)} hint={`${formatPercent(activity.activeDays / 365, 0)} of days`} />
                <MiniStat label="Current streak" value={`${activity.currentStreak}d`} hint="consecutive days" />
                <MiniStat label="Longest streak" value={`${activity.longestStreak}d`} hint="in the past year" />
                <MiniStat
                  label="Best day"
                  value={activity.bestDay ? formatNumber(activity.bestDay.count) : "—"}
                  hint={activity.bestDay ? formatDate(activity.bestDay.date) : "no activity"}
                />
              </div>
            </div>
          ) : failed("calendar") ? (
            <Unavailable section="activity" />
          ) : (
            <EmptyState icon={<CalendarDays className="size-5" />} title="No activity data" body="This profile has no public submission calendar." />
          )}
        </Card>

        {/* Contests */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <Card
            index={8}
            className="lg:col-span-2"
            title="Contest rating"
            description={contest ? `${contest.history.length} rated contests` : "Rating history across LeetCode contests"}
          >
            {contest && contest.history.length > 0 && contestSummary ? (
              <RatingChart history={contest.history} peak={contestSummary.peakRating} />
            ) : failed("contest") ? (
              <Unavailable section="contest history" />
            ) : (
              <EmptyState
                icon={<Trophy className="size-5" />}
                title="No contest history"
                body="This user hasn't taken part in any rated LeetCode contests yet."
              />
            )}
          </Card>

          <Card index={9} title="Contest summary">
            {contest && contestSummary ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <MiniStat label="Rating" value={formatNumber(contest.rating)} hint={contest.badge ?? "current"} />
                <MiniStat label="Peak" value={formatNumber(contestSummary.peakRating)} hint="highest rating" />
                <MiniStat
                  label="Global rank"
                  value={`#${formatCompact(contest.globalRanking)}`}
                  hint={`of ${formatCompact(contest.totalParticipants)}`}
                />
                <MiniStat
                  label="Top"
                  value={contest.topPercentage != null ? `${contest.topPercentage}%` : "—"}
                  hint="percentile"
                />
                <MiniStat label="Attended" value={formatNumber(contest.attended)} hint="contests" />
                <MiniStat
                  label="Last change"
                  value={
                    contestSummary.lastChange == null ? (
                      "—"
                    ) : (
                      <span className={contestSummary.lastChange >= 0 ? "text-easy" : "text-hard"}>
                        {contestSummary.lastChange >= 0 ? "+" : ""}
                        {contestSummary.lastChange}
                      </span>
                    )
                  }
                  hint="most recent contest"
                />
                <MiniStat
                  label="Best rank"
                  value={contestSummary.bestRanking ? `#${formatNumber(contestSummary.bestRanking)}` : "—"}
                  hint="single contest"
                />
                <MiniStat
                  label="Avg. solved"
                  value={formatPercent(contestSummary.averageSolvedRatio, 0)}
                  hint={
                    contest.history.length
                      ? `last finish ${formatDuration(contest.history[contest.history.length - 1].finishTimeSeconds)}`
                      : "per contest"
                  }
                />
              </div>
            ) : failed("contest") ? (
              <Unavailable section="contests" />
            ) : (
              <EmptyState icon={<CircleSlash className="size-5" />} title="Unrated" body="Contest stats appear after the first rated contest." />
            )}
          </Card>
        </div>

        {/* Skills */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card index={10} title="Languages" description="Problems solved per language">
            {profile.languages && profile.languages.length > 0 ? (
              <RankedBars unit="problems" items={profile.languages.slice(0, 6).map((l) => ({ label: l.name, value: l.solved }))} />
            ) : failed("skills") ? (
              <Unavailable section="languages" />
            ) : (
              <EmptyState icon={<Code2 className="size-5" />} title="No language data" body="Languages appear once problems are solved." />
            )}
          </Card>

          <Card index={11} title="Top topics" description="Most-solved problem tags">
            {profile.tags && profile.tags.length > 0 ? (
              <RankedBars
                unit="problems"
                items={profile.tags.slice(0, 6).map((t) => ({ label: t.name, value: t.solved, sublabel: t.level }))}
              />
            ) : failed("skills") ? (
              <Unavailable section="topics" />
            ) : (
              <EmptyState icon={<Layers className="size-5" />} title="No topic data" body="Topics appear once problems are solved." />
            )}
          </Card>

          <Card index={12} className="md:col-span-2 lg:col-span-1" title="Weekly rhythm" description="Submissions by weekday, past year">
            {activity && activity.totalSubmissions > 0 ? (
              <WeekdayChart totals={activity.weekdayTotals} />
            ) : failed("calendar") ? (
              <Unavailable section="activity" />
            ) : (
              <EmptyState icon={<Activity className="size-5" />} title="Nothing yet" body="No submissions in the past year." />
            )}
          </Card>
        </div>

        {/* Recent + badges */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <Card index={13} className="lg:col-span-2" title="Recent accepted" description="Latest accepted submissions">
            {profile.recent && profile.recent.length > 0 ? (
              <RecentSubmissions items={profile.recent.slice(0, 8)} />
            ) : failed("recent") ? (
              <Unavailable section="recent submissions" />
            ) : (
              <EmptyState icon={<Inbox className="size-5" />} title="No recent submissions" body="Accepted submissions will show up here." />
            )}
          </Card>

          <Card index={14} title="Badges" description={profile.badges.length ? `${profile.badges.length} earned` : undefined}>
            {profile.badges.length > 0 ? (
              <ul className="grid grid-cols-3 gap-3">
                {profile.badges.slice(0, 9).map((b) => (
                  <li
                    key={b.id}
                    title={b.name}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-line bg-surface-2/50 p-3 text-center transition-colors hover:border-line-strong"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.iconUrl} alt="" className="size-10 object-contain transition-transform duration-300 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <span className="line-clamp-2 text-[10px] leading-tight text-ink-3">{b.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Award className="size-5" />} title="No badges yet" body="Badges come from streaks, study plans and contests." />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
