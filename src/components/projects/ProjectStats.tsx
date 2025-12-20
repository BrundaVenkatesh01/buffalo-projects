"use client";

import { differenceInCalendarDays } from "date-fns";

import { Eye, Heart, MessageCircle, GitBranch, Calendar, Star } from "@/icons";
import { cn } from "@/lib/utils";
import { PROJECT_PAGE } from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";


export interface ProjectStatsProps {
  workspace: Workspace;
  commentCount?: number;
  className?: string;
}

export function ProjectStats({
  workspace,
  commentCount,
  className,
}: ProjectStatsProps) {
  const stats = [
    workspace.views &&
      workspace.views > 0 && {
        icon: Eye,
        label: "Views",
        value: workspace.views,
      },
    workspace.appreciations &&
      workspace.appreciations > 0 && {
        icon: Heart,
        label: "Appreciations",
        value: workspace.appreciations,
      },
    commentCount &&
      commentCount > 0 && {
        icon: MessageCircle,
        label: "Comments",
        value: commentCount,
      },
    workspace.pivots &&
      workspace.pivots.length > 0 && {
        icon: GitBranch,
        label: "Pivots",
        value: workspace.pivots.length,
      },
    workspace.createdAt && {
      icon: Calendar,
      label: "Days Active",
      value:
        differenceInCalendarDays(new Date(), new Date(workspace.createdAt)) + 1,
    },
    workspace.githubStats?.stars &&
      workspace.githubStats.stars > 0 && {
        icon: Star,
        label: "GitHub Stars",
        value: workspace.githubStats.stars,
      },
  ].filter(Boolean);

  if (stats.length === 0) {return null;}

  return (
    <div
      className={cn(
        PROJECT_PAGE.stats.background,
        PROJECT_PAGE.stats.border,
        PROJECT_PAGE.stats.backdrop,
        "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-12",
          PROJECT_PAGE.section.maxWidth,
          PROJECT_PAGE.stats.padding,
          `${PROJECT_PAGE.breakpoints.md}${PROJECT_PAGE.stats.paddingMobile}`,
        )}
      >
        {stats.map(
          (stat) =>
            stat && (
              <div key={stat.label} className="flex items-center gap-3">
                <div
                  className={cn(
                    PROJECT_PAGE.stats.icon.background,
                    PROJECT_PAGE.stats.icon.rounded,
                    PROJECT_PAGE.stats.icon.padding,
                  )}
                >
                  <stat.icon
                    className={cn(
                      PROJECT_PAGE.stats.icon.size,
                      PROJECT_PAGE.stats.icon.color,
                    )}
                  />
                </div>
                <div>
                  <div
                    className={cn(
                      PROJECT_PAGE.stats.value.size,
                      PROJECT_PAGE.stats.value.weight,
                      PROJECT_PAGE.stats.value.color,
                    )}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={cn(
                      PROJECT_PAGE.stats.label.size,
                      PROJECT_PAGE.stats.label.tracking,
                      PROJECT_PAGE.stats.label.transform,
                      PROJECT_PAGE.stats.label.color,
                    )}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
