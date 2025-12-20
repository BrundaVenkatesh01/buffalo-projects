/**
 * Matching Service - Peer-to-peer matching algorithm
 *
 * Connects builders by matching what they're asking for with what others offer.
 * Uses simple string matching on gives/asks arrays.
 */

import type { Workspace } from "@/types";

export interface Match {
  workspace: Workspace;
  matchScore: number;
  matchedGives: string[];
  matchType: "perfect" | "good" | "potential";
}

/**
 * Calculate matches between user's asks and project gives
 *
 * @param userAsks - What the user is looking for
 * @param allProjects - All available projects to match against
 * @returns Sorted array of matches (highest score first)
 */
export function calculateMatches(
  userAsks: string[],
  allProjects: Workspace[],
): Match[] {
  if (!userAsks || userAsks.length === 0) {
    return [];
  }

  // Normalize user asks (lowercase, trim)
  const normalizedAsks = userAsks.map((ask) => ask.toLowerCase().trim());

  // Calculate matches
  const matches = allProjects
    .map((workspace) => {
      // Skip projects without gives
      if (!workspace.gives || workspace.gives.length === 0) {
        return null;
      }

      // Find overlapping gives
      const matchedGives = workspace.gives.filter((give) =>
        normalizedAsks.some(
          (ask) => ask === give.toLowerCase().trim() || isFuzzyMatch(ask, give),
        ),
      );

      if (matchedGives.length === 0) {
        return null;
      }

      // Calculate match type
      const matchScore = matchedGives.length;
      const matchType: Match["matchType"] =
        matchScore >= 3 ? "perfect" : matchScore === 2 ? "good" : "potential";

      return {
        workspace,
        matchScore,
        matchedGives,
        matchType,
      };
    })
    .filter((match): match is Match => match !== null)
    .sort((a, b) => {
      // Sort by match score (descending), then by views (descending)
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return (b.workspace.views || 0) - (a.workspace.views || 0);
    });

  return matches;
}

/**
 * Calculate reverse matches - find users who are asking for what this project gives
 *
 * @param projectGives - What this project offers
 * @param allProjects - All projects (representing users)
 * @returns Projects whose asks match this project's gives
 */
export function calculateReverseMatches(
  projectGives: string[],
  allProjects: Workspace[],
): Match[] {
  if (!projectGives || projectGives.length === 0) {
    return [];
  }

  const normalizedGives = projectGives.map((give) => give.toLowerCase().trim());

  const matches = allProjects
    .map((workspace) => {
      if (!workspace.asks || workspace.asks.length === 0) {
        return null;
      }

      const matchedAsks = workspace.asks.filter((ask) =>
        normalizedGives.some(
          (give) =>
            give === ask.toLowerCase().trim() || isFuzzyMatch(give, ask),
        ),
      );

      if (matchedAsks.length === 0) {
        return null;
      }

      const matchScore = matchedAsks.length;
      const matchType: Match["matchType"] =
        matchScore >= 3 ? "perfect" : matchScore === 2 ? "good" : "potential";

      return {
        workspace,
        matchScore,
        matchedGives: matchedAsks, // In reverse match, we're matching asks
        matchType,
      };
    })
    .filter((match): match is Match => match !== null)
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

/**
 * Fuzzy string matching for similar but not identical strings
 * Examples:
 * - "design" matches "design help", "design feedback"
 * - "code review" matches "code-review", "code review"
 */
function isFuzzyMatch(str1: string, str2: string): boolean {
  const normalized1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalized2 = str2.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Check if one contains the other
  return (
    normalized1.includes(normalized2) ||
    normalized2.includes(normalized1) ||
    // Check for common variations
    areCommonVariations(str1, str2)
  );
}

/**
 * Check for common variations of the same concept
 */
function areCommonVariations(str1: string, str2: string): boolean {
  const variations: Record<string, string[]> = {
    feedback: ["feedback", "critique", "review", "input"],
    design: ["design", "designer", "designing", "ui", "ux"],
    code: ["code", "coding", "developer", "programming"],
    mentor: ["mentor", "mentorship", "coaching", "guidance"],
    funding: ["funding", "investment", "capital", "money"],
    cofounder: ["co-founder", "cofounder", "partner", "founding team"],
  };

  const lower1 = str1.toLowerCase();
  const lower2 = str2.toLowerCase();

  // Check if both strings appear in the same variation group
  for (const variants of Object.values(variations)) {
    const has1 = variants.some((v) => lower1.includes(v));
    const has2 = variants.some((v) => lower2.includes(v));
    if (has1 && has2) {
      return true;
    }
  }

  return false;
}

/**
 * Get match quality description
 */
export function getMatchDescription(match: Match): string {
  const { matchType, matchedGives } = match;

  if (matchType === "perfect") {
    return `Perfect match! This project offers ${matchedGives.slice(0, 3).join(", ")}${matchedGives.length > 3 ? ` and ${matchedGives.length - 3} more` : ""}.`;
  }

  if (matchType === "good") {
    return `Good match. They can help with ${matchedGives.join(" and ")}.`;
  }

  return `Potential match for ${matchedGives[0]}.`;
}

/**
 * Filter matches by minimum score threshold
 */
export function filterMatchesByScore(
  matches: Match[],
  minScore: number = 1,
): Match[] {
  return matches.filter((match) => match.matchScore >= minScore);
}

/**
 * Get top N matches
 */
export function getTopMatches(matches: Match[], count: number = 5): Match[] {
  return matches.slice(0, count);
}
