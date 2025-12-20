"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge, Button } from "@/components/unified";
import { BMC_FIELDS } from "@/constants/bmcFields";
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  Github,
  Globe,
  Lock,
  Pencil,
  Share2,
  Star,
} from "@/icons";
import { BUFFALO_BLUE } from "@/tokens";
import { BUFFALO_BRAND } from "@/tokens/brand";
import type { Workspace } from "@/types";

interface ProjectDetailViewProps {
  workspace: Workspace;
  onShare?: () => void;
}

/**
 * Portfolio-style project showcase
 * Visual-first design for presenting projects like a portfolio case study
 */
export function ProjectDetailView({
  workspace,
  onShare,
}: ProjectDetailViewProps) {
  const router = useRouter();
  const [showFullCanvas, setShowFullCanvas] = useState(false);
  const isPublic = workspace.isPublic;
  const isForTwentySix = workspace.isForTwentySix;

  // Extract project links
  const hasDemo = Boolean(workspace.embeds?.demo || workspace.embeds?.website);
  const hasGitHub = Boolean(workspace.embeds?.github?.repoUrl);
  const demoUrl = workspace.embeds?.demo || workspace.embeds?.website;
  const githubUrl = workspace.embeds?.github?.repoUrl;
  const githubStats = workspace.githubStats;

  const createdDate = useMemo(() => {
    if (!workspace.createdAt) {
      return null;
    }
    const parsed = new Date(workspace.createdAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [workspace.createdAt]);

  const lastModified = workspace.lastModified
    ? new Date(workspace.lastModified).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Get completed BMC blocks
  const completedBlocks = useMemo(() => {
    return BMC_FIELDS.filter((field) => {
      const value = workspace.bmcData?.[field.id];
      return value && value.trim().length > 0;
    });
  }, [workspace.bmcData]);

  // Get all visual content
  const imageDocuments = useMemo(() => {
    return (workspace.documents ?? []).filter(
      (doc) =>
        doc.type === "image" || doc.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i),
    );
  }, [workspace.documents]);

  // Collect all visual assets (cover, screenshots, embeds)
  const allVisuals = useMemo(() => {
    const visuals: Array<{
      type: string;
      url: string;
      title: string;
      id?: string;
    }> = [];

    // Cover image
    if (workspace.assets?.coverImage) {
      visuals.push({
        type: "cover",
        url: workspace.assets.coverImage,
        title: "Cover Image",
      });
    }

    // Screenshots from assets
    if (
      workspace.assets?.screenshots &&
      workspace.assets.screenshots.length > 0
    ) {
      workspace.assets.screenshots.forEach((url, idx) => {
        visuals.push({
          type: "screenshot",
          url,
          title: `Screenshot ${idx + 1}`,
        });
      });
    }

    // Image documents
    imageDocuments.forEach((doc) => {
      if (doc.url) {
        visuals.push({
          type: "document",
          url: doc.url,
          title: doc.name,
          id: doc.id,
        });
      }
    });

    return visuals;
  }, [workspace.assets, imageDocuments]);

  // Get embed previews
  const embedPreviews = useMemo(() => {
    const previews = [];

    if (workspace.embeds?.website) {
      previews.push({
        type: "website",
        url: workspace.embeds.website,
        title: "Live Website",
        icon: <Globe className="h-5 w-5" />,
      });
    }

    if (
      workspace.embeds?.demo &&
      workspace.embeds.demo !== workspace.embeds.website
    ) {
      previews.push({
        type: "demo",
        url: workspace.embeds.demo,
        title: "Demo",
        icon: <ExternalLink className="h-5 w-5" />,
      });
    }

    if (workspace.embeds?.github?.repoUrl) {
      previews.push({
        type: "github",
        url: workspace.embeds.github.repoUrl,
        title: "Source Code",
        icon: <Github className="h-5 w-5" />,
      });
    }

    return previews;
  }, [workspace.embeds]);

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
    <div className="min-h-screen">
      {/* ===== HERO SECTION - Full Width ===== */}
      <div className="relative bg-gradient-to-b from-muted/30 to-background">
        {/* Cover Image Background (if available) */}
        {workspace.assets?.coverImage && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={workspace.assets.coverImage}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
          </div>
        )}

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          {/* Back Link */}
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            ← Back to Dashboard
          </button>

          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {isPublic ? (
              <button
                onClick={handleViewPublic}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full border transition-all hover:scale-105"
                style={{
                  color: BUFFALO_BRAND.status.success,
                  borderColor: `${BUFFALO_BRAND.status.success}40`,
                  backgroundColor: `${BUFFALO_BRAND.status.success}15`,
                }}
              >
                <Globe className="h-3.5 w-3.5" />
                Public
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full border border-border bg-muted">
                <Lock className="h-3.5 w-3.5" />
                Private
              </div>
            )}
            {isForTwentySix && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full border"
                style={{
                  color: BUFFALO_BRAND.status.warning,
                  borderColor: `${BUFFALO_BRAND.status.warning}60`,
                  backgroundColor: `${BUFFALO_BRAND.status.warning}20`,
                }}
              >
                ✨ 26 under 26
              </div>
            )}
            {githubStats?.language && (
              <Badge
                variant="secondary"
                className="text-sm font-medium px-3 py-1"
                style={{ backgroundColor: BUFFALO_BLUE, color: "white" }}
              >
                {githubStats.language}
              </Badge>
            )}
          </div>

          {/* Project Name - Big & Bold */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 leading-[1.05] tracking-tight">
            {workspace.projectName}
          </h1>

          {/* One-liner - Large subheading */}
          {workspace.oneLiner && (
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/90 font-light leading-relaxed mb-8 max-w-3xl">
              {workspace.oneLiner}
            </p>
          )}

          {/* Primary CTAs - Balanced sizing */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {hasDemo && (
              <Button
                size="lg"
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() =>
                  window.open(demoUrl, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Demo
              </Button>
            )}
            {hasGitHub && (
              <Button
                size="lg"
                variant="outline"
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 hover:border-primary/50 transition-all duration-200"
                onClick={() =>
                  window.open(githubUrl, "_blank", "noopener,noreferrer")
                }
              >
                <Github className="h-4 w-4 mr-2" />
                View Source
              </Button>
            )}
            {onShare && (
              <Button
                size="lg"
                variant="ghost"
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-muted/50 transition-all duration-200"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>

          {/* Subtle workspace option - Always accessible, never pushy */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <span>Want to add business model thinking?</span>
            <button
              onClick={() => router.push(`/edit/${workspace.code}`)}
              className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-4 transition-all duration-200"
            >
              <Pencil className="h-3.5 w-3.5" />
              Open workspace
            </button>
          </div>

          {/* Social Proof - Refined spacing */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap text-sm sm:text-base text-muted-foreground">
            {githubStats && githubStats.stars > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-foreground text-lg sm:text-xl">
                  {githubStats.stars.toLocaleString()}
                </span>
                <span>stars</span>
              </div>
            )}
            {githubStats && githubStats.forks > 0 && (
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-bold text-foreground text-lg sm:text-xl">
                  {githubStats.forks.toLocaleString()}
                </span>
                <span>forks</span>
              </div>
            )}
            {workspace.views && workspace.views > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-bold text-foreground text-lg sm:text-xl">
                  {workspace.views.toLocaleString()}
                </span>
                <span>{workspace.views === 1 ? "view" : "views"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT - Max width, flowing ===== */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 space-y-16 sm:space-y-20">
        {/* ===== LINK PREVIEWS - Show embeds with visual cards ===== */}
        {embedPreviews.length > 0 && (
          <section>
            <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4 sm:mb-6">
              Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {embedPreviews.map((preview) => (
                <button
                  key={preview.url}
                  onClick={() =>
                    window.open(preview.url, "_blank", "noopener,noreferrer")
                  }
                  className="group relative aspect-[2/1] rounded-lg sm:rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md bg-gradient-to-br from-muted/30 to-muted/20 hover:scale-[1.01]"
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    <div className="mb-2 sm:mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                      {preview.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                      {preview.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate max-w-full px-2 sm:px-4">
                      {new URL(preview.url).hostname}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                      <ExternalLink className="h-3 w-3" />
                      <span className="hidden sm:inline">Open link</span>
                      <span className="sm:hidden">Open</span>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ===== VISUAL GALLERY - All images ===== */}
        {allVisuals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                Gallery
              </h2>
              <Badge variant="secondary" className="text-xs">
                {allVisuals.length}{" "}
                {allVisuals.length === 1 ? "image" : "images"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {allVisuals.map((visual, idx) => (
                <div
                  key={visual.id || `${visual.type}-${idx}`}
                  className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-muted group cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md ring-1 ring-border/50 hover:ring-primary/30"
                  onClick={() => window.open(visual.url, "_blank")}
                >
                  <img
                    src={visual.url}
                    alt={visual.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">
                        {visual.title}
                      </p>
                      {visual.type === "cover" && (
                        <p className="text-white/70 text-xs mt-0.5 sm:mt-1">
                          Cover Image
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Type indicator badge */}
                  {visual.type === "cover" && (
                    <div className="absolute top-2 left-2 bg-primary/95 backdrop-blur-sm text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== OPTIONAL WORKSPACE UPGRADE - Only if truly empty ===== */}
        {allVisuals.length === 0 &&
          embedPreviews.length === 0 &&
          !workspace.projectDescription &&
          !workspace.description &&
          completedBlocks.length === 0 && (
            <section>
              <div className="text-center py-12 px-6 rounded-xl border border-border/50 bg-muted/10">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Want to dive deeper?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                  Use the workspace editor to add business model thinking,
                  evidence documents, and track your project journey.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/edit/${workspace.code}`)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Explore Workspace Features
                </Button>
              </div>
            </section>
          )}

        {/* ===== ABOUT - Flowing prose ===== */}
        {(workspace.projectDescription || workspace.description) && (
          <section>
            <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4 sm:mb-6">
              About
            </h2>
            <div className="prose prose-base sm:prose-lg max-w-none">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                {workspace.projectDescription || workspace.description}
              </p>
            </div>
          </section>
        )}

        {/* ===== TECH STACK - Inline badges ===== */}
        {githubStats?.topics && githubStats.topics.length > 0 && (
          <section>
            <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4 sm:mb-6">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {githubStats.topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-full hover:scale-105 transition-transform duration-200"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            {githubStats.license && (
              <p className="mt-4 sm:mt-6 text-sm text-muted-foreground">
                Licensed under{" "}
                <span className="font-medium text-foreground">
                  {githubStats.license}
                </span>
              </p>
            )}
          </section>
        )}

        {/* ===== BUSINESS MODEL - Collapsible ===== */}
        {completedBlocks.length > 0 && (
          <section>
            <button
              onClick={() => setShowFullCanvas(!showFullCanvas)}
              className="flex items-center justify-between w-full group mb-4 sm:mb-6 hover:opacity-80 transition-opacity duration-200"
            >
              <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-200">
                Business Model Canvas
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {completedBlocks.length} of {BMC_FIELDS.length} blocks
                </span>
                <ChevronDown
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-300 ${
                    showFullCanvas ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {showFullCanvas && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4 animate-in fade-in duration-300">
                {completedBlocks.map((field) => {
                  const value = workspace.bmcData?.[field.id];
                  return (
                    <div
                      key={field.id}
                      className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">
                        {field.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground italic">
                        {field.hint}
                      </p>
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                        {value}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ===== SUPPORTING DOCUMENTS - Simple list ===== */}
        {workspace.documents && workspace.documents.length > 0 && (
          <section>
            <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4 sm:mb-6">
              Supporting Documents
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {workspace.documents
                .filter(
                  (doc) =>
                    doc.type !== "image" &&
                    !doc.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i),
                )
                .slice(0, 8)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 py-3 sm:py-4 px-3 sm:px-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all duration-200"
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-foreground truncate">
                        {doc.name}
                      </p>
                      {doc.linkedFields && doc.linkedFields.length > 0 && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Linked to {doc.linkedFields.length} canvas block
                          {doc.linkedFields.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* ===== FOOTER METADATA ===== */}
      <div className="border-t border-border/30 bg-muted/10 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {createdDate && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {createdDate.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {lastModified && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50">•</span>
                  <span>Updated {lastModified}</span>
                </div>
              )}
              {workspace.versions && workspace.versions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50">•</span>
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>{workspace.versions.length}</span>
                </div>
              )}
            </div>
            <code className="text-xs font-mono text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded">
              {workspace.code}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
