/**
 * URL Import API Route
 *
 * Server-side endpoint for importing projects from URLs.
 * Prevents Octokit and other services from running in the browser.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { githubImportService } from "@/services/githubImportService";
import type { UnifiedImportResult } from "@/services/urlAnalyzerService";
import { webScraperService } from "@/services/webScraperService";

interface RequestBody {
  url: string;
  githubAccessToken?: string;
}

type URLType = "github" | "website" | "unknown";

/**
 * Detect URL type
 */
function detectURLType(url: string): URLType {
  if (url.includes("github.com")) {
    return "github";
  }
  return "website";
}

/**
 * POST /api/import/url
 * Import project data from a URL
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const raw: unknown = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const body = raw as Partial<RequestBody>;

    // Validate URL
    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const urlType = detectURLType(body.url);

    // Route to appropriate service
    if (urlType === "github") {
      const githubResult = await githubImportService.importFromGitHub(
        body.url,
        body.githubAccessToken,
      );

      const result: UnifiedImportResult = {
        projectName: githubResult.projectName,
        oneLiner: githubResult.oneLiner,
        description: githubResult.description,
        stage: githubResult.stage,
        tags: githubResult.tags,
        bmcData: githubResult.bmcData,
        embeds: githubResult.embeds,
        githubStats: githubResult.githubStats,
        sourceURL: body.url,
        sourceType: "github",
        confidence: githubResult.confidence,
        warnings: githubResult.warnings,
      };

      return NextResponse.json(result);
    }

    // Website import
    const websiteResult = await webScraperService.importFromWebsite(body.url);

    const result: UnifiedImportResult = {
      projectName: websiteResult.projectName,
      oneLiner: websiteResult.oneLiner,
      description: websiteResult.description,
      stage: "building", // Default stage for websites
      tags: websiteResult.tags,
      bmcData: websiteResult.bmcData,
      embeds: {
        website: body.url,
        demo: body.url,
      },
      screenshot: websiteResult.screenshot,
      sourceURL: body.url,
      sourceType: "website",
      confidence: websiteResult.confidence,
      warnings: websiteResult.warnings,
      techStack: websiteResult.techStack,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("URL import error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to import from URL";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/import/url
 * Health check
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    supports: ["github", "website"],
  });
}
