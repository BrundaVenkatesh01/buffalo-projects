"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";

import { StageProgressBar } from "./StageProgressBar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui-next";
import { Button } from "@/components/ui-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui-next";
import { ExternalLink, Eye, Globe, Lock, MoreVertical, Pencil, Trash2 } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspace: Workspace) => void;
  onViewPublic?: (workspace: Workspace) => void;
  onToggleVisibility?: (workspace: Workspace) => void;
  className?: string;
  showStageTimeline?: boolean;
}

/**
 * WorkspaceCard Component
 *
 * Displays a workspace in card format with:
 * - Project name and description
 * - Stage progress indicator
 * - Last modified timestamp
 * - Public/private visibility badge
 * - Quick actions menu (edit, delete, view public)
 * - Tags
 *
 * Used in:
 * - Profile page workspace list
 * - Workspace shelf/dashboard
 * - Search results
 */
export function WorkspaceCard({
  workspace,
  onEdit,
  onDelete,
  onViewPublic,
  onToggleVisibility,
  className,
  showStageTimeline = true,
}: WorkspaceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const lastModifiedLabel = workspace.lastModified
    ? formatDistanceToNow(new Date(workspace.lastModified), { addSuffix: true })
    : "Recently";

  const isPaused =
    workspace.lastModified &&
    Date.now() - new Date(workspace.lastModified).getTime() >
      6 * 30 * 24 * 60 * 60 * 1000; // 6 months

  // Route to appropriate page based on project type
  const projectUrl =
    workspace.projectType === "showcase"
      ? `/showcase/${workspace.code}`
      : `/project/${workspace.code}`;

  const publicUrl = workspace.slug ? `/p/${workspace.slug}` : null;

  // Determine project type display
  const isShowcase = workspace.projectType === "showcase";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-white/10 bg-white/[0.02] transition-all hover:border-white/20 hover:bg-white/[0.04] cursor-pointer",
        className,
      )}
    >
      <Link href={projectUrl} className="block">
        <CardContent className="space-y-4 p-6">
          {/* Header: Title + Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg text-foreground transition-colors group-hover:text-primary">
                  {workspace.projectName || "Untitled Project"}
                </CardTitle>

                {/* Project Type Badge */}
                {isShowcase ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-purple-500/30 bg-purple-500/10 text-purple-400"
                  >
                    Showcase
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-full border-blue-500/30 bg-blue-500/10 text-blue-400"
                  >
                    Workspace
                  </Badge>
                )}

                {/* Visibility Badge */}
                {workspace.isPublic ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-green-500/30 bg-green-500/10 text-green-400"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Public
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 text-muted-foreground"
                  >
                    <Lock className="mr-1 h-3 w-3" />
                    Private
                  </Badge>
                )}

                {isPaused && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                  >
                    Paused
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                {workspace.description ||
                  workspace.oneLiner ||
                  "No description yet"}
              </CardDescription>
            </div>

            {/* Actions Menu */}
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                  aria-label="Workspace actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit?.(workspace);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit project
                </DropdownMenuItem>
                {workspace.isPublic && publicUrl && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      onViewPublic?.(workspace);
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View public page
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {/* Visibility Toggle - Make Private / Publish */}
                {onToggleVisibility && (
                  workspace.isPublic ? (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        onToggleVisibility(workspace);
                      }}
                      className="text-amber-400 focus:text-amber-300"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Make private
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        onToggleVisibility(workspace);
                      }}
                      className="text-emerald-400 focus:text-emerald-300"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Publish to gallery
                    </DropdownMenuItem>
                  )
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete?.(workspace);
                  }}
                  className="text-red-400 focus:text-red-300"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stage Timeline */}
          {showStageTimeline && workspace.stage && (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <StageProgressBar
                currentStage={workspace.stage}
                size="sm"
                showLabels={false}
              />
            </div>
          )}

          {/* Tags */}
          {workspace.tags && workspace.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {workspace.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full bg-white/5 text-xs text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
              {workspace.tags.length > 4 && (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white/5 text-xs text-muted-foreground"
                >
                  +{workspace.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer: Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Updated {lastModifiedLabel}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
