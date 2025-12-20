import type { Workspace } from "@/types";

/**
 * Navigation Utilities for Buffalo Projects
 *
 * Centralizes all project URL logic to ensure consistency across the application.
 * Handles the distinction between public project pages and editor routes.
 */

/**
 * Generates a URL-friendly slug from a project name
 * @param projectName - The project name to slugify
 * @returns URL-safe slug (lowercase, hyphenated, alphanumeric)
 */
export function generateSlug(projectName: string): string {
  return projectName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
}

/**
 * Gets or generates a slug for a workspace
 * @param workspace - The workspace object
 * @returns The slug for public URLs
 */
export function getProjectSlug(workspace: Workspace): string {
  // Use existing slug if available
  if (workspace.slug) {
    return workspace.slug;
  }

  // Generate from project name
  if (workspace.projectName) {
    return generateSlug(workspace.projectName);
  }

  // Fallback to code
  return workspace.code.toLowerCase();
}

/**
 * Gets the public project URL for viewing/sharing
 * Format: /p/[slug]
 *
 * @param workspace - The workspace object
 * @returns Public project URL path
 */
export function getPublicProjectUrl(workspace: Workspace): string {
  const slug = getProjectSlug(workspace);
  return `/p/${slug}`;
}

/**
 * Gets the project editor URL for authenticated editing
 * Format: /edit/[code] (unified editor for all project types)
 *
 * @param workspace - The workspace object
 * @returns Editor URL path
 */
export function getProjectEditorUrl(workspace: Workspace): string {
  return `/edit/${workspace.code}`;
}

/**
 * Gets the appropriate URL based on context
 * - If public context: returns public URL
 * - If authenticated/owner: returns editor URL
 *
 * @param workspace - The workspace object
 * @param options - Configuration options
 * @returns Appropriate URL path
 */
export function getProjectUrl(
  workspace: Workspace,
  options: {
    context?: "public" | "editor";
    userId?: string;
  } = {},
): string {
  const { context, userId } = options;

  // Explicit context
  if (context === "public") {
    return getPublicProjectUrl(workspace);
  }
  if (context === "editor") {
    return getProjectEditorUrl(workspace);
  }

  // Determine from ownership
  if (userId && (workspace.userId === userId || workspace.ownerId === userId)) {
    return getProjectEditorUrl(workspace);
  }

  // Default to public for published projects
  if (workspace.isPublic) {
    return getPublicProjectUrl(workspace);
  }

  // Default to editor for private projects
  return getProjectEditorUrl(workspace);
}

/**
 * Gets the discover page URL (browse community projects)
 * @returns Discover page path
 */
export function getDiscoverUrl(): string {
  return "/dashboard/discover";
}

/**
 * Gets the showcase gallery URL
 * @deprecated Use getDiscoverUrl() instead
 * @returns Showcase gallery path (redirects to /dashboard/discover)
 */
export function getShowcaseGalleryUrl(): string {
  return "/dashboard/discover";
}

/**
 * Gets the dashboard URL (user's project hub)
 * @returns Dashboard page path
 */
export function getDashboardUrl(): string {
  return "/dashboard";
}

/**
 * Gets the user profile URL
 * @deprecated Use getDashboardUrl() instead
 * @returns Profile page path (redirects to /dashboard)
 */
export function getProfileUrl(): string {
  return "/dashboard";
}

/**
 * Checks if a workspace is owned by a user
 * @param workspace - The workspace to check
 * @param userId - The user ID to check against
 * @returns True if user owns the workspace
 */
export function isWorkspaceOwner(
  workspace: Workspace,
  userId: string | undefined,
): boolean {
  if (!userId) {return false;}
  return workspace.userId === userId || workspace.ownerId === userId;
}

/**
 * Gets the absolute URL for a project (with domain)
 * Used for sharing, OG tags, etc.
 *
 * @param workspace - The workspace object
 * @param baseUrl - Base URL (e.g., https://buffaloprojects.com)
 * @returns Full absolute URL
 */
export function getAbsoluteProjectUrl(
  workspace: Workspace,
  baseUrl: string = process.env["NEXT_PUBLIC_SITE_URL"] ||
    "https://buffaloprojects.com",
): string {
  const path = getPublicProjectUrl(workspace);
  return `${baseUrl}${path}`;
}

/**
 * Parses a project URL to extract the identifier (slug or code)
 * @param url - The URL to parse (e.g., "/p/my-project" or "/edit/BUF-X7K9")
 * @returns Object with type and identifier
 */
export function parseProjectUrl(url: string): {
  type: "public" | "editor" | "unknown";
  identifier: string | null;
} {
  // Public project URL: /p/[slug]
  const publicMatch = url.match(/^\/p\/([^/]+)/);
  if (publicMatch && publicMatch[1]) {
    return { type: "public", identifier: publicMatch[1] };
  }

  // Editor URL: /edit/[code] (new unified editor)
  const editorMatch = url.match(/^\/edit\/([^/]+)/);
  if (editorMatch && editorMatch[1]) {
    return { type: "editor", identifier: editorMatch[1] };
  }

  // Legacy editor URLs (redirect to /edit/[code])
  const legacyWorkspace = url.match(/^\/workspace\/([^/]+)/);
  if (legacyWorkspace && legacyWorkspace[1]) {
    return { type: "editor", identifier: legacyWorkspace[1] };
  }

  const legacyShowcase = url.match(/^\/showcase\/([^/]+)/);
  if (legacyShowcase && legacyShowcase[1]) {
    return { type: "editor", identifier: legacyShowcase[1] };
  }

  return { type: "unknown", identifier: null };
}
