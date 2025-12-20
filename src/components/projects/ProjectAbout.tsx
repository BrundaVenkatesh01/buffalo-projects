"use client";

import { cn } from "@/lib/utils";
import { PROJECT_PAGE } from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

export interface ProjectAboutProps {
  workspace: Workspace;
  className?: string;
}

export function ProjectAbout({ workspace, className }: ProjectAboutProps) {
  const description = workspace.description || workspace.projectDescription;
  if (!description) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h2
        className={cn(
          PROJECT_PAGE.section.header.size,
          PROJECT_PAGE.section.header.tracking,
          PROJECT_PAGE.section.header.transform,
          PROJECT_PAGE.section.header.weight,
          PROJECT_PAGE.section.header.color,
        )}
      >
        About this project
      </h2>
      {workspace.creator && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Created by</span>
          <span className="font-medium text-foreground">
            {workspace.creator}
          </span>
        </div>
      )}
      <div
        className={cn(
          "prose prose-lg dark:prose-invert max-w-none",
          "whitespace-pre-wrap leading-relaxed text-foreground/90",
        )}
      >
        {description}
      </div>
      {workspace.oneLiner && workspace.oneLiner !== description && (
        <p className="border-l-4 border-primary/30 pl-6 text-lg font-light italic text-muted-foreground/90">
          &quot;{workspace.oneLiner}&quot;
        </p>
      )}
    </div>
  );
}
