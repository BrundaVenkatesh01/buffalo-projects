/**
 * URL Analyzer Service
 *
 * Unified entry point for importing projects from URLs.
 * Detects URL type and routes to appropriate import service.
 */

import {
  githubImportService,
  type GitHubImportResult,
} from "./githubImportService";
import {
  webScraperService,
  type WebsiteImportResult,
} from "./webScraperService";

import type { CanvasState } from "@/types";

export type URLType =
  | "github"
  | "website"
  | "product-hunt"
  | "portfolio"
  | "file"
  | "unknown";

export interface UnifiedImportResult {
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

  // URLs & Links
  embeds?: {
    github?: {
      repoUrl: string;
      readmeUrl?: string;
    };
    website?: string;
    demo?: string;
  };

  // Stats (GitHub-specific)
  githubStats?: {
    stars: number;
    forks: number;
    contributors: number;
    issues?: number;
    language?: string;
    topics?: string[];
    license?: string;
    lastCommit?: string;
  };

  // Metadata
  sourceURL: string;
  sourceType: URLType;
  screenshot?: string;
  confidence: number;
  warnings: string[];

  // Tech stack (website-specific)
  techStack?: {
    frameworks: string[];
    libraries: string[];
    platforms: string[];
    languages: string[];
  };
}

/**
 * Normalize URL by adding https:// if missing
 */
export function normalizeURL(url: string): string {
  const trimmed = url.trim();

  // Already has protocol
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Add https:// prefix
  return `https://${trimmed}`;
}

/**
 * Detect the type of URL
 */
export function detectURLType(url: string): URLType {
  try {
    // Normalize URL first (add https:// if missing)
    const normalized = normalizeURL(url);
    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();

    // GitHub
    if (hostname.includes("github.com")) {
      return "github";
    }

    // Product Hunt
    if (hostname.includes("producthunt.com")) {
      return "product-hunt";
    }

    // Behance/Dribbble (portfolio sites)
    if (hostname.includes("behance.net") || hostname.includes("dribbble.com")) {
      return "portfolio";
    }

    // Default to website
    return "website";
  } catch {
    return "unknown";
  }
}

/**
 * Convert GitHub import result to unified format
 */
function convertGitHubResult(
  result: GitHubImportResult,
  url: string,
): UnifiedImportResult {
  return {
    projectName: result.projectName,
    oneLiner: result.oneLiner,
    description: result.description,
    stage: result.stage,
    tags: result.tags,
    bmcData: result.bmcData,
    embeds: result.embeds,
    githubStats: result.githubStats,
    sourceURL: url,
    sourceType: "github",
    confidence: result.confidence,
    warnings: result.warnings,
  };
}

/**
 * Convert website import result to unified format
 */
function convertWebsiteResult(
  result: WebsiteImportResult,
  url: string,
): UnifiedImportResult {
  return {
    projectName: result.projectName,
    oneLiner: result.oneLiner,
    description: result.description,
    stage: "building", // Default stage for websites
    tags: result.tags,
    bmcData: result.bmcData,
    embeds: {
      website: url,
      demo: url,
    },
    sourceURL: url,
    sourceType: "website",
    screenshot: result.screenshot,
    confidence: result.confidence,
    warnings: result.warnings,
    techStack: result.techStack,
  };
}

/**
 * Import project from any URL
 * Routes to server-side API to prevent browser-side Octokit issues
 * @param url - URL to import from
 * @param githubAccessToken - Optional GitHub access token for authenticated requests (5K req/hr vs 60)
 */
export async function importFromURL(
  url: string,
  githubAccessToken?: string,
): Promise<UnifiedImportResult> {
  // Call server-side API instead of running Octokit in the browser
  const response = await fetch("/api/import/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      githubAccessToken,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string };
    throw new Error(errorData.error || "Failed to import from URL");
  }

  return (await response.json()) as UnifiedImportResult;
}

/**
 * DEPRECATED: Direct import (kept for server-side use only)
 * Import project from any URL using direct service calls
 * @deprecated Use importFromURL instead (calls server-side API)
 */
export async function importFromURLDirect(
  url: string,
  githubAccessToken?: string,
): Promise<UnifiedImportResult> {
  const urlType = detectURLType(url);

  switch (urlType) {
    case "github": {
      const result = await githubImportService.importFromGitHub(
        url,
        githubAccessToken,
      );
      return convertGitHubResult(result, url);
    }

    case "website": {
      const result = await webScraperService.importFromWebsite(url);
      return convertWebsiteResult(result, url);
    }

    case "product-hunt":
      // TODO: Implement Product Hunt scraper
      throw new Error(
        "Product Hunt import coming soon! For now, paste your project's website URL.",
      );

    case "portfolio":
      // TODO: Implement portfolio site scraper
      throw new Error(
        "Portfolio site import coming soon! For now, paste your project URLs one at a time.",
      );

    case "unknown":
    default:
      throw new Error(
        "Could not recognize URL type. Please provide a valid GitHub repo or website URL.",
      );
  }
}

/**
 * Import multiple URLs in batch
 * @param githubAccessToken - Optional GitHub access token for authenticated requests
 */
export async function importMultipleURLs(
  urls: string[],
  onProgress?: (
    current: number,
    total: number,
    url: string,
    status: "success" | "error",
  ) => void,
  githubAccessToken?: string,
): Promise<{
  successful: UnifiedImportResult[];
  failed: { url: string; error: string }[];
}> {
  const successful: UnifiedImportResult[] = [];
  const failed: { url: string; error: string }[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!.trim();
    if (!url) {
      continue;
    } // Skip empty lines

    try {
      if (onProgress) {
        onProgress(i + 1, urls.length, url, "success");
      }

      const result = await importFromURL(url, githubAccessToken);
      successful.push(result);

      if (onProgress) {
        onProgress(i + 1, urls.length, url, "success");
      }
    } catch (error: unknown) {
      console.error(`Failed to import ${url}:`, error);
      const message = error instanceof Error ? error.message : "Unknown error";
      failed.push({ url, error: message });

      if (onProgress) {
        onProgress(i + 1, urls.length, url, "error");
      }
    }

    // Rate limiting: Wait 600ms between requests
    if (i < urls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  return { successful, failed };
}

/**
 * Parse and clean a list of URLs from text (one per line)
 */
export function parseURLList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) {
        return false;
      } // Skip empty lines
      if (line.startsWith("#") || line.startsWith("//")) {
        return false;
      } // Skip comments

      try {
        new URL(line);
        return true;
      } catch {
        return false; // Skip invalid URLs
      }
    });
}

/**
 * Validate a single URL
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Get human-readable URL type label
 */
export function getURLTypeLabel(type: URLType): string {
  switch (type) {
    case "github":
      return "GitHub Repository";
    case "website":
      return "Website";
    case "product-hunt":
      return "Product Hunt";
    case "portfolio":
      return "Portfolio Site";
    default:
      return "Unknown";
  }
}

/**
 * Get icon name for URL type (for UI)
 */
export function getURLTypeIcon(type: URLType): string {
  switch (type) {
    case "github":
      return "github"; // Use lucide-react github icon
    case "website":
      return "globe"; // Use lucide-react globe icon
    case "product-hunt":
      return "rocket"; // Use lucide-react rocket icon
    case "portfolio":
      return "briefcase"; // Use lucide-react briefcase icon
    default:
      return "link"; // Use lucide-react link icon
  }
}

export const urlAnalyzerService = {
  detectURLType,
  importFromURL,
  importMultipleURLs,
  parseURLList,
  normalizeURL,
  isValidURL,
  getURLTypeLabel,
  getURLTypeIcon,
};
