"use client";

import { m } from "framer-motion";

import { Badge, Button } from "@/components/unified";
import { ExternalLink, Github, MessageSquare, Play } from "@/icons";
import { cn } from "@/lib/utils";
import { PROJECT_PAGE } from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

export interface ProjectSummaryProps {
  workspace: Workspace;
  className?: string;
}

export function ProjectSummary({ workspace, className }: ProjectSummaryProps) {
  const hasDemo = workspace.embeds?.demo;
  const hasGithub = workspace.embeds?.github?.repoUrl;
  const hasWebsite = workspace.embeds?.website;

  // Determine primary CTA
  const primaryLink = hasDemo || hasWebsite || hasGithub;

  // Don't render if there's nothing to show
  if (!workspace.oneLiner && !primaryLink) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-b border-border/40 bg-background",
        "py-12 md:py-16",
        className,
      )}
    >
      <div className={cn(PROJECT_PAGE.container.narrow, "mx-auto px-6")}>
        {/* One-liner / TLDR */}
        {workspace.oneLiner && (
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "text-lg md:text-xl",
              "text-muted-foreground",
              "mb-8",
              "leading-relaxed",
            )}
          >
            {workspace.oneLiner}
          </m.p>
        )}

        {/* Key Facts */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {workspace.stage && (
            <Badge variant="secondary">Stage {workspace.stage}</Badge>
          )}
          {workspace.location && (
            <Badge variant="outline">{workspace.location}</Badge>
          )}
          {workspace.buffaloAffiliated && (
            <Badge variant="secondary">🦬 Buffalo Affiliated</Badge>
          )}
        </m.div>

        {/* Action CTAs */}
        {primaryLink && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {/* Primary CTA: Demo > Website > GitHub */}
            {hasDemo && workspace.embeds?.demo && (
              <a
                href={workspace.embeds.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                <Play className="h-4 w-4" />
                Try Demo
              </a>
            )}

            {!hasDemo && hasWebsite && workspace.embeds?.website && (
              <a
                href={workspace.embeds.website}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            )}

            {/* GitHub CTA */}
            {hasGithub && workspace.embeds?.github?.repoUrl && (
              <a
                href={workspace.embeds.github.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                <Github className="h-4 w-4" />
                View Code
              </a>
            )}

            {/* Give Feedback CTA - scroll to comments */}
            {workspace.isPublic && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  const commentsSection = document.getElementById("comments");
                  commentsSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Give Feedback
              </Button>
            )}
          </m.div>
        )}
      </div>
    </div>
  );
}
