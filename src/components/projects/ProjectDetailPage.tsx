"use client";

import { m } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProjectAbout } from "./ProjectAbout";
import { ProjectBMC } from "./ProjectBMC";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectHero } from "./ProjectHero";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectStats } from "./ProjectStats";
import { ProjectSummary } from "./ProjectSummary";

import {
  PROJECT_ANIMATIONS,
  PROJECT_PAGE,
} from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

// Lazy load comments for better performance
const CommentThread = dynamic(
  () =>
    import("@/components/comments/CommentThread").then((m) => ({
      default: m.CommentThread,
    })),
  { ssr: false },
);

/**
 * ProjectDetailPage Component
 *
 * Master container for project detail/showcase pages.
 * Implements progressive enhancement: sections only render if data exists.
 *
 * Visual Hierarchy (Action-Focused):
 * 1. Hero (always) - dramatic, visual-first
 * 2. Summary + CTAs (if one-liner or links exist) - TLDR + action buttons
 * 3. Stats Bar (if stats exist) - project activity metrics
 * 4. About (if description exists) - project description
 * 5. Business Model Canvas (if BMC data exists) - strategy framework
 * 6. Gallery (if images exist) - visual showcase
 * 7. Links & Resources (if external links exist) - additional resources
 * 8. Comments (if public) - community feedback
 * 9. Footer (always) - metadata
 *
 * More content = richer display (progressive enhancement tiers)
 */

export interface ProjectDetailPageProps {
  workspace: Workspace;
  showMinimal?: boolean;
  currentUserId?: string;
}

export function ProjectDetailPage({
  workspace,
  showMinimal = false,
  currentUserId,
}: ProjectDetailPageProps) {
  const router = useRouter();
  const [commentCount, setCommentCount] = useState(workspace.commentCount || 0);

  // Progressive enhancement checks
  const hasLinks = Boolean(
    workspace.embeds?.website ||
      workspace.embeds?.demo ||
      workspace.embeds?.github?.repoUrl ||
      workspace.embeds?.pitch ||
      workspace.embeds?.figma?.url ||
      workspace.embeds?.youtube?.url,
  );

  const hasGallery = Boolean(
    workspace.assets?.coverImage ||
      (workspace.assets?.screenshots &&
        workspace.assets.screenshots.length > 0) ||
      (workspace.documents &&
        workspace.documents.some((doc) => doc.type === "image")),
  );

  const hasStats = Boolean(
    (workspace.views && workspace.views > 0) ||
      (workspace.appreciations && workspace.appreciations > 0) ||
      (commentCount && commentCount > 0) ||
      (workspace.pivots && workspace.pivots.length > 0) ||
      workspace.createdAt ||
      (workspace.githubStats?.stars && workspace.githubStats.stars > 0),
  );

  const hasDescription = Boolean(
    workspace.description || workspace.projectDescription,
  );

  const hasBMC = Boolean(
    workspace.bmcData &&
      Object.keys(workspace.bmcData).some((key) => {
        const content =
          workspace.bmcData[key as keyof typeof workspace.bmcData];
        return content && String(content).trim().length > 0;
      }),
  );

  const showComments = workspace.isPublic && !showMinimal;

  // Metadata for hero
  const metadata = {
    updatedDate: workspace.lastModified
      ? `Updated ${new Date(workspace.lastModified).toLocaleDateString()}`
      : undefined,
    views: workspace.views,
    appreciations: workspace.appreciations,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Always visible, dramatic impact */}
      <ProjectHero
        workspace={workspace}
        onBack={() => router.back()}
        metadata={metadata}
        showCoverImage={true}
        showStageProgress={Boolean(workspace.stage)}
        showActions={false}
      />

      {/* Summary + CTAs - Action-focused TLDR with primary actions */}
      <ProjectSummary workspace={workspace} />

      {/* Stats Bar - Shows if any stats exist */}
      {hasStats && (
        <ProjectStats workspace={workspace} commentCount={commentCount} />
      )}

      {/* Main Content Area - Structured sections with proper spacing and separators */}
      <main className="relative">
        {/* About Section - Narrower for readability */}
        {hasDescription && (
          <m.section
            initial={PROJECT_ANIMATIONS.entrance.section.initial}
            whileInView={PROJECT_ANIMATIONS.entrance.section.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={PROJECT_ANIMATIONS.entrance.section.transition}
            className="border-b border-border/40 bg-background py-20 md:py-24"
          >
            <div
              className={`${PROJECT_PAGE.container.narrow} mx-auto ${PROJECT_PAGE.section.padding.desktop} md:${PROJECT_PAGE.section.padding.mobile}`}
            >
              <ProjectAbout workspace={workspace} />
            </div>
          </m.section>
        )}

        {/* Business Model Canvas Section - Wide for grid layout */}
        {hasBMC && (
          <m.section
            initial={PROJECT_ANIMATIONS.entrance.section.initial}
            whileInView={PROJECT_ANIMATIONS.entrance.section.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={PROJECT_ANIMATIONS.entrance.section.transition}
            className="border-b border-border/40 bg-muted/5 py-20 md:py-24"
          >
            <div
              className={`${PROJECT_PAGE.container.wide} mx-auto ${PROJECT_PAGE.section.padding.desktop} md:${PROJECT_PAGE.section.padding.mobile}`}
            >
              <ProjectBMC workspace={workspace} />
            </div>
          </m.section>
        )}

        {/* Gallery Section - Full bleed for visual impact */}
        {hasGallery && (
          <m.section
            initial={PROJECT_ANIMATIONS.entrance.section.initial}
            whileInView={PROJECT_ANIMATIONS.entrance.section.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={PROJECT_ANIMATIONS.entrance.section.transition}
            className="border-b border-border/40 bg-muted/5 py-20 md:py-24"
          >
            <div
              className={`${PROJECT_PAGE.container.wide} mx-auto ${PROJECT_PAGE.section.padding.desktop} md:${PROJECT_PAGE.section.padding.mobile}`}
            >
              <ProjectGallery workspace={workspace} />
            </div>
          </m.section>
        )}

        {/* Links & Resources Section - Secondary resources */}
        {hasLinks && (
          <m.section
            initial={PROJECT_ANIMATIONS.entrance.section.initial}
            whileInView={PROJECT_ANIMATIONS.entrance.section.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={PROJECT_ANIMATIONS.entrance.section.transition}
            className="border-b border-border/40 bg-background py-20 md:py-24"
          >
            <div
              className={`${PROJECT_PAGE.container.wide} mx-auto ${PROJECT_PAGE.section.padding.desktop} md:${PROJECT_PAGE.section.padding.mobile}`}
            >
              <ProjectLinks workspace={workspace} />
            </div>
          </m.section>
        )}

        {/*
          TODO: Additional sections to add later:
          - ProjectUpdates (timeline of updates)
          - ProjectDocuments (supporting docs)
          - ProjectTeam (team members)
        */}
      </main>

      {/* Comments Section - Full width with distinct background */}
      {showComments && (
        <m.section
          id="comments"
          initial={PROJECT_ANIMATIONS.entrance.section.initial}
          whileInView={PROJECT_ANIMATIONS.entrance.section.animate}
          viewport={{ once: true, margin: "-100px" }}
          transition={PROJECT_ANIMATIONS.entrance.section.transition}
          className="border-y border-border bg-muted/10 backdrop-blur-sm"
        >
          <div
            className={`${PROJECT_PAGE.container.standard} mx-auto py-20 md:py-24 ${PROJECT_PAGE.section.padding.desktop} md:${PROJECT_PAGE.section.padding.mobile}`}
          >
            <h2
              className={`${PROJECT_PAGE.section.header.size} ${PROJECT_PAGE.section.header.tracking} ${PROJECT_PAGE.section.header.transform} ${PROJECT_PAGE.section.header.weight} ${PROJECT_PAGE.section.header.color} mb-12`}
            >
              Feedback & Discussion
            </h2>
            <CommentThread
              projectId={workspace.code}
              currentUserId={currentUserId ?? undefined}
              onCountChange={setCommentCount}
            />
          </div>
        </m.section>
      )}

      {/* Footer - Always visible, subtle metadata */}
      <footer className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
        <div
          className={`${PROJECT_PAGE.container.wide} mx-auto flex flex-wrap items-center justify-between gap-4 py-8 ${PROJECT_PAGE.section.padding.desktop} md:${PROJECT_PAGE.section.padding.mobile} text-xs text-muted-foreground/80`}
        >
          <div className="flex flex-wrap items-center gap-4">
            {workspace.createdAt && (
              <span className="flex items-center gap-1.5">
                <span className="text-muted-foreground/50">Created</span>
                <span className="font-medium text-foreground/70">
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </span>
              </span>
            )}
            {workspace.lastModified && (
              <span className="flex items-center gap-1.5">
                <span className="text-muted-foreground/50">Modified</span>
                <span className="font-medium text-foreground/70">
                  {new Date(workspace.lastModified).toLocaleDateString()}
                </span>
              </span>
            )}
            {workspace.versions && workspace.versions.length > 0 && (
              <span className="rounded-full bg-muted/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/80">
                {workspace.versions.length}{" "}
                {workspace.versions.length === 1 ? "version" : "versions"}
              </span>
            )}
          </div>
          <div className="rounded-md bg-muted/30 px-3 py-1.5 font-mono text-[10px] tracking-wider text-muted-foreground/70">
            {workspace.code}
          </div>
        </div>
      </footer>
    </div>
  );
}
