"use client";

import { m } from "framer-motion";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  STAGE_COLORS,
} from "@/components/unified";
import { getStageConfig } from "@/constants/stages";
import {
  Calendar,
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  Globe,
  Lock,
  MoreVertical,
  Edit,
  Trash2,
} from "@/icons";
import { cn } from "@/lib/utils";
import { BUFFALO_BRAND } from "@/tokens/brand";
import type { Workspace } from "@/types";
import { getPublicProjectUrl, getProjectEditorUrl } from "@/utils/projectUrls";

/**
 * ProjectCard Component
 *
 * Unified, reusable project card used across the application.
 * Supports multiple display variants for different contexts.
 *
 * Features:
 * - Three size variants (compact, medium, full)
 * - Stage, location, and visibility badges
 * - Cover image support with fallback gradient
 * - Tags display with overflow indicator
 * - Stats display (views, appreciations, comments)
 * - Hover animations and effects
 * - Consistent navigation using project URL utilities
 * - Read-only display (no state mutations)
 */

export interface ProjectCardProps {
  /** Workspace data to display */
  workspace: Workspace;

  /** Display variant */
  variant?: "compact" | "medium" | "full";

  /** Context for URL generation */
  context?: "public" | "editor";

  /** Dashboard-specific action handlers */
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspace: Workspace) => void;
  onViewPublic?: (workspace: Workspace) => void;
  onToggleVisibility?: (workspace: Workspace) => void;

  /** Optional animation delay for staggered entrance */
  animationDelay?: number;

  /** Optional className for customization */
  className?: string;
}

export function ProjectCard({
  workspace,
  variant = "medium",
  context = "public",
  onEdit,
  onDelete,
  onViewPublic,
  onToggleVisibility,
  animationDelay = 0,
  className,
}: ProjectCardProps) {
  // Determine the appropriate URL based on context
  const projectUrl =
    context === "public"
      ? getPublicProjectUrl(workspace)
      : getProjectEditorUrl(workspace);

  // Get stage configuration
  const stageConfig = workspace.stage ? getStageConfig(workspace.stage) : null;

  // Format dates
  const publishedDate = workspace.publishedAt
    ? new Date(workspace.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const lastModified = workspace.lastModified
    ? new Date(workspace.lastModified).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Variant-specific styles
  const variantStyles = {
    compact: {
      container: "h-full",
      card: "p-4",
      header: "pb-2",
      title: "text-base",
      description: "text-xs line-clamp-2",
      badge: "text-[10px] py-0 h-4",
      iconSize: "h-2.5 w-2.5",
    },
    medium: {
      container: "h-full",
      card: "p-6",
      header: "pb-3",
      title: "text-lg",
      description: "text-sm line-clamp-3",
      badge: "text-xs px-2 py-1",
      iconSize: "h-3 w-3",
    },
    full: {
      container: "h-full",
      card: "p-8",
      header: "pb-4",
      title: "text-xl",
      description: "text-base line-clamp-4",
      badge: "text-sm px-3 py-1.5",
      iconSize: "h-4 w-4",
    },
  }[variant];

  // Generate gradient based on project name
  const getProjectGradient = (name: string) => {
    const gradients = [
      "from-blue-500/20 via-purple-500/20 to-pink-500/20",
      "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
      "from-green-500/20 via-teal-500/20 to-blue-500/20",
      "from-orange-500/20 via-red-500/20 to-pink-500/20",
      "from-violet-500/20 via-purple-500/20 to-blue-500/20",
      "from-emerald-500/20 via-green-500/20 to-cyan-500/20",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <m.div
      className={cn(variantStyles.container, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
    >
      <Link href={projectUrl} className="block h-full">
        <Card
          className={cn(
            "group h-full relative overflow-hidden",
            "border border-white/[0.06] bg-white/[0.02]",
            "hover:border-white/[0.12] hover:bg-white/[0.03]",
            "hover:shadow-2xl hover:shadow-black/20",
            "transition-all duration-300 ease-out",
            variantStyles.card,
          )}
        >
          {/* Cover Image or Gradient Placeholder */}
          {variant !== "compact" && (
            <div className="relative w-full h-48 -mt-6 -mx-6 mb-6 overflow-hidden">
              {workspace.assets?.coverImage ? (
                <>
                  <img
                    src={workspace.assets.coverImage}
                    alt={workspace.projectName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </>
              ) : (
                <div
                  className={cn(
                    "w-full h-full bg-gradient-to-br",
                    getProjectGradient(workspace.projectName),
                    "relative flex items-center justify-center",
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
                  <div className="relative text-6xl font-bold text-white/10">
                    {workspace.projectName.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          )}

          <CardHeader className={cn(variantStyles.header, "space-y-2")}>
            {/* Badges Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Stage Badge */}
              {stageConfig && (
                <Badge
                  className={cn(
                    "border",
                    variantStyles.badge,
                    stageConfig.colors.className,
                  )}
                >
                  {variant === "full" && (
                    <stageConfig.icon
                      className={cn(variantStyles.iconSize, "mr-1")}
                    />
                  )}
                  {stageConfig.label}
                </Badge>
              )}

              {/* Location Badge */}
              {workspace.location === "buffalo" && (
                <Badge
                  className={cn(
                    "border",
                    variantStyles.badge,
                    STAGE_COLORS.idea.className,
                  )}
                >
                  <MapPin className={cn(variantStyles.iconSize, "mr-1")} />
                  Buffalo
                </Badge>
              )}

              {/* Project Type Badge removed - all projects are unified now */}

              {/* Visibility Badge - Always show for clarity */}
              {workspace.isPublic ? (
                <Badge
                  variant="outline"
                  className={cn(variantStyles.badge, "font-medium")}
                  style={{
                    color: BUFFALO_BRAND.status.success,
                    borderColor: `${BUFFALO_BRAND.status.success}50`,
                    backgroundColor: `${BUFFALO_BRAND.status.success}15`,
                  }}
                >
                  <Globe className={cn(variantStyles.iconSize, "mr-0.5")} />
                  Public
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={cn(variantStyles.badge, "font-medium")}
                  style={{
                    color: BUFFALO_BRAND.text.secondary,
                    borderColor: BUFFALO_BRAND.border.default,
                    backgroundColor: BUFFALO_BRAND.dark.surface,
                  }}
                >
                  Private
                </Badge>
              )}

              {/* 26 under 26 Badge */}
              {workspace.isForTwentySix && (
                <Badge
                  variant="outline"
                  className={cn(variantStyles.badge, "font-semibold")}
                  style={{
                    color: BUFFALO_BRAND.status.warning,
                    borderColor: `${BUFFALO_BRAND.status.warning}60`,
                    backgroundColor: `${BUFFALO_BRAND.status.warning}20`,
                  }}
                >
                  ✨ &apos;26
                </Badge>
              )}

              {/* Actions Menu */}
              {(onEdit || onDelete || onViewPublic) &&
                variant === "compact" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="ml-auto p-1 hover:bg-muted rounded transition-colors opacity-60 group-hover:opacity-100"
                        aria-label="Project actions"
                      >
                        <MoreVertical className={variantStyles.iconSize} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(workspace);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5 mr-2" />
                          Edit workspace
                        </DropdownMenuItem>
                      )}
                      {onViewPublic && workspace.isPublic && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onViewPublic(workspace);
                          }}
                        >
                          <Globe className="h-3.5 w-3.5 mr-2" />
                          View public page
                        </DropdownMenuItem>
                      )}
                      {/* Visibility Toggle - Make Private / Publish */}
                      {onToggleVisibility && (
                        workspace.isPublic ? (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleVisibility(workspace);
                            }}
                            className="text-amber-400 focus:text-amber-300"
                          >
                            <Lock className="h-3.5 w-3.5 mr-2" />
                            Make private
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleVisibility(workspace);
                            }}
                            className="text-emerald-400 focus:text-emerald-300"
                          >
                            <Globe className="h-3.5 w-3.5 mr-2" />
                            Publish to gallery
                          </DropdownMenuItem>
                        )
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(workspace);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete project
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>

            {/* Project Title */}
            <CardTitle
              className={cn(
                "group-hover:text-white transition-colors duration-200",
                "line-clamp-2 font-semibold tracking-tight",
                variantStyles.title,
              )}
            >
              {workspace.projectName || "Untitled Project"}
            </CardTitle>

            {/* Project Description */}
            {(workspace.oneLiner || workspace.description) && (
              <CardDescription
                className={cn(
                  variantStyles.description,
                  "text-neutral-400 leading-relaxed",
                )}
              >
                {workspace.oneLiner ||
                  workspace.description ||
                  "Building something new..."}
              </CardDescription>
            )}
          </CardHeader>

          {/* Card Content */}
          {variant !== "compact" && (
            <CardContent className="space-y-4">
              {/* Gives Section */}
              {workspace.gives && workspace.gives.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    GIVES
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {workspace.gives.slice(0, 2).map((give) => (
                      <span
                        key={give}
                        className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium"
                      >
                        {give}
                      </span>
                    ))}
                    {workspace.gives.length > 2 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        +{workspace.gives.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {workspace.tags && workspace.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {workspace.tags
                    .slice(0, variant === "full" ? 5 : 3)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-neutral-400 border border-white/[0.08] hover:border-white/[0.15] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  {workspace.tags.length > (variant === "full" ? 5 : 3) && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-neutral-400 border border-white/[0.08]">
                      +{workspace.tags.length - (variant === "full" ? 5 : 3)}
                    </span>
                  )}
                </div>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-4 pt-2 text-xs text-neutral-500 border-t border-white/[0.05]">
                {/* Views */}
                {workspace.views !== undefined && workspace.views > 0 && (
                  <div className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                    <Eye className={cn(variantStyles.iconSize, "opacity-60")} />
                    <span className="font-medium">{workspace.views}</span>
                  </div>
                )}

                {/* Appreciations */}
                {workspace.appreciations !== undefined &&
                  workspace.appreciations > 0 && (
                    <div className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                      <Heart
                        className={cn(variantStyles.iconSize, "opacity-60")}
                      />
                      <span className="font-medium">
                        {workspace.appreciations}
                      </span>
                    </div>
                  )}

                {/* Comments */}
                {workspace.commentCount !== undefined &&
                  workspace.commentCount > 0 && (
                    <div className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                      <MessageCircle
                        className={cn(variantStyles.iconSize, "opacity-60")}
                      />
                      <span className="font-medium">
                        {workspace.commentCount}
                      </span>
                    </div>
                  )}

                {/* Published/Modified Date */}
                {(publishedDate || lastModified) && (
                  <div className="flex items-center gap-1.5 ml-auto text-neutral-600">
                    <Calendar className={cn(variantStyles.iconSize)} />
                    <span className="text-[11px]">
                      {publishedDate || lastModified}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </Link>
    </m.div>
  );
}
