"use client";

import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface ProjectAboutProps {
  workspace: Workspace;
  className?: string;
}

/**
 * ProjectAbout - Minimal description
 * Just the text, no chrome
 */
export function ProjectAbout({ workspace, className }: ProjectAboutProps) {
  const description = workspace.description || workspace.projectDescription;

  if (!description) {
    return null;
  }

  return (
    <section className={cn("border-t border-white/10 py-6 md:py-8", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-3 text-sm font-medium text-neutral-400">About</h2>
        <p className="whitespace-pre-wrap text-sm text-neutral-200 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
