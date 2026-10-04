import { z } from "zod";

/**
 * Runtime schemas for the subset of LeetCode's GraphQL responses we use.
 * Validation turns silent API drift into an explicit, handled error.
 */

const difficulty = z.enum(["All", "Easy", "Medium", "Hard"]);

const submissionCount = z.object({
  difficulty,
  count: z.number(),
  submissions: z.number(),
});

export const profileResponseSchema = z.object({
  allQuestionsCount: z.array(z.object({ difficulty, count: z.number() })),
  matchedUser: z
    .object({
      username: z.string(),
      profile: z.object({
        realName: z.string().nullish(),
        userAvatar: z.string().nullish(),
        ranking: z.number().nullish(),
        reputation: z.number().nullish(),
        countryName: z.string().nullish(),
        company: z.string().nullish(),
        school: z.string().nullish(),
        aboutMe: z.string().nullish(),
        skillTags: z.array(z.string()).nullish(),
      }),
      submitStatsGlobal: z.object({
        acSubmissionNum: z.array(submissionCount),
        totalSubmissionNum: z.array(submissionCount),
      }),
      badges: z
        .array(z.object({ id: z.string(), displayName: z.string(), icon: z.string() }))
        .nullish(),
    })
    .nullable(),
});

export const calendarResponseSchema = z.object({
  matchedUser: z
    .object({
      userCalendar: z
        .object({
          activeYears: z.array(z.number()),
          streak: z.number(),
          totalActiveDays: z.number(),
          submissionCalendar: z.string(),
        })
        .nullable(),
    })
    .nullable(),
});

const tagCount = z.object({
  tagName: z.string(),
  tagSlug: z.string(),
  problemsSolved: z.number(),
});

export const skillsResponseSchema = z.object({
  matchedUser: z
    .object({
      languageProblemCount: z
        .array(z.object({ languageName: z.string(), problemsSolved: z.number() }))
        .nullish(),
      tagProblemCounts: z
        .object({
          advanced: z.array(tagCount),
          intermediate: z.array(tagCount),
          fundamental: z.array(tagCount),
        })
        .nullish(),
    })
    .nullable(),
});

export const contestResponseSchema = z.object({
  userContestRanking: z
    .object({
      attendedContestsCount: z.number(),
      rating: z.number(),
      globalRanking: z.number(),
      totalParticipants: z.number(),
      topPercentage: z.number().nullable(),
      badge: z.object({ name: z.string() }).nullable(),
    })
    .nullable(),
  userContestRankingHistory: z
    .array(
      z.object({
        attended: z.boolean(),
        rating: z.number(),
        ranking: z.number(),
        problemsSolved: z.number(),
        totalProblems: z.number(),
        finishTimeInSeconds: z.number(),
        trendDirection: z.string().nullable(),
        contest: z.object({ title: z.string(), startTime: z.number() }),
      }),
    )
    .nullable(),
});

export const recentAcResponseSchema = z.object({
  recentAcSubmissionList: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        titleSlug: z.string(),
        timestamp: z.string(),
        lang: z.string(),
      }),
    )
    .nullable(),
});
