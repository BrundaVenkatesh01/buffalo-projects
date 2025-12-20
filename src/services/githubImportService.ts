/**
 * GitHub Import Service
 *
 * Imports project data from GitHub repositories and user profiles.
 * Supports single repo import and bulk profile import.
 */

import { Octokit } from "@octokit/rest";

import { geminiService } from "./geminiService";

import type { CanvasState } from "@/types";

// Default unauthenticated GitHub API client (60 req/hour)
const octokit = new Octokit();

/**
 * Create authenticated Octokit instance with access token
 * Rate limit: 5,000 req/hour (vs 60 unauthenticated)
 */
function getAuthenticatedOctokit(accessToken: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

function getErrorStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }
  return null;
}

function getErrorMessage(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return null;
}

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  license: string | null;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  readme: string | null;
  openIssues: number;
}

export interface GitHubImportResult {
  projectName: string;
  oneLiner?: string;
  description: string;
  stage:
    | "idea"
    | "research"
    | "planning"
    | "building"
    | "testing"
    | "launching"
    | "scaling";
  tags: string[];
  bmcData: Partial<CanvasState>;
  githubStats: {
    stars: number;
    forks: number;
    contributors: number;
    issues?: number;
    language?: string;
    topics?: string[];
    license?: string;
    lastCommit?: string;
  };
  embeds: {
    github: {
      repoUrl: string;
      readmeUrl?: string;
    };
    website?: string;
    demo?: string;
  };
  confidence: number; // 0-1 extraction quality
  warnings: string[];
}

/**
 * Parse GitHub URL to extract owner and repo name
 */
function parseGitHubURL(url: string): { owner: string; repo: string } | null {
  // Supports: https://github.com/owner/repo
  // or just: owner/repo
  const githubRegex = /(?:https?:\/\/github\.com\/)?([^/]+)\/([^/?#]+)/;
  const match = url.match(githubRegex);

  if (!match) {
    return null;
  }

  return {
    owner: match[1]!,
    repo: match[2]!.replace(/\.git$/, ""), // Remove .git suffix if present
  };
}

/**
 * Fetch repository data from GitHub API with retry logic
 * @param urlOrPath - GitHub repository URL or owner/repo
 * @param accessToken - Optional GitHub access token for authenticated requests (5,000 req/hr vs 60)
 */
export async function fetchGitHubRepo(
  urlOrPath: string,
  accessToken?: string,
): Promise<GitHubRepo | null> {
  const parsed = parseGitHubURL(urlOrPath);
  if (!parsed) {
    throw new Error("Invalid GitHub URL format");
  }

  // Use authenticated client if token provided
  const client = accessToken ? getAuthenticatedOctokit(accessToken) : octokit;

  // Retry logic for transient errors
  const maxRetries = 2;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Fetch repo metadata using appropriate client
      const { data: repo } = await client.repos.get({
        owner: parsed.owner,
        repo: parsed.repo,
      });

      // Fetch README using appropriate client
      let readme: string | null = null;
      try {
        const { data: readmeData } = await client.repos.getReadme({
          owner: parsed.owner,
          repo: parsed.repo,
          mediaType: { format: "raw" },
        });
        readme = readmeData as unknown as string; // Raw format returns string
      } catch {
        console.warn("README not found for repo:", parsed.repo);
      }

      return {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        license: repo.license?.name || null,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        archived: repo.archived,
        readme,
        openIssues: repo.open_issues_count,
      };
    } catch (error: unknown) {
      lastError = error;
      const status = getErrorStatus(error);
      const message = getErrorMessage(error);

      // Log full error details for debugging
      console.error(
        `GitHub API error (attempt ${attempt + 1}/${maxRetries + 1}):`,
        {
          owner: parsed.owner,
          repo: parsed.repo,
          status,
          message,
          error:
            error instanceof Error
              ? { name: error.name, message: error.message, stack: error.stack }
              : error,
        },
      );

      // Don't retry 404s or client errors (4xx)
      if (status === 404) {
        throw new Error(
          "Repository not found. Make sure the URL is correct and the repo is public.",
        );
      }

      if (status && status >= 400 && status < 500) {
        throw new Error(
          `Failed to fetch GitHub repo: ${message ?? "Unknown error"}`,
        );
      }

      // Retry on server errors (5xx) or network errors
      if (attempt < maxRetries && (!status || status >= 500)) {
        console.warn(
          `Retrying GitHub request in ${500 * Math.pow(2, attempt)}ms...`,
        );
        // Exponential backoff: 500ms, 1000ms
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * Math.pow(2, attempt)),
        );
        continue;
      }

      // Final attempt failed
      break;
    }
  }

  // All retries exhausted
  const message = getErrorMessage(lastError) ?? "Unknown error";
  throw new Error(
    `GitHub API temporarily unavailable. Please try again in a moment. (${message})`,
  );
}

/**
 * Extract BMC fields from README using AI
 */
async function extractBMCFromREADME(
  readme: string,
  repoData: GitHubRepo,
): Promise<Partial<CanvasState>> {
  // Truncate description and README to ensure total prompt stays under 5000 chars
  const truncatedDescription = repoData.description
    ? repoData.description.substring(0, 300)
    : "";
  const truncatedReadme = readme.substring(0, 1500);

  const prompt = `Extract Business Model Canvas from GitHub project. Adapt BMC for technical projects.

Project: ${repoData.name}
Description: ${truncatedDescription}
Language: ${repoData.language || ""}
Stars: ${repoData.stars || 0}

README (excerpt):
${truncatedReadme}

For each BMC field, provide specific insights (not generic):
1. **valuePropositions**: Core problem solved, unique benefits vs alternatives
2. **customerSegments**: Target users (developers/companies/enterprises)
3. **channels**: Discovery methods (GitHub, package managers, docs, communities)
4. **customerRelationships**: User engagement (Issues, Discord, support, releases)
5. **revenueStreams**: Monetization or sustainability (open-source, sponsors, paid tiers)
6. **keyResources**: Technologies, dependencies, infrastructure
7. **keyActivities**: Core functionality, development focus
8. **keyPartners**: Integrations, sponsors, ecosystem partners
9. **costStructure**: Infrastructure and operational costs

Return ONLY valid JSON (no markdown fences):
{
  "valuePropositions": "...",
  "customerSegments": "...",
  "channels": "...",
  "customerRelationships": "...",
  "revenueStreams": "...",
  "keyResources": "...",
  "keyActivities": "...",
  "keyPartners": "...",
  "costStructure": "..."
}

Be specific. Infer what's not explicit. Each field needs real content, not placeholders.`;

  try {
    const geminiResponse = await geminiService.generateContent(prompt);

    // Parse JSON from response (handle potential markdown code fences)
    let jsonText = geminiResponse.text.trim();

    // Remove markdown code fences if present
    jsonText = jsonText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse BMC JSON from Gemini response");
      return {};
    }

    const parsedJson = jsonMatch[0];
    const parsed: unknown = JSON.parse(parsedJson);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    return parsed as Partial<CanvasState>;
  } catch (error) {
    console.error("Failed to extract BMC from README:", error);
    return {};
  }
}

/**
 * Determine project stage based on repo data
 */
function determineStage(
  repo: GitHubRepo,
):
  | "idea"
  | "research"
  | "planning"
  | "building"
  | "testing"
  | "launching"
  | "scaling" {
  if (repo.archived) {
    return "launching";
  } // Archived = completed/launched

  const daysSinceUpdate =
    (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24);

  if (repo.stars > 100 || repo.forks > 20) {
    return "scaling";
  } // Popular project
  if (repo.stars > 10 || repo.forks > 5) {
    return "launching";
  } // Some traction
  if (repo.openIssues > 5) {
    return "testing";
  } // Active development
  if (daysSinceUpdate < 30) {
    return "building";
  } // Recently updated
  if (daysSinceUpdate < 90) {
    return "testing";
  } // Less active

  return "building"; // Default
}

/**
 * Import a single GitHub repository as a workspace
 * @param urlOrPath - GitHub repository URL or owner/repo
 * @param accessToken - Optional GitHub access token for authenticated requests
 */
export async function importFromGitHub(
  urlOrPath: string,
  accessToken?: string,
): Promise<GitHubImportResult> {
  const repo = await fetchGitHubRepo(urlOrPath, accessToken);

  if (!repo) {
    throw new Error("Failed to fetch repository data");
  }

  // Extract BMC from README if available
  let bmcData: Partial<CanvasState> = {};
  let confidence = 0.5; // Default baseline confidence

  if (repo.readme && repo.readme.length > 100) {
    bmcData = await extractBMCFromREADME(repo.readme, repo);
  }

  // Calculate confidence based on multiple factors
  let confidenceScore = 0.5; // Base confidence

  // Factor 1: Basic data quality (30% weight)
  if (repo.description && repo.description.length > 20) {
    confidenceScore += 0.15;
  }
  if (repo.readme && repo.readme.length > 500) {
    confidenceScore += 0.15;
  }

  // Factor 2: BMC extraction quality (40% weight)
  const filledBMCFields = Object.values(bmcData).filter(
    (v) => v && String(v).trim().length > 10,
  ).length;
  confidenceScore += (filledBMCFields / 9) * 0.4;

  // Factor 3: Project maturity (10% weight)
  if (repo.stars > 50 || repo.forks > 10) {
    confidenceScore += 0.1;
  }

  // Factor 4: Recent activity (10% weight)
  const daysSinceUpdate =
    (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 90) {
    confidenceScore += 0.1;
  }

  // Factor 5: Homepage/documentation (10% weight)
  if (repo.homepage) {
    confidenceScore += 0.1;
  }

  confidence = Math.min(0.95, Math.max(0.3, confidenceScore));

  // Build tags from language, topics, and inferred categories
  const tags = [
    ...(repo.language ? [repo.language] : []),
    ...repo.topics.slice(0, 5), // Limit to 5 topics
    "open-source",
  ].filter(Boolean);

  // Determine stage
  const stage = determineStage(repo);

  // Build warnings
  const warnings: string[] = [];
  if (!repo.description) {
    warnings.push("No repository description found");
  }
  if (!repo.readme) {
    warnings.push("No README found - BMC extraction limited");
  }
  if (repo.archived) {
    warnings.push("Repository is archived");
  }
  if (Object.keys(bmcData).length === 0) {
    warnings.push("Could not extract BMC fields automatically");
  }

  return {
    projectName: repo.name,
    oneLiner: repo.description || `Open source ${repo.language || "project"}`,
    description: repo.readme?.slice(0, 500) || repo.description || "",
    stage,
    tags,
    bmcData,
    githubStats: {
      stars: repo.stars,
      forks: repo.forks,
      contributors: 1, // Would need additional API call to get accurate count
      issues: repo.openIssues,
      language: repo.language || undefined,
      topics: repo.topics,
      license: repo.license || undefined,
      lastCommit: repo.updatedAt,
    },
    embeds: {
      github: {
        repoUrl: repo.url,
        readmeUrl: repo.readme ? `${repo.url}#readme` : undefined,
      },
      website: repo.homepage || undefined,
      demo: repo.homepage || undefined, // Use homepage as demo if available
    },
    confidence,
    warnings,
  };
}

/**
 * Fetch all public repositories for a GitHub user
 */
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username,
      type: "owner", // Only repos owned by user, not forks
      sort: "updated",
      per_page: 100, // Max repos to fetch
    });

    // Convert to our GitHubRepo format
    return repos
      .filter((repo) => !repo.fork) // Exclude forks
      .map((repo) => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage || null,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        language: repo.language || null,
        topics: repo.topics || [],
        license: repo.license?.name || null,
        createdAt: repo.created_at || new Date().toISOString(),
        updatedAt: repo.updated_at || new Date().toISOString(),
        archived: repo.archived ?? false,
        readme: null, // README not fetched in list view (too expensive)
        openIssues: repo.open_issues_count ?? 0,
      }));
  } catch (error: unknown) {
    if (getErrorStatus(error) === 404) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    const message = getErrorMessage(error) ?? "Unknown error";
    throw new Error(`Failed to fetch user repositories: ${message}`);
  }
}

/**
 * Import multiple repositories in batch
 * (READMEs fetched on-demand to avoid rate limits)
 */
export async function importMultipleRepos(
  repoURLs: string[],
  onProgress?: (current: number, total: number, repo: string) => void,
): Promise<GitHubImportResult[]> {
  const results: GitHubImportResult[] = [];

  for (let i = 0; i < repoURLs.length; i++) {
    const url = repoURLs[i]!;
    if (onProgress) {
      onProgress(i + 1, repoURLs.length, url);
    }

    try {
      const result = await importFromGitHub(url);
      results.push(result);
    } catch (error: unknown) {
      console.error(`Failed to import ${url}:`, error);
      // Continue with next repo instead of failing entire batch
    }

    // Rate limiting: Wait 500ms between requests
    if (i < repoURLs.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

export const githubImportService = {
  parseGitHubURL,
  fetchGitHubRepo,
  fetchUserRepos,
  importFromGitHub,
  importMultipleRepos,
};
