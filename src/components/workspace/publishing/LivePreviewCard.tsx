/**
 * Live Preview Card
 *
 * Real-time preview of how the project will appear in the gallery.
 * Updates instantly as the user types in the form.
 * Includes a "Full Preview" button to open the full-page preview modal.
 */

"use client";

import { m } from "framer-motion";
import { useState } from "react";

import { FullPagePreviewModal } from "./FullPagePreviewModal";
import { usePublishForm } from "./PublishFormContext";
import { VisibilityExplainer } from "./VisibilityExplainer";

import { Badge, Button, Card, CardContent } from "@/components/unified";
import { getStageConfig } from "@/constants/stages";
import { Eye, Globe, Lock, MapPin, Maximize2 } from "@/icons";
import { cn } from "@/lib/utils";
import { BUFFALO_BRAND } from "@/tokens/brand";

export function LivePreviewCard() {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const { state, workspace } = usePublishForm();

  // Get stage configuration
  const stageConfig = state.stage ? getStageConfig(state.stage) : null;

  // Get cover image from workspace (since it's managed by uploads)
  const coverImage = workspace.assets?.coverImage;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>How it will appear</span>
        </div>
      </div>

      <m.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
          {/* Cover Image */}
          <div
            className={cn(
              "relative h-32 overflow-hidden",
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
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  state.isPublic
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-white/10 text-muted-foreground",
                )}
              >
                {state.isPublic ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>

            {/* Stage Badge */}
            {stageConfig && (
              <div className="absolute bottom-2 left-2">
                <Badge
                  className={cn(
                    "text-xs",
                    stageConfig.colors.className || "bg-white/10",
                  )}
                >
                  <stageConfig.icon className="h-3 w-3 mr-1" />
                  {stageConfig.label}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4 space-y-2">
            {/* Project Name */}
            <h4 className="font-semibold text-foreground line-clamp-1">
              {state.projectName || "Untitled Project"}
            </h4>

            {/* One-liner */}
            {state.oneLiner ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {state.oneLiner}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground/50 italic">
                Add a one-liner to describe your project...
              </p>
            )}

            {/* Tags */}
            {state.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {state.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-white/10 text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
                {state.tags.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-white/5 text-muted-foreground"
                  >
                    +{state.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Category */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <Badge variant="outline" className="text-xs border-white/10">
                {state.category
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Badge>

              {/* Buffalo affiliation */}
              {workspace.buffaloAffiliated && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Buffalo
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </m.div>

      {/* Full Preview Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFullPreview(true)}
        className="w-full gap-2 border-white/10 hover:border-primary/30 hover:bg-primary/5"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        Full Preview
      </Button>

      {/* Preview Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          {!coverImage && (
            <span className="text-amber-400">
              • Add a cover image to stand out
            </span>
          )}
        </p>
        {state.tags.length === 0 && (
          <p className="text-amber-400">
            • Add tags to help people find your project
          </p>
        )}
        {!state.oneLiner && (
          <p className="text-amber-400">• Add a one-liner pitch</p>
        )}
      </div>

      {/* Visibility Explainer */}
      <div className="pt-2 border-t border-white/5">
        <VisibilityExplainer isPublic={state.isPublic} />
      </div>

      {/* Full Page Preview Modal */}
      <FullPagePreviewModal
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
      />
    </div>
  );
}
