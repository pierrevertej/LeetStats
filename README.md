# LeetStats

Platform to read useful stats on your LeetCoding journey. Enter any LeetCode username and get a dashboard of the profile's public data: solves by difficulty, acceptance rate, rankings, a year-long activity heatmap, contest rating history, languages, topics and recent accepted submissions.

## Stack

- **Next.js 16** (App Router, React 19, Server Components) + **TypeScript**
- **Tailwind CSS v4** for styling (design tokens in `src/app/globals.css`)
- **Recharts** for the donut, rating and weekday charts; the heatmap and ranked bars are hand-built SVG/HTML
- **zod** for runtime validation of upstream responses

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
```

## Data source

LeetCode has **no official public API**. Findings when this was built (Oct 2026):

| Option | Status |
| --- | --- |
| `leetcode.com/graphql` (used by LeetCode's own web app) | ✅ Works for anonymous server-side requests; returns all public profile fields |
| Scraping `leetcode.com/u/<user>` HTML | ❌ Blocked by Cloudflare (HTTP 403) |
| `leetcode-stats-api.herokuapp.com` | ❌ Dead (HTTP 503) |
| `alfa-leetcode-api.onrender.com` | ⚠️ Works, but is a third-party proxy over the same GraphQL on a free host |

LeetStats queries the GraphQL endpoint directly **from the server only**. Because the endpoint is undocumented, the data layer is defensive:

- Responses are validated with zod, so schema drift surfaces as a clear `UNEXPECTED_RESPONSE` error rather than broken UI.
- Data is split into small queries (profile, calendar, skills, contests, recent). Only the core profile query is required. The others may fail independently, and their card shows "Couldn't load…" while the rest of the dashboard still renders.
- Requests time out after 10s, and successful responses are cached for 10 minutes (Next.js data cache) to stay a polite client.
- Failures map to typed errors (`USER_NOT_FOUND`, `INVALID_USERNAME`, `RATE_LIMITED`, `UPSTREAM_UNAVAILABLE`, `UNEXPECTED_RESPONSE`), each with its own UI state and HTTP status.

## Architecture

```
src/
  app/
    page.tsx                     Homepage (hero, search, preview)
    u/[username]/page.tsx        Dashboard (server component)
    u/[username]/loading.tsx     Skeleton while LeetCode is queried
    u/[username]/error.tsx       Boundary for unexpected errors
    api/profile/[username]/      JSON endpoint returning the normalized profile
  lib/
    leetcode/                    Server-only data layer
      client.ts                  GraphQL fetch, timeout, caching, error mapping
      queries.ts / schemas.ts    Queries and their zod schemas
      profile.ts                 Parallel fetch + normalization → LeetCodeProfile
      types.ts / errors.ts
    stats/compute.ts             Pure derived stats (acceptance, streaks, heatmap grid, contest summary)
    username.ts                  Input normalization (accepts @handle or profile URLs) + validation
  components/
    dashboard/                   Dashboard sections and charts
    home/                        Homepage preview
    ui/                          Card, EmptyState, Skeleton
```

Expected failures (unknown user, LeetCode down) are returned as values and rendered inline with a specific message. Thrown errors are reserved for bugs.

Activity dates are in UTC, matching how LeetCode buckets its submission calendar.
