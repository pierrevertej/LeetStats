import "server-only";

import type { z } from "zod";

import { LeetCodeError } from "./errors";

const ENDPOINT = "https://leetcode.com/graphql";
const TIMEOUT_MS = 10_000;
/** Public profile data changes slowly; cache upstream responses briefly. */
const REVALIDATE_SECONDS = 600;

interface GraphQLError {
  message: string;
}

interface GraphQLEnvelope {
  data?: unknown;
  errors?: GraphQLError[];
}

/**
 * POSTs a GraphQL query to LeetCode, validates the `data` payload against
 * `schema`, and maps transport/upstream failures to typed LeetCodeErrors.
 */
export async function queryLeetCode<S extends z.ZodType>(
  query: string,
  variables: Record<string, unknown>,
  schema: S,
): Promise<z.infer<S>> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "LeetStats/1.0 (+public profile analytics)",
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (cause) {
    throw new LeetCodeError("UPSTREAM_UNAVAILABLE", undefined, { cause });
  }

  if (response.status === 429) throw new LeetCodeError("RATE_LIMITED");
  if (!response.ok) {
    throw new LeetCodeError(
      "UPSTREAM_UNAVAILABLE",
      `LeetCode responded with HTTP ${response.status}.`,
    );
  }

  let envelope: GraphQLEnvelope;
  try {
    envelope = (await response.json()) as GraphQLEnvelope;
  } catch (cause) {
    throw new LeetCodeError("UNEXPECTED_RESPONSE", undefined, { cause });
  }

  if (envelope.errors?.some((e) => /user does not exist/i.test(e.message))) {
    throw new LeetCodeError("USER_NOT_FOUND");
  }

  const parsed = schema.safeParse(envelope.data);
  if (!parsed.success) {
    throw new LeetCodeError("UNEXPECTED_RESPONSE", undefined, {
      cause: parsed.error,
    });
  }
  return parsed.data;
}
