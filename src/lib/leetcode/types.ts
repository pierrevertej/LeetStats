/** Normalized, UI-friendly shape of a LeetCode profile. */

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyCounts {
  all: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface Badge {
  id: string;
  name: string;
  iconUrl: string;
}

export interface SubmissionCalendar {
  /** Submissions per UTC day, keyed `YYYY-MM-DD`. Covers the trailing year. */
  days: Record<string, number>;
  activeYears: number[];
}

export interface LanguageStat {
  name: string;
  solved: number;
}

export interface TagStat {
  name: string;
  slug: string;
  solved: number;
  level: "fundamental" | "intermediate" | "advanced";
}

export interface ContestEntry {
  title: string;
  /** Unix seconds. */
  startTime: number;
  rating: number;
  ranking: number;
  solved: number;
  totalProblems: number;
  finishTimeSeconds: number;
}

export interface ContestStats {
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  topPercentage: number | null;
  attended: number;
  badge: string | null;
  history: ContestEntry[];
}

export interface RecentSubmission {
  id: string;
  title: string;
  slug: string;
  /** Unix seconds. */
  timestamp: number;
  lang: string;
}

export type OptionalSection = "calendar" | "skills" | "contest" | "recent";

export interface LeetCodeProfile {
  username: string;
  realName: string | null;
  avatarUrl: string | null;
  ranking: number | null;
  reputation: number | null;
  country: string | null;
  company: string | null;
  school: string | null;
  skillTags: string[];
  badges: Badge[];
  solved: DifficultyCounts;
  /** Total problems available on LeetCode per difficulty. */
  questionTotals: DifficultyCounts;
  submissions: { accepted: number; total: number };
  calendar: SubmissionCalendar | null;
  languages: LanguageStat[] | null;
  tags: TagStat[] | null;
  contest: ContestStats | null;
  recent: RecentSubmission[] | null;
  /** Optional sections that failed to load (vs. simply being empty). */
  unavailable: OptionalSection[];
  /** ISO timestamp of when this profile was assembled. */
  fetchedAt: string;
}
