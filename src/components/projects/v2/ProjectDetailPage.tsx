"use client";

import { EvidenceDocuments } from "./EvidenceDocuments";
import { GitHubStats } from "./GitHubStats";
import { ImpactMetrics } from "./ImpactMetrics";
import { ProjectAbout } from "./ProjectAbout";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectShowcase } from "./ProjectShowcase";
import { TechStack } from "./TechStack";
// YC-style: Removed MilestonesTimeline, ProjectCommunity, Comments (social features deferred)

import type { Workspace } from "@/types";

export interface ProjectDetailPageV2Props {
  workspace: Workspace;
  currentUserId?: string;
  showMinimal?: boolean;
}

/**
 * ProjectDetailPage v2 - YC-style minimal
 * Dense info, minimal chrome, everything important above fold
 */
export function ProjectDetailPageV2({
  workspace,
  currentUserId,
}: ProjectDetailPageV2Props) {
  const isOwner = Boolean(currentUserId && workspace.userId === currentUserId);

  // Only show sections with content
  const hasDescription = Boolean(
    workspace.description ||
      workspace.projectDescription ||
      workspace.problemStatement,
  );
  const hasEvidence =
    (workspace.documents || []).filter((doc) => doc.type !== "image").length >
    0;
  const hasImpact = Boolean(
    workspace.users || workspace.revenue || workspace.waitlistCount,
  );
  const hasShowcase = Boolean(
    (workspace.documents || []).some((doc) => doc.type === "image"),
  );
  const hasTechStack = workspace.techStack && workspace.techStack.length > 0;
  const hasGitHub = Boolean(workspace.githubStats);

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* Header - All key info above fold */}
      <ProjectHeader workspace={workspace} />

      {/* Content sections - Tight padding */}
      <main className="relative">
        {/* Story */}
        {hasDescription && <ProjectAbout workspace={workspace} />}

        {/* Screenshots */}
        {hasShowcase && (
          <ProjectShowcase workspace={workspace} isOwner={isOwner} />
        )}

        {/* Evidence */}
        {hasEvidence && (
          <EvidenceDocuments workspace={workspace} isOwner={isOwner} />
        )}

        {/* Impact */}
        {hasImpact && <ImpactMetrics workspace={workspace} isOwner={isOwner} />}

        {/* Tech */}
        {hasTechStack && <TechStack workspace={workspace} isOwner={isOwner} />}

        {/* GitHub */}
        {hasGitHub && <GitHubStats workspace={workspace} isOwner={isOwner} />}
      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-white/10 py-4">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <div className="flex gap-4">
              {workspace.createdAt && (
                <span>
                  {new Date(workspace.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {workspace.lastModified && (
                <span>
                  Updated{" "}
                  {new Date(workspace.lastModified).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </span>
              )}
            </div>
            <span className="font-mono opacity-50">{workspace.code}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
