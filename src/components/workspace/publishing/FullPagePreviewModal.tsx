/**
 * Full Page Preview Modal
 *
 * Shows a full-page preview of how the project will appear when published.
 * Provides confidence before publishing by showing exactly what visitors will see.
 */

"use client";

import { usePublishForm } from "./PublishFormContext";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge, Button, Card, CardContent, ScrollArea } from "@/components/unified";
import { getStageConfig } from "@/constants/stages";
import {
  X,
  Globe,
  Lock,
  ExternalLink,
  Github,
  Video,
  Gift,
  HandHelping,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "@/icons";
import { cn } from "@/lib/utils";
import { BUFFALO_BRAND } from "@/tokens/brand";

interface FullPagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullPagePreviewModal({
  isOpen,
  onClose,
}: FullPagePreviewModalProps) {
  const { state, workspace } = usePublishForm();

  // Get stage configuration
  const stageConfig = state.stage ? getStageConfig(state.stage) : null;

  // Get cover image from workspace
  const coverImage = workspace.assets?.coverImage;

  // Calculate completeness for the preview
  const completeness = {
    hasName: Boolean(state.projectName),
    hasOneLiner: Boolean(state.oneLiner),
    hasDescription: Boolean(state.description),
    hasCoverImage: Boolean(coverImage),
    hasTags: state.tags.length > 0,
    hasLinks: Boolean(workspace.embeds?.github || workspace.embeds?.website || workspace.embeds?.demo),
    hasGivesAsks: (state.gives?.length ?? 0) > 0 || (state.asks?.length ?? 0) > 0,
  };

  const completenessScore = Object.values(completeness).filter(Boolean).length;
  const totalFields = Object.keys(completeness).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl">
        {/* Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-background/90 backdrop-blur-lg px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Full Page Preview</h2>
              <p className="text-xs text-muted-foreground">
                This is how your project will appear to visitors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Completeness indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className={cn(
                "font-medium",
                completenessScore === totalFields ? "text-emerald-400" : "text-amber-400"
              )}>
                {completenessScore}/{totalFields} complete
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              {/* Cover Image */}
              <div
                className={cn(
                  "relative h-48 md:h-64 overflow-hidden",
                  !coverImage && "bg-gradient-to-br",
                )}
                style={{
                  backgroundImage: coverImage
                    ? `url(${coverImage})`
                    : `linear-gradient(135deg, ${BUFFALO_BRAND.blue.primary}20, ${BUFFALO_BRAND.blue.light}20)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Visibility Badge */}
                <div className="absolute top-4 right-4">
                  <Badge
                    className={cn(
                      "text-sm px-3 py-1",
                      state.isPublic
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/30",
                    )}
                  >
                    {state.isPublic ? (
                      <>
                        <Globe className="h-3.5 w-3.5 mr-1.5" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Draft (not visible)
                      </>
                    )}
                  </Badge>
                </div>

                {/* Missing cover image warning */}
                {!coverImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto text-amber-400/60" />
                      <p className="text-sm">No cover image yet</p>
                    </div>
                  </div>
                )}

                {/* Stage Badge */}
                {stageConfig && (
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      className={cn(
                        "text-sm px-3 py-1",
                        stageConfig.colors.className || "bg-white/10",
                      )}
                    >
                      <stageConfig.icon className="h-3.5 w-3.5 mr-1.5" />
                      {stageConfig.label}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                {/* Title & One-liner */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {state.projectName || (
                      <span className="text-muted-foreground/50 italic">
                        Untitled Project
                      </span>
                    )}
                  </h1>
                  {state.oneLiner ? (
                    <p className="text-lg text-muted-foreground mt-2">
                      {state.oneLiner}
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground/50 italic mt-2">
                      Add a compelling one-liner to hook visitors...
                    </p>
                  )}
                </div>

                {/* Tags */}
                {state.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {state.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-sm bg-white/10 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-amber-400/60 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Add tags to help people discover your project
                  </div>
                )}

                {/* Category */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <Badge variant="outline" className="text-sm border-white/10">
                    {state.category
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <Card className="border-white/10 bg-white/[0.02]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                {state.description ? (
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {state.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground/50 italic">
                    Add a detailed description to tell your story...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Links Section */}
            {(workspace.embeds?.github || workspace.embeds?.website || workspace.embeds?.demo || workspace.embeds?.youtube) && (
              <Card className="border-white/10 bg-white/[0.02]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {workspace.embeds?.github && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    )}
                    {workspace.embeds?.website && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    )}
                    {workspace.embeds?.demo && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </Button>
                    )}
                    {workspace.embeds?.youtube?.videoId && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Video className="h-4 w-4" />
                        Video
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gives & Asks Section */}
            {((state.gives?.length ?? 0) > 0 || (state.asks?.length ?? 0) > 0) && (
              <Card className="border-white/10 bg-white/[0.02]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Community Exchange</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Gives */}
                    {(state.gives?.length ?? 0) > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Gift className="h-4 w-4" />
                          <span className="font-medium">I can offer</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {state.gives?.map((give) => (
                            <Badge
                              key={give}
                              className="bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
                            >
                              {give}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Asks */}
                    {(state.asks?.length ?? 0) > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                          <HandHelping className="h-4 w-4" />
                          <span className="font-medium">I&apos;m looking for</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {state.asks?.map((ask) => (
                            <Badge
                              key={ask}
                              className="bg-amber-400/10 text-amber-300 border-amber-400/20"
                            >
                              {ask}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completeness Checklist */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Publishing Checklist
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { key: "hasName", label: "Project name", done: completeness.hasName },
                    { key: "hasOneLiner", label: "One-liner pitch", done: completeness.hasOneLiner },
                    { key: "hasDescription", label: "Description", done: completeness.hasDescription },
                    { key: "hasCoverImage", label: "Cover image", done: completeness.hasCoverImage },
                    { key: "hasTags", label: "Tags for discoverability", done: completeness.hasTags },
                    { key: "hasLinks", label: "External links", done: completeness.hasLinks },
                    { key: "hasGivesAsks", label: "Community exchange", done: completeness.hasGivesAsks },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        item.done ? "text-emerald-400" : "text-muted-foreground",
                      )}
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                      )}
                      {item.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-white/10 bg-background/90 backdrop-blur-lg px-6 py-4">
          <p className="text-sm text-muted-foreground">
            {state.isPublic
              ? "Your project is visible in the community gallery"
              : "Publish to make your project visible in the gallery"}
          </p>
          <Button onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
