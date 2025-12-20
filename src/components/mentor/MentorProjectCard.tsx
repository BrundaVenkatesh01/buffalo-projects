"use client";

import { formatDistanceToNow } from "date-fns";


import { Badge } from "@/components/ui-next";
import { Button } from "@/components/ui-next";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Star,
  Tag as TagIcon,
} from "@/icons";
import type { Workspace } from "@/types";

interface MentorProjectCardProps {
  project: Workspace;
  shortlisted: boolean;
  onToggleShortlist: (projectCode: string, next: boolean) => void;
}

export function MentorProjectCard({
  project,
  shortlisted,
  onToggleShortlist,
}: MentorProjectCardProps) {
  const slug = project.slug ?? project.code;
  const projectUrl = `/p/${slug}`;

  const updatedDistance = project.lastModified
    ? formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })
    : "Recently";

  const tagList = (project.tags ?? []).slice(0, 4);
  const stageLabel = project.stage
    ? project.stage.charAt(0).toUpperCase() + project.stage.slice(1)
    : "Stage";

  const locationLabel = project.location
    ? project.location === "buffalo"
      ? "Buffalo, NY"
      : project.location.charAt(0).toUpperCase() + project.location.slice(1)
    : null;

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.05] p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-white/20 text-xs uppercase tracking-[0.24em]"
          >
            {stageLabel}
          </Badge>
          {project.buffaloAffiliated ? (
            <Badge className="rounded-full bg-primary/90 text-xs text-primary-foreground">
              <Star className="mr-1 h-3 w-3" /> Buffalo Mentor
            </Badge>
          ) : null}
          {locationLabel ? (
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-white/20 text-xs"
            >
              <MapPin className="h-3 w-3" /> {locationLabel}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-foreground">
            {project.projectName || "Untitled project"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {project.description ||
              project.projectDescription ||
              "This builder hasn’t added a description yet."}
          </p>
        </div>

        {tagList.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {tagList.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] px-3 py-1 text-xs text-muted-foreground"
              >
                <TagIcon className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        ) : null}

        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
          Updated {updatedDistance}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
          onClick={() => {
            onToggleShortlist(project.code, !shortlisted);
          }}
        >
          {shortlisted ? (
            <>
              <BookmarkCheck className="mr-2 h-4 w-4" /> Shortlisted
            </>
          ) : (
            <>
              <Bookmark className="mr-2 h-4 w-4" /> Shortlist
            </>
          )}
        </Button>
        <Button
          className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
          onClick={() => {
            window.open(projectUrl, "_blank", "noopener,noreferrer");
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> Leave feedback
        </Button>
      </div>
    </div>
  );
}
