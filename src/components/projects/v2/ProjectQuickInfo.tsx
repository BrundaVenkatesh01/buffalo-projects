"use client";

import { m } from "framer-motion";

import { Badge } from "@/components/unified";
import { MapPin, Calendar, Users, Target, Code } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectQuickInfoProps {
  workspace: Workspace;
  className?: string;
}

/**
 * ProjectQuickInfo - LinkedIn-style summary card
 *
 * Design: At-a-glance project information
 * Content: Creator, problem statement, looking for, quick stats, tech stack
 * Placement: Immediately after header, above fold
 */
export function ProjectQuickInfo({
  workspace,
  className,
}: ProjectQuickInfoProps) {
  const createdDate = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  // Show stats that matter for ANY type of project (not just startups!)
  const hasStats =
    (workspace.users && workspace.users > 0) || // Any users = real impact
    (workspace.revenue && workspace.revenue > 0) || // Revenue = validation
    (workspace.githubStats?.stars && workspace.githubStats.stars > 5) || // Even 5 stars = people care
    (workspace.documents && workspace.documents.length > 3) || // Evidence = thoughtfulness
    (workspace.pivots && workspace.pivots.length > 0); // Pivots = learning journey

  // Celebrate the achievement - what matters for THIS project?
  const getHighlight = () => {
    // Startup/Product metrics (if exists)
    if (workspace.revenue && workspace.revenue > 0) {
      return {
        value: `$${(workspace.revenue / 1000).toFixed(1)}K`,
        label: "revenue generated",
        color: "text-green-600",
      };
    }
    if (workspace.users && workspace.users > 0) {
      return {
        value: workspace.users.toLocaleString(),
        label: workspace.users === 1 ? "user" : "active users",
        color: "text-primary",
      };
    }

    // Open source / Technical achievement
    if (workspace.githubStats?.stars && workspace.githubStats.stars >= 5) {
      return {
        value: workspace.githubStats.stars.toLocaleString(),
        label:
          workspace.githubStats.stars === 1 ? "GitHub star" : "GitHub stars",
        color: "text-foreground",
      };
    }

    // Learning & Documentation (shows thoughtfulness)
    if (workspace.documents && workspace.documents.length > 5) {
      return {
        value: workspace.documents.length.toString(),
        label: "evidence documents",
        color: "text-foreground",
      };
    }

    // Journey & Growth (pivots = learning)
    if (workspace.pivots && workspace.pivots.length > 0) {
      return {
        value: workspace.pivots.length.toString(),
        label: workspace.pivots.length === 1 ? "pivot" : "pivots & learnings",
        color: "text-amber-600",
      };
    }

    return null;
  };

  const impactHighlight = getHighlight();

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "border-b border-border/40 bg-card",
        "py-8 md:py-12",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl px-6">
        {/* Hero Impact Stat - The ONE number that matters */}
        {impactHighlight && (
          <div className="mb-8 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 p-8 text-center">
            <div
              className={`mb-2 text-5xl font-black tracking-tight md:text-6xl ${impactHighlight.color}`}
            >
              {impactHighlight.value}
            </div>
            <div className="text-lg font-medium text-muted-foreground">
              {impactHighlight.label}
            </div>
          </div>
        )}

        {/* Creator & Basic Info */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {workspace.creator && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium text-foreground">
                {workspace.creator}
              </span>
            </div>
          )}
          {workspace.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{workspace.location}</span>
            </div>
          )}
          {createdDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Since {createdDate}</span>
            </div>
          )}
        </div>

        {/* Problem Statement (if exists) */}
        {workspace.problemStatement && (
          <div className="mb-6 rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="h-4 w-4" />
              Problem We&apos;re Solving
            </div>
            <p className="text-base leading-relaxed text-foreground/90">
              {workspace.problemStatement}
            </p>
          </div>
        )}

        {/* Looking For (if exists) */}
        {workspace.lookingFor && workspace.lookingFor.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 text-sm font-medium text-foreground">
              Looking For
            </div>
            <div className="flex flex-wrap gap-2">
              {workspace.lookingFor.map((item) => (
                <Badge key={item} variant="secondary" className="capitalize">
                  {item.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack (if exists) */}
        {workspace.techStack && workspace.techStack.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Code className="h-4 w-4" />
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {workspace.techStack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Project Metrics - Celebrate ALL types of achievements */}
        {hasStats && (
          <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-6 md:grid-cols-4">
            {/* Users - Any adoption counts */}
            {workspace.users && workspace.users > 0 && (
              <div>
                <div className="text-2xl font-bold text-primary">
                  {workspace.users.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {workspace.users === 1 ? "User" : "Users"}
                </div>
              </div>
            )}

            {/* Revenue - Business validation */}
            {workspace.revenue && workspace.revenue > 0 && (
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${(workspace.revenue / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </div>
            )}

            {/* GitHub Stars - Even 1 star shows someone cared! */}
            {workspace.githubStats?.stars &&
              workspace.githubStats.stars > 0 && (
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {workspace.githubStats.stars.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {workspace.githubStats.stars === 1
                      ? "GitHub Star"
                      : "GitHub Stars"}
                  </div>
                </div>
              )}

            {/* Evidence docs - Shows thoroughness */}
            {workspace.documents && workspace.documents.length > 0 && (
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {workspace.documents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Evidence Docs
                </div>
              </div>
            )}

            {/* Pivots - Learning & iteration */}
            {workspace.pivots && workspace.pivots.length > 0 && (
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {workspace.pivots.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {workspace.pivots.length === 1 ? "Pivot" : "Pivots"}
                </div>
              </div>
            )}

            {/* Commits - Sustained effort on OSS projects */}
            {workspace.githubStats?.totalCommits &&
              workspace.githubStats.totalCommits > 10 && (
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {workspace.githubStats.totalCommits.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Commits</div>
                </div>
              )}

            {/* Contributors - Shows collaboration */}
            {workspace.githubStats?.contributors &&
              workspace.githubStats.contributors > 1 && (
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {workspace.githubStats.contributors}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contributors
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </m.section>
  );
}
