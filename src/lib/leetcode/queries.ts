/**
 * GraphQL queries against leetcode.com/graphql — the same endpoint the
 * LeetCode web app uses. It is public but undocumented, so each query is
 * kept small and focused: if LeetCode changes one field, only that
 * section of the dashboard degrades instead of the whole page.
 */

export const PROFILE_QUERY = /* GraphQL */ `
  query userProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
        reputation
        countryName
        company
        school
        aboutMe
        skillTags
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
      }
    }
  }
`;

export const CALENDAR_QUERY = /* GraphQL */ `
  query userCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

export const SKILLS_QUERY = /* GraphQL */ `
  query userSkills($username: String!) {
    matchedUser(username: $username) {
      languageProblemCount {
        languageName
        problemsSolved
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`;

export const CONTEST_QUERY = /* GraphQL */ `
  query userContest($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      problemsSolved
      totalProblems
      finishTimeInSeconds
      trendDirection
      contest {
        title
        startTime
      }
    }
  }
`;

export const RECENT_AC_QUERY = /* GraphQL */ `
  query recentAc($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      lang
    }
  }
`;
