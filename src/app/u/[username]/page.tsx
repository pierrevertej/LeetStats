import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard/dashboard";
import { ProfileError } from "@/components/dashboard/profile-error";
import { isLeetCodeError, LeetCodeError } from "@/lib/leetcode/errors";
import { getLeetCodeProfile } from "@/lib/leetcode/profile";
import { safeDecode } from "@/lib/username";

type Result =
  | { ok: true; profile: Awaited<ReturnType<typeof getLeetCodeProfile>> }
  | { ok: false; error: LeetCodeError };

/** Expected failures (bad username, upstream issues) are modelled as values. */
async function loadProfile(username: string): Promise<Result> {
  try {
    return { ok: true, profile: await getLeetCodeProfile(username) };
  } catch (error) {
    if (isLeetCodeError(error)) return { ok: false, error };
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/u/[username]">): Promise<Metadata> {
  const username = safeDecode((await params).username);
  const result = await loadProfile(username);
  if (!result.ok) return { title: username, robots: { index: false } };
  const { profile } = result;
  return {
    title: `${profile.realName ?? profile.username} (@${profile.username})`,
    description: `${profile.username} has solved ${profile.solved.all} LeetCode problems — ${profile.solved.easy} easy, ${profile.solved.medium} medium, ${profile.solved.hard} hard.`,
  };
}

export default async function ProfilePage({ params }: PageProps<"/u/[username]">) {
  const username = safeDecode((await params).username);
  const result = await loadProfile(username);

  if (!result.ok) {
    if (result.error.code !== "USER_NOT_FOUND" && result.error.code !== "INVALID_USERNAME") {
      console.error(`[leetstats] ${username}:`, result.error.code, result.error.cause ?? "");
    }
    return <ProfileError code={result.error.code} message={result.error.message} username={username} />;
  }
  return <Dashboard profile={result.profile} />;
}
