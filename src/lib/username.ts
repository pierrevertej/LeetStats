/**
 * LeetCode usernames are alphanumeric with `-`, `_` and `.` allowed.
 * We stay a little permissive so we never reject a real account, but
 * block anything that clearly isn't a username (spaces, slashes, URLs…).
 */
const USERNAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,39}$/;

/**
 * Accepts raw user input: a bare username, `@username`, or a pasted
 * profile URL like `https://leetcode.com/u/username/`.
 */
export function normalizeUsername(input: string): string {
  let value = input.trim();
  const urlMatch = value.match(/leetcode\.com\/(?:u\/)?([^/?#\s]+)/i);
  if (urlMatch) value = urlMatch[1];
  return value.replace(/^@/, "").replace(/\/+$/, "");
}

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

/** Route params may arrive percent-encoded; never throw on malformed input. */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
