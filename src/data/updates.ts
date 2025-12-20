/**
 * Platform Updates & Changelog
 *
 * This file defines all platform updates shown to users via the UpdatesWidget.
 * Updates are shown in the bottom-right widget with a badge for unread items.
 *
 * Add new updates to the top of the array (most recent first).
 */

export type UpdateType = "feature" | "improvement" | "bugfix" | "announcement";

export interface PlatformUpdate {
  /** Unique identifier for this update (used for tracking read/dismissed state) */
  id: string;
  /** Semantic version or date-based version (e.g., "1.2.0" or "2025-11-18") */
  version: string;
  /** Type of update */
  type: UpdateType;
  /** Short title of the update */
  title: string;
  /** Detailed description (supports markdown-like formatting) */
  description: string;
  /** ISO date string when this update was published */
  date: string;
  /** Optional link to more details (blog post, docs, etc.) */
  link?: string;
}

/**
 * All platform updates (newest first)
 *
 * To add a new update:
 * 1. Generate a unique ID (e.g., "update-2025-11-18-1")
 * 2. Add to the TOP of this array
 * 3. Set the current date
 * 4. Choose appropriate type and write clear title/description
 */
export const PLATFORM_UPDATES: PlatformUpdate[] = [
  {
    id: "update-2025-12-09-1",
    version: "1.3.0",
    type: "improvement",
    title: "Better Onboarding & Cleaner Editor",
    description:
      'New guided intro when you first open the Project Canvas - click any core block to jump right in. We also simplified the editor sidebar by removing unused buttons and hiding technical IDs. The canvas now uses friendlier language like "What Makes It Special" instead of business jargon.',
    date: "2025-12-09T00:00:00Z",
  },
  {
    id: "update-2025-12-05-1",
    version: "1.2.1",
    type: "feature",
    title: "Image Cropping & Redesigned Publish Page",
    description:
      "Upload cover images with interactive cropping - choose from preset aspect ratios (16:9, 4:3, 1:1) or go freeform. The publish page now has a two-column layout with a live preview card so you can see exactly how your project will look in the gallery.",
    date: "2025-12-05T00:00:00Z",
  },
  {
    id: "update-2025-11-20-1",
    version: "1.2.0",
    type: "feature",
    title: "Group Sharing",
    description:
      "Share your projects with course instructors via a group code. Built for UB School of Management classes and programs. Instructors get a dashboard to track progress across all student projects. Your work stays private - only you and your instructor can view it.",
    date: "2025-11-20T00:00:00Z",
  },
  {
    id: "update-2025-11-18-1",
    version: "1.1.0",
    type: "feature",
    title: "Updates Widget Added",
    description:
      "You can now see all platform updates right here! This widget will show you new features, improvements, and bug fixes as we ship them. Click to expand and see details.",
    date: "2025-11-18T00:00:00Z",
  },
  {
    id: "update-2025-11-15-1",
    version: "1.0.0",
    type: "announcement",
    title: "Buffalo Projects Launch",
    description:
      "Welcome to Buffalo Projects! Build projects privately, publish to our curated community gallery, and get authentic feedback from fellow builders. Community-owned peer validation platform.",
    date: "2025-11-15T00:00:00Z",
  },
];

/**
 * Get updates that were published after a given date
 */
export function getUpdatesAfter(date: Date): PlatformUpdate[] {
  return PLATFORM_UPDATES.filter((update) => new Date(update.date) > date);
}

/**
 * Get the most recent N updates
 */
export function getRecentUpdates(count: number = 5): PlatformUpdate[] {
  return PLATFORM_UPDATES.slice(0, count);
}

/**
 * Get update type display info (icon, color, label)
 */
export function getUpdateTypeInfo(type: UpdateType): {
  label: string;
  color: string;
  icon: string;
} {
  switch (type) {
    case "feature":
      return {
        label: "New Feature",
        color: "#0070f3", // Buffalo Blue
        icon: "✨",
      };
    case "improvement":
      return {
        label: "Improvement",
        color: "#10b981", // Green
        icon: "📈",
      };
    case "bugfix":
      return {
        label: "Bug Fix",
        color: "#f59e0b", // Amber
        icon: "🐛",
      };
    case "announcement":
      return {
        label: "Announcement",
        color: "#8b5cf6", // Purple
        icon: "📢",
      };
  }
}
