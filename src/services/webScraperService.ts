/**
 * Web Scraper Service
 *
 * Scrapes and analyzes live websites to extract project information.
 * Supports metadata extraction, content analysis, and tech stack detection.
 */

import * as cheerio from "cheerio";

import { geminiService } from "./geminiService";

import type { CanvasState } from "@/types";

export interface WebsiteMetadata {
  title: string;
  description?: string;
  image?: string;
  keywords?: string[];
  url: string;
  favicon?: string;
  author?: string;
}

export interface ScrapedContent {
  headings: string[];
  paragraphs: string[];
  links: { text: string; href: string }[];
  images: { src: string; alt: string }[];
}

export interface TechStackInfo {
  frameworks: string[];
  libraries: string[];
  platforms: string[];
  languages: string[];
}

export interface WebsiteImportResult {
  projectName: string;
  oneLiner?: string;
  description: string;
  tags: string[];
  bmcData: Partial<CanvasState>;
  metadata: WebsiteMetadata;
  techStack: TechStackInfo;
  screenshot?: string;
  confidence: number;
  warnings: string[];
}

/**
 * Fetch HTML content from URL
 */
async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BuffaloProjects/1.0; +https://buffaloprojects.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch website: ${message}`);
  }
}

/**
 * Extract metadata from HTML
 */
function extractMetadata(html: string, url: string): WebsiteMetadata {
  const $ = cheerio.load(html);

  // Extract Open Graph / Twitter Card metadata
  const getMetaContent = (selectors: string[]): string | undefined => {
    for (const selector of selectors) {
      const content = $(selector).attr("content");
      if (content) {
        return content;
      }
    }
    return undefined;
  };

  const title =
    getMetaContent([
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) ||
    $("title").text() ||
    $("h1").first().text() ||
    "Untitled Project";

  const description =
    getMetaContent([
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]) || $('meta[name="description"]').attr("content");

  const image =
    getMetaContent([
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) || $("img").first().attr("src");

  const keywords = $('meta[name="keywords"]')
    .attr("content")
    ?.split(",")
    .map((k) => k.trim());

  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    "/favicon.ico";

  const author = getMetaContent([
    'meta[name="author"]',
    'meta[property="article:author"]',
  ]);

  return {
    title: title.trim(),
    description,
    image,
    keywords,
    url,
    favicon,
    author,
  };
}

/**
 * Extract main content from HTML
 */
function extractContent(html: string): ScrapedContent {
  const $ = cheerio.load(html);

  // Remove script, style, nav, footer, header
  $("script, style, nav, footer, header, aside").remove();

  // Extract headings
  const headings: string[] = [];
  $("h1, h2, h3").each((_i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 0 && text.length < 200) {
      headings.push(text);
    }
  });

  // Extract paragraphs
  const paragraphs: string[] = [];
  $("p").each((_i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20 && text.length < 500) {
      paragraphs.push(text);
    }
  });

  // Extract links
  const links: { text: string; href: string }[] = [];
  $("a[href]").each((_i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");
    if (text && href && href.startsWith("http")) {
      links.push({ text, href });
    }
  });

  // Extract images
  const images: { src: string; alt: string }[] = [];
  $("img[src]").each((_i, el) => {
    const src = $(el).attr("src");
    const alt = $(el).attr("alt") || "";
    if (src && src.startsWith("http")) {
      images.push({ src, alt });
    }
  });

  return {
    headings: headings.slice(0, 10), // Limit to top 10
    paragraphs: paragraphs.slice(0, 15), // Limit to top 15
    links: links.slice(0, 20),
    images: images.slice(0, 10),
  };
}

/**
 * Detect tech stack from HTML
 */
function detectTechStack(html: string): TechStackInfo {
  const frameworks: Set<string> = new Set();
  const libraries: Set<string> = new Set();
  const platforms: Set<string> = new Set();
  const languages: Set<string> = new Set();

  const htmlLower = html.toLowerCase();

  // Detect frameworks
  if (htmlLower.includes("next.js") || htmlLower.includes("_next")) {
    frameworks.add("Next.js");
  }
  if (htmlLower.includes("react")) {
    frameworks.add("React");
  }
  if (htmlLower.includes("vue.js") || htmlLower.includes("vue")) {
    frameworks.add("Vue.js");
  }
  if (htmlLower.includes("angular")) {
    frameworks.add("Angular");
  }
  if (htmlLower.includes("svelte")) {
    frameworks.add("Svelte");
  }
  if (htmlLower.includes("gatsby")) {
    frameworks.add("Gatsby");
  }
  if (htmlLower.includes("nuxt")) {
    frameworks.add("Nuxt.js");
  }
  if (htmlLower.includes("remix")) {
    frameworks.add("Remix");
  }

  // Detect libraries
  if (htmlLower.includes("tailwind")) {
    libraries.add("Tailwind CSS");
  }
  if (htmlLower.includes("bootstrap")) {
    libraries.add("Bootstrap");
  }
  if (htmlLower.includes("jquery")) {
    libraries.add("jQuery");
  }
  if (htmlLower.includes("framer")) {
    libraries.add("Framer Motion");
  }
  if (htmlLower.includes("gsap")) {
    libraries.add("GSAP");
  }

  // Detect platforms/hosting
  if (htmlLower.includes("vercel")) {
    platforms.add("Vercel");
  }
  if (htmlLower.includes("netlify")) {
    platforms.add("Netlify");
  }
  if (htmlLower.includes("cloudflare")) {
    platforms.add("Cloudflare");
  }
  if (htmlLower.includes("github pages")) {
    platforms.add("GitHub Pages");
  }
  if (htmlLower.includes("firebase")) {
    platforms.add("Firebase");
  }
  if (htmlLower.includes("supabase")) {
    platforms.add("Supabase");
  }
  if (htmlLower.includes("aws")) {
    platforms.add("AWS");
  }

  // Detect languages (always include these)
  languages.add("JavaScript");
  if (htmlLower.includes("typescript")) {
    languages.add("TypeScript");
  }

  return {
    frameworks: Array.from(frameworks),
    libraries: Array.from(libraries),
    platforms: Array.from(platforms),
    languages: Array.from(languages),
  };
}

/**
 * Extract BMC fields using AI analysis
 */
async function extractBMCFromWebsite(
  metadata: WebsiteMetadata,
  content: ScrapedContent,
  techStack: TechStackInfo,
): Promise<Partial<CanvasState>> {
  const prompt = `Extract Business Model Canvas information for the BUSINESS, not the website content.

Website: ${metadata.title}
URL: ${metadata.url}
Description: ${metadata.description || "No description"}
Tech Stack: ${[...techStack.frameworks, ...techStack.platforms].join(", ")}

Sample Content:
${content.headings.slice(0, 3).join(", ")}
${content.paragraphs.slice(0, 2).join(" ")}

CRITICAL - Extract BUSINESS MODEL, NOT CONTENT:
- Describe what the BUSINESS/PRODUCT does, not current news/articles/posts
- For media sites (ESPN, CNN): Extract "Sports media providing live coverage, streaming" NOT "Team X beats Team Y"
- For blogs/news: Extract the business purpose, not individual articles
- Focus on the service/product offered, not the content they publish

Extract BMC fields (use "" if unclear):
1. valuePropositions: What problem solved, value provided
2. customerSegments: Target audience
3. channels: How accessed (web, apps, etc)
4. customerRelationships: How they engage customers
5. revenueStreams: How money is made
6. keyResources: Technologies/infrastructure
7. keyActivities: Core business activities
8. keyPartners: Key integrations/partners
9. costStructure: Main costs

Return JSON only: {"valuePropositions":"...","customerSegments":"...","channels":"...","customerRelationships":"...","revenueStreams":"...","keyResources":"...","keyActivities":"...","keyPartners":"...","costStructure":"..."}`;

  try {
    const geminiResponse = await geminiService.generateContent(prompt);

    // Parse JSON from response
    const jsonMatch = geminiResponse.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Could not parse BMC JSON from Gemini response");
      return {};
    }

    const jsonString = jsonMatch[0];
    const parsed: unknown = JSON.parse(jsonString);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    return parsed as Partial<CanvasState>;
  } catch (error) {
    console.error("Failed to extract BMC from website:", error);
    return {};
  }
}

/**
 * Import project data from a live website URL
 */
export async function importFromWebsite(
  url: string,
): Promise<WebsiteImportResult> {
  // Validate URL
  let parsedURL: URL;
  try {
    parsedURL = new URL(url);
    if (!parsedURL.protocol.startsWith("http")) {
      throw new Error("URL must use HTTP or HTTPS protocol");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Invalid URL: ${message}`);
  }

  // Fetch HTML
  const html = await fetchHTML(parsedURL.href);

  // Extract data
  const metadata = extractMetadata(html, parsedURL.href);
  const content = extractContent(html);
  const techStack = detectTechStack(html);

  // Extract BMC using AI
  const bmcData = await extractBMCFromWebsite(metadata, content, techStack);

  // Calculate confidence
  const filledFields = Object.values(bmcData).filter(
    (v) => v && v.trim().length > 0,
  ).length;
  const confidence = Math.min(0.9, 0.2 + (filledFields / 9) * 0.7);

  // Build tags
  const tags = [
    ...(metadata.keywords || []).slice(0, 5),
    ...techStack.frameworks,
    ...techStack.platforms.slice(0, 2),
  ].filter(Boolean);

  // Build warnings
  const warnings: string[] = [];
  if (!metadata.description) {
    warnings.push("No meta description found");
  }
  if (content.paragraphs.length === 0) {
    warnings.push("Very little text content found - may be a single-page app");
  }
  if (techStack.frameworks.length === 0) {
    warnings.push("Could not detect web framework");
  }
  if (Object.keys(bmcData).length === 0) {
    warnings.push("Could not extract BMC fields automatically");
  }

  // Generate business description using AI (not website content)
  let businessDescription = metadata.description || "";

  // If we have AI-extracted BMC data, generate a proper business description
  if (Object.keys(bmcData).length > 0) {
    const descParts: string[] = [];

    // Build description from extracted BMC fields
    if (bmcData.valuePropositions) {
      descParts.push(bmcData.valuePropositions);
    }
    if (bmcData.customerSegments) {
      descParts.push(`Serves ${bmcData.customerSegments.toLowerCase()}.`);
    }
    if (bmcData.channels) {
      descParts.push(`Available via ${bmcData.channels.toLowerCase()}.`);
    }

    if (descParts.length > 0) {
      businessDescription = descParts.join(" ");
    }
  }

  // Fallback: Use meta description or generic description (but NOT page content)
  if (!businessDescription) {
    businessDescription =
      metadata.description ||
      `${metadata.title} is a web-based product or service available at ${parsedURL.hostname}. Visit the site to learn more about what they offer.`;
  }

  return {
    projectName: metadata.title,
    oneLiner: metadata.description,
    description: businessDescription,
    tags,
    bmcData,
    metadata,
    techStack,
    screenshot: metadata.image, // Use OG image as screenshot
    confidence,
    warnings,
  };
}

/**
 * Check if URL is a valid website (not GitHub, Product Hunt, etc.)
 */
export function isWebsiteURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Exclude special platforms that have dedicated importers
    const excludedHosts = [
      "github.com",
      "gitlab.com",
      "bitbucket.org",
      "producthunt.com",
      "behance.net",
      "dribbble.com",
    ];

    return !excludedHosts.some((host) => hostname.includes(host));
  } catch {
    return false;
  }
}

export const webScraperService = {
  fetchHTML,
  extractMetadata,
  extractContent,
  detectTechStack,
  importFromWebsite,
  isWebsiteURL,
};
