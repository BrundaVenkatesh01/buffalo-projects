"use client";

import { m } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Globe, ExternalLink, Github, FileText, Video, Palette } from "@/icons";
import { cn } from "@/lib/utils";
import {
  PROJECT_PAGE,
  PROJECT_ANIMATIONS,
} from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

/**
 * ProjectLinks Component
 *
 * Displays external links as beautiful preview cards.
 * Progressive enhancement: only shows if links exist.
 *
 * Visual Design:
 * - aspect-[2/1] cards with gradient backgrounds
 * - Icons for each link type
 * - Hover effects: scale, border color, shadow
 * - Responsive grid: 1 → 2 → 3 columns
 */

export interface ProjectLinksProps {
  workspace: Workspace;
  className?: string;
}

interface LinkPreview {
  type: string;
  label: string;
  url: string;
  icon: LucideIcon;
  hostname: string;
  description?: string;
}

export function ProjectLinks({ workspace, className }: ProjectLinksProps) {
  const links: LinkPreview[] = [];

  // Extract links from workspace
  if (workspace.embeds) {
    const { embeds } = workspace;

    if (embeds.website) {
      links.push({
        type: "website",
        label: "Website",
        url: embeds.website,
        icon: Globe,
        hostname: extractHostname(embeds.website),
        description: "Visit the project website",
      });
    }

    if (embeds.demo) {
      links.push({
        type: "demo",
        label: "Live Demo",
        url: embeds.demo,
        icon: ExternalLink,
        hostname: extractHostname(embeds.demo),
        description: "Try the live demo",
      });
    }

    if (embeds.github?.repoUrl) {
      links.push({
        type: "github",
        label: "GitHub",
        url: embeds.github.repoUrl,
        icon: Github,
        hostname: extractHostname(embeds.github.repoUrl),
        description: "View source code",
      });
    }

    if (embeds.pitch) {
      links.push({
        type: "pitch",
        label: "Pitch Deck",
        url: embeds.pitch,
        icon: FileText,
        hostname: extractHostname(embeds.pitch),
        description: "View pitch presentation",
      });
    }

    if (embeds.figma?.url) {
      links.push({
        type: "figma",
        label: "Figma",
        url: embeds.figma.url,
        icon: Palette,
        hostname: "figma.com",
        description: "View design files",
      });
    }

    if (embeds.youtube?.url) {
      links.push({
        type: "youtube",
        label: "YouTube",
        url: embeds.youtube.url,
        icon: Video,
        hostname: "youtube.com",
        description: "Watch video",
      });
    }
  }

  // Don't render if no links
  if (links.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Section Header */}
      <h2
        className={cn(
          PROJECT_PAGE.section.header.size,
          PROJECT_PAGE.section.header.tracking,
          PROJECT_PAGE.section.header.transform,
          PROJECT_PAGE.section.header.weight,
          PROJECT_PAGE.section.header.color,
        )}
      >
        Links & Resources
      </h2>

      {/* Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <m.a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative overflow-hidden",
              PROJECT_PAGE.linkCard.aspectRatio,
              PROJECT_PAGE.linkCard.rounded,
              PROJECT_PAGE.linkCard.background,
              PROJECT_PAGE.linkCard.border,
              "flex flex-col justify-between",
              "transition-all",
              PROJECT_PAGE.linkCard.hover.duration,
              "hover:scale-[1.01]",
              "hover:border-primary/40",
              "hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            )}
            initial={PROJECT_ANIMATIONS.entrance.section.initial}
            animate={PROJECT_ANIMATIONS.entrance.section.animate}
            transition={{
              ...PROJECT_ANIMATIONS.entrance.section.transition,
              delay: index * PROJECT_ANIMATIONS.entrance.stagger.delayIncrement,
            }}
            aria-label={`${link.label}: ${link.description}`}
          >
            {/* Card Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              {/* Icon */}
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "rounded-full bg-primary/10 p-3",
                    "transition-transform duration-300",
                    "group-hover:scale-110 group-hover:bg-primary/20",
                  )}
                >
                  <link.icon className="h-5 w-5 text-primary" />
                </div>

                {/* GitHub stars badge (if available) */}
                {link.type === "github" && workspace.githubStats?.stars && (
                  <div className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-1 text-xs text-yellow-400">
                    <span>⭐</span>
                    <span>{workspace.githubStats.stars}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h3
                  className={cn(
                    "text-base font-semibold text-foreground",
                    "transition-colors duration-300",
                    "group-hover:text-primary",
                    "lg:text-lg",
                  )}
                >
                  {link.label}
                </h3>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {link.hostname}
                </p>
              </div>
            </div>

            {/* Hover gradient overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5",
                "opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100",
              )}
              aria-hidden="true"
            />

            {/* External link indicator */}
            <div
              className={cn(
                "absolute right-3 top-3",
                "rounded-full bg-background/50 p-1.5",
                "opacity-0 transition-all duration-300",
                "group-hover:opacity-100 group-hover:scale-110",
                "backdrop-blur-sm",
              )}
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
          </m.a>
        ))}
      </div>

      {/* Show count if many links */}
      {links.length > 3 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {links.length} external resources
        </p>
      )}
    </div>
  );
}

/**
 * Extract hostname from URL
 */
function extractHostname(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
