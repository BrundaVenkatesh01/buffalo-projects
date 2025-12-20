"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { Badge, Button, LegacyButton } from "@/components/unified";
import { getStageConfig } from "@/constants/stages";
import {
  ArrowLeft,
  MapPin,
  Circle,
  ExternalLink,
  Github,
  Share2,
  Globe,
  ChevronRight,
  Home,
  User,
} from "@/icons";
import { cn } from "@/lib/utils";
import {
  PROJECT_ANIMATIONS,
  PROJECT_PAGE,
} from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

/**
 * ProjectHero Component
 *
 * Dramatic, visual-first hero section.
 * - Optional cover image overlay
 * - Large typography (4xl → 7xl)
 * - Primary action buttons
 * - Stage progress timeline
 */

export interface ProjectHeroProps {
  workspace: Workspace;
  onBack?: () => void;
  metadata?: {
    updatedDate?: string;
    views?: number;
    appreciations?: number;
  };
  showCoverImage?: boolean;
  showStageProgress?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ProjectHero({
  workspace,
  onBack,
  metadata: _metadata,
  showCoverImage = true,
  showStageProgress: _showStageProgress = true, // Deprecated - showcase, not track
  showActions = true,
  className,
}: ProjectHeroProps) {
  const stageConfig = workspace.stage ? getStageConfig(workspace.stage) : null;
  const isBuffaloAffiliated = Boolean(
    workspace.buffaloAffiliated || workspace.location === "buffalo",
  );
  const locationLabel =
    workspace.location === "buffalo"
      ? "Buffalo, NY"
      : workspace.location === "remote"
        ? "Remote"
        : null;
  const oneLiner =
    workspace.oneLiner || workspace.description || workspace.projectDescription;

  // Primary actions
  const primaryActions = [];
  if (workspace.embeds?.demo) {
    primaryActions.push({
      label: "View Demo",
      url: workspace.embeds.demo,
      icon: ExternalLink,
      variant: "default" as const,
    });
  }
  if (workspace.embeds?.github?.repoUrl) {
    primaryActions.push({
      label: "View Source",
      url: workspace.embeds.github.repoUrl,
      icon: Github,
      variant: "outline" as const,
    });
  }
  if (workspace.embeds?.website) {
    primaryActions.push({
      label: "Visit Website",
      url: workspace.embeds.website,
      icon: Globe,
      variant: "outline" as const,
    });
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: workspace.projectName, url: window.location.href })
        .catch(() => {
          void navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied");
        });
    } else {
      void navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    }
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        // Reduced mobile height, taller on desktop
        "min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh]",
        className,
      )}
    >
      {/* Cover Image Background with improved overlay */}
      {showCoverImage && workspace.assets?.coverImage && (
        <>
          <div className="absolute inset-0">
            <img
              src={workspace.assets.coverImage}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Improved gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
        </>
      )}

      {/* Gradient Background (fallback when no cover image) */}
      {!workspace.assets?.coverImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20" />
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-[50vh] flex-col justify-between py-8 md:min-h-[55vh] md:py-12 lg:min-h-[60vh] lg:py-16">
        <div
          className={cn(
            PROJECT_PAGE.section.maxWidth,
            "mx-auto w-full",
            PROJECT_PAGE.section.padding.desktop,
            `${PROJECT_PAGE.breakpoints.md}${PROJECT_PAGE.section.padding.mobile}`,
          )}
        >
          {/* Breadcrumbs */}
          <m.nav
            initial={PROJECT_ANIMATIONS.entrance.hero.initial}
            animate={PROJECT_ANIMATIONS.entrance.hero.animate}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <Link
              href="/dashboard/discover"
              className="transition-colors hover:text-foreground"
            >
              Discover
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span className="font-medium text-foreground">
              {workspace.projectName || "Project"}
            </span>
          </m.nav>

          {/* Optional Back Button (below breadcrumbs) */}
          {onBack && (
            <m.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </m.div>
          )}

          {/* Badges with animation */}
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {stageConfig && (
              <Badge className="bg-primary/90 backdrop-blur-sm">
                <Circle className="mr-1 h-3 w-3 fill-current" />
                {stageConfig.label}
              </Badge>
            )}
            {isBuffaloAffiliated && (
              <Badge variant="secondary" className="backdrop-blur-sm">
                🦬 Buffalo
              </Badge>
            )}
            {locationLabel && (
              <Badge variant="outline" className="backdrop-blur-sm">
                <MapPin className="mr-1 h-3 w-3" />
                {locationLabel}
              </Badge>
            )}
            {workspace.creator && (
              <Badge variant="outline" className="backdrop-blur-sm">
                <User className="mr-1 h-3 w-3" />
                {workspace.creator}
              </Badge>
            )}
          </m.div>

          {/* Title - Dramatic Typography with animation */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              // Slightly reduced mobile size for better mobile UX
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
              PROJECT_PAGE.hero.title.weight,
              PROJECT_PAGE.hero.title.tracking,
              PROJECT_PAGE.hero.title.leading,
              "mb-4 text-foreground md:mb-6",
            )}
          >
            {workspace.projectName || "Untitled Project"}
          </m.h1>

          {/* One-liner - Subtitle with animation */}
          {oneLiner && (
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={cn(
                "text-base md:text-lg lg:text-xl",
                PROJECT_PAGE.hero.subtitle.weight,
                PROJECT_PAGE.hero.subtitle.leading,
                "mb-6 max-w-3xl text-muted-foreground md:mb-8",
              )}
            >
              {oneLiner}
            </m.p>
          )}

          {/* Primary Actions with staggered animation */}
          {showActions && primaryActions.length > 0 && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-6 flex flex-wrap gap-3 md:mb-8"
            >
              {primaryActions.map((action, index) => (
                <m.div
                  key={action.url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <LegacyButton
                    variant={action.variant}
                    size="lg"
                    asChild
                    className="backdrop-blur-sm"
                  >
                    <a
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <action.icon className="mr-2 h-5 w-5" />
                      {action.label}
                    </a>
                  </LegacyButton>
                </m.div>
              ))}
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + primaryActions.length * 0.1,
                }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleShare}
                  className="backdrop-blur-sm"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </m.div>
            </m.div>
          )}

          {/* Stage Progress removed - showcase, not track */}
        </div>
      </div>
    </section>
  );
}
