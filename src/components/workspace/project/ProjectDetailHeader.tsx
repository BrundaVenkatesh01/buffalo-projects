"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge, Button, STAGE_COLORS } from "@/components/unified";
import {
  Calendar,
  Eye,
  FileText,
  GitBranch,
  Globe,
  Lock,
  MoreVertical,
  Pencil,
  Share2,
  Star,
} from "@/icons";
import { BUFFALO_BRAND } from "@/tokens/brand";
import type { Workspace } from "@/types";

interface ProjectDetailHeaderProps {
  workspace: Workspace;
  onEdit?: () => void;
  onShare?: () => void;
}

/**
 * Sticky project detail header shown above workspace editor
 * Displays key project info and quick actions
 */
export function ProjectDetailHeader({
  workspace,
  onEdit,
  onShare,
}: ProjectDetailHeaderProps) {
  const router = useRouter();
  const isPublic = workspace.isPublic;
  const isForTwentySix = workspace.isForTwentySix;

  const lastModified = workspace.lastModified
    ? new Date(workspace.lastModified).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const stageColor = workspace.stage
    ? STAGE_COLORS[workspace.stage]
    : STAGE_COLORS.idea;

  const stats = useMemo(() => {
    const items = [];

    if (workspace.versions && workspace.versions.length > 0) {
      items.push({
        icon: GitBranch,
        value: workspace.versions.length,
        label: workspace.versions.length === 1 ? "version" : "versions",
      });
    }

    if (workspace.pivots && workspace.pivots.length > 0) {
      items.push({
        icon: FileText,
        value: workspace.pivots.length,
        label: workspace.pivots.length === 1 ? "pivot" : "pivots",
      });
    }

    if (workspace.views && workspace.views > 0) {
      items.push({
        icon: Eye,
        value: workspace.views,
        label: workspace.views === 1 ? "view" : "views",
      });
    }

    return items;
  }, [workspace.versions, workspace.pivots, workspace.views]);

  const handleViewPublic = () => {
    if (workspace.code) {
      window.open(
        `/p/${workspace.code.toLowerCase()}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <div className="sticky top-0 z-20 border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Left: Project Info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Project Name & Code */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold text-foreground">
                  {workspace.projectName}
                </h1>
              </div>

              {/* Badges Row */}
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                {/* Stage Badge */}
                {workspace.stage && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-5"
                    style={{
                      color: stageColor.text,
                      borderColor: stageColor.border,
                      backgroundColor: stageColor.background,
                    }}
                  >
                    {workspace.stage}
                  </Badge>
                )}

                {/* 26 under 26 Badge */}
                {isForTwentySix && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-5 font-semibold"
                    style={{
                      color: BUFFALO_BRAND.status.warning,
                      borderColor: `${BUFFALO_BRAND.status.warning}60`,
                      backgroundColor: `${BUFFALO_BRAND.status.warning}20`,
                    }}
                  >
                    <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                    &apos;26
                  </Badge>
                )}

                {/* Visibility Badge */}
                {isPublic ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-5"
                    style={{
                      color: BUFFALO_BRAND.status.success,
                      borderColor: `${BUFFALO_BRAND.status.success}40`,
                      backgroundColor: `${BUFFALO_BRAND.status.success}15`,
                    }}
                  >
                    <Globe className="h-2.5 w-2.5 mr-0.5" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] py-0 h-5">
                    <Lock className="h-2.5 w-2.5 mr-0.5" />
                    Private
                  </Badge>
                )}

                {/* Stats */}
                {stats.length > 0 && (
                  <>
                    <span className="text-muted-foreground/30">•</span>
                    {stats.map((stat, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground"
                      >
                        <stat.icon className="h-2.5 w-2.5" />
                        {stat.value} {stat.label}
                      </span>
                    ))}
                  </>
                )}

                {/* Last Modified */}
                {lastModified && (
                  <>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5" />
                      {lastModified}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Back to Dashboard */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="hidden sm:flex"
            >
              Back to Dashboard
            </Button>

            {/* Share Button */}
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                leftIcon={<Share2 className="h-3.5 w-3.5" />}
              >
                Share
              </Button>
            )}

            {/* More Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit project details
                  </DropdownMenuItem>
                )}
                {isPublic && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewPublic}>
                      <Globe className="h-3.5 w-3.5 mr-2" />
                      View public page
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  Back to Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
