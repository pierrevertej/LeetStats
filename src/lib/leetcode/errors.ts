export type LeetCodeErrorCode =
  | "INVALID_USERNAME"
  | "USER_NOT_FOUND"
  | "RATE_LIMITED"
  | "UPSTREAM_UNAVAILABLE"
  | "UNEXPECTED_RESPONSE";

const DEFAULT_MESSAGES: Record<LeetCodeErrorCode, string> = {
  INVALID_USERNAME:
    "That doesn't look like a valid LeetCode username. Usernames use letters, numbers, dashes, underscores and dots.",
  USER_NOT_FOUND: "We couldn't find a LeetCode account with that username.",
  RATE_LIMITED:
    "LeetCode is rate-limiting requests right now. Give it a minute and try again.",
  UPSTREAM_UNAVAILABLE:
    "LeetCode didn't respond in time. It may be temporarily unavailable.",
  UNEXPECTED_RESPONSE:
    "LeetCode returned data in a format we didn't expect. Their API may have changed.",
};

/** HTTP status we report to our own clients for each failure mode. */
export const ERROR_STATUS: Record<LeetCodeErrorCode, number> = {
  INVALID_USERNAME: 400,
  USER_NOT_FOUND: 404,
  RATE_LIMITED: 429,
  UPSTREAM_UNAVAILABLE: 502,
  UNEXPECTED_RESPONSE: 502,
};

export class LeetCodeError extends Error {
  readonly code: LeetCodeErrorCode;

  constructor(code: LeetCodeErrorCode, message?: string, options?: ErrorOptions) {
    super(message ?? DEFAULT_MESSAGES[code], options);
    this.name = "LeetCodeError";
    this.code = code;
  }
}

export function isLeetCodeError(error: unknown): error is LeetCodeError {
  return error instanceof LeetCodeError;
}
