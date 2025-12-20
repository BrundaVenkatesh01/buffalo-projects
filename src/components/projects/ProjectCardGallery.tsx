"use client";

import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/unified";
import { Eye, MessageCircle, Heart, ExternalLink } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace, ProjectCategory } from "@/types";
import { getPublicProjectUrl } from "@/utils/projectUrls";

/**
 * ProjectCardGallery - Portfolio-first project card for discovery
 *
 * Optimized for visual showcase with:
 * - Large hero image (cover or first screenshot)
 * - Prominent project name and one-liner
 * - Creator attribution
 * - Category and stage badges
 * - Gives/asks preview
 * - Subtle metrics
 * - Hover overlay with "View Project" CTA
 */

export interface ProjectCardGalleryProps {
  workspace: Workspace;
  animationDelay?: number;
  className?: string;
  showMatch?: boolean;
  matchScore?: number;
}

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  startup: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  research: "bg-green-500/10 text-green-400 border-green-500/20",
  indie: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "open-source": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  creative: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  startup: "Startup",
  design: "Design",
  research: "Research",
  indie: "Indie",
  "open-source": "Open Source",
  creative: "Creative",
  other: "Other",
};

export function ProjectCardGallery({
  workspace,
  animationDelay = 0,
  className,
  showMatch = false,
  matchScore = 0,
}: ProjectCardGalleryProps) {
  const projectUrl = getPublicProjectUrl(workspace);

  // Get hero image (cover image or first screenshot)
  const heroImage =
    workspace.assets?.coverImage || workspace.assets?.screenshots?.[0] || null;

  // Get creator initial for avatar
  const creatorInitial = (workspace.creator || "U").charAt(0).toUpperCase();

  // Category badge styling
  const categoryStyle = workspace.category
    ? CATEGORY_COLORS[workspace.category]
    : CATEGORY_COLORS.other;
  const categoryLabel = workspace.category
    ? CATEGORY_LABELS[workspace.category]
    : "Other";

  return (
    <m.div
      className={cn("group relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
    >
      <Link href={projectUrl} className="block">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
          {/* Hero Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-background">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={workspace.projectName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl font-bold text-white/10">
                {workspace.projectName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

            {/* Match Badge (if applicable) */}
            {showMatch && matchScore > 0 && (
              <div className="absolute top-4 right-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                {matchScore === 1 && "Match"}
                {matchScore === 2 && "Good Match"}
                {matchScore >= 3 && "Perfect Match"}
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-2xl">
                View Project
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Badges Row */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {/* Category Badge */}
              <Badge variant="outline" className={cn("text-xs", categoryStyle)}>
                {categoryLabel}
              </Badge>

              {/* Stage Badge */}
              {workspace.stage && (
                <Badge
                  variant="outline"
                  className="border-white/[0.1] bg-white/[0.05] text-xs capitalize"
                >
                  {workspace.stage}
                </Badge>
              )}

              {/* Buffalo Badge */}
              {workspace.buffaloAffiliated && (
                <Badge
                  variant="outline"
                  className="border-white/[0.1] bg-white/[0.05] text-xs"
                >
                  🦬 Buffalo
                </Badge>
              )}
            </div>

            {/* Project Name */}
            <h3 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {workspace.projectName}
            </h3>

            {/* One-liner */}
            {workspace.oneLiner && (
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {workspace.oneLiner}
              </p>
            )}

            {/* Creator Attribution */}
            {workspace.creator && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {creatorInitial}
                </div>
                <span className="text-xs text-muted-foreground">
                  by{" "}
                  <span className="font-medium text-foreground">
                    {workspace.creator}
                  </span>
                </span>
              </div>
            )}

            {/* Gives/Asks Preview */}
            {((workspace.gives && workspace.gives.length > 0) ||
              (workspace.asks && workspace.asks.length > 0)) && (
              <div className="mb-4 space-y-2">
                {/* Gives */}
                {workspace.gives && workspace.gives.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-green-400">
                      Gives:
                    </span>
                    {workspace.gives.slice(0, 2).map((give) => (
                      <span
                        key={give}
                        className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400 border border-green-500/20"
                      >
                        {give}
                      </span>
                    ))}
                    {workspace.gives.length > 2 && (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400 border border-green-500/20">
                        +{workspace.gives.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Asks */}
                {workspace.asks && workspace.asks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-blue-400">
                      Asks:
                    </span>
                    {workspace.asks.slice(0, 2).map((ask) => (
                      <span
                        key={ask}
                        className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400 border border-blue-500/20"
                      >
                        {ask}
                      </span>
                    ))}
                    {workspace.asks.length > 2 && (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400 border border-blue-500/20">
                        +{workspace.asks.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Metrics Row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {workspace.views !== undefined && workspace.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{workspace.views}</span>
                </div>
              )}

              {workspace.commentCount !== undefined &&
                workspace.commentCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{workspace.commentCount}</span>
                  </div>
                )}

              {workspace.appreciations !== undefined &&
                workspace.appreciations > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{workspace.appreciations}</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Link>
    </m.div>
  );
}
