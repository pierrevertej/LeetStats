import type { NextRequest } from "next/server";

import { ERROR_STATUS, isLeetCodeError } from "@/lib/leetcode/errors";
import { getLeetCodeProfile } from "@/lib/leetcode/profile";
import { safeDecode } from "@/lib/username";

/** JSON access to the same normalized profile the dashboard renders. */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/profile/[username]">) {
  const { username } = await ctx.params;
  try {
    const profile = await getLeetCodeProfile(safeDecode(username));
    return Response.json(profile, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
    });
  } catch (error) {
    if (isLeetCodeError(error)) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: ERROR_STATUS[error.code] },
      );
    }
    console.error(error);
    return Response.json(
      { error: { code: "INTERNAL", message: "Unexpected server error." } },
      { status: 500 },
    );
  }
}
