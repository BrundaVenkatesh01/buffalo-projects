/**
 * Visual Media Section
 *
 * Cover image, screenshots, and video embed management.
 * Integrates with the ImageCropModal for cropping before upload.
 */

"use client";

import type React from "react";
import { useRef } from "react";
import { toast } from "sonner";

import { usePublishForm } from "../PublishFormContext";

import { SectionWrapper } from "./SectionWrapper";

import { Input, Label, Button } from "@/components/unified";
import { Image, Video, Upload, X, Crop, Plus, Loader2 } from "@/icons";
import { cn } from "@/lib/utils";
import { validateImageFile } from "@/utils/imageUtils";

export function VisualMediaSection() {
  const { state, dispatch, openCropModal, workspace } = usePublishForm();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Handle cover image selection
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    openCropModal(file, "cover");

    // Reset input so the same file can be selected again
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  // Handle screenshot selection
  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    openCropModal(file, "screenshot");

    // Reset input
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = "";
    }
  };

  // Delete cover image
  const handleDeleteCover = async () => {
    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.deleteCoverImage(workspace.code);
      const { useWorkspaceStore } = await import("@/stores/workspaceStore");
      await useWorkspaceStore.getState().loadWorkspace(workspace.code);
      toast.success("Cover image removed");
    } catch (error) {
      console.error("Failed to delete cover:", error);
      toast.error("Failed to remove cover image");
    }
  };

  // Delete screenshot
  const handleDeleteScreenshot = async (imageUrl: string) => {
    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.deleteProjectImage(workspace.code, imageUrl);
      const { useWorkspaceStore } = await import("@/stores/workspaceStore");
      await useWorkspaceStore.getState().loadWorkspace(workspace.code);
      toast.success("Screenshot removed");
    } catch (error) {
      console.error("Failed to delete screenshot:", error);
      toast.error("Failed to remove screenshot");
    }
  };

  // Get actual values from workspace for images (since they're managed by uploads)
  const coverImage = workspace.assets?.coverImage;
  const screenshots = workspace.assets?.screenshots || [];

  return (
    <SectionWrapper
      title="Visual Media"
      sectionKey="media"
      icon={<Image className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Cover Image</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Recommended: 16:9 ratio, at least 1280×720px
          </p>

          {coverImage ? (
            <div className="relative group rounded-lg overflow-hidden border border-white/10">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-40 object-cover"
              />
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => coverInputRef.current?.click()}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Crop className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void handleDeleteCover()}
                  className="bg-red-500/80 hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={state.isUploading}
              className={cn(
                "w-full h-40 rounded-lg border-2 border-dashed border-white/10",
                "flex flex-col items-center justify-center gap-2",
                "text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.02]",
                "transition-all cursor-pointer",
                state.isUploading && "opacity-50 cursor-not-allowed",
              )}
            >
              {state.isUploading && state.cropModal.imageType === "cover" ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm">
                    Uploading... {state.uploadProgress}%
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Click to upload cover image</span>
                </>
              )}
            </button>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />
        </div>

        {/* Screenshots */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Screenshots</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Add up to 4 screenshots to showcase your project
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Existing screenshots */}
            {screenshots.map((url, index) => (
              <div
                key={url}
                className="relative group rounded-lg overflow-hidden border border-white/10"
              >
                <img
                  src={url}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => void handleDeleteScreenshot(url)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}

            {/* Add screenshot button */}
            {screenshots.length < 4 && (
              <button
                type="button"
                onClick={() => screenshotInputRef.current?.click()}
                disabled={state.isUploading}
                className={cn(
                  "h-24 rounded-lg border-2 border-dashed border-white/10",
                  "flex flex-col items-center justify-center gap-1",
                  "text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.02]",
                  "transition-all cursor-pointer",
                  state.isUploading && "opacity-50 cursor-not-allowed",
                )}
              >
                {state.isUploading &&
                state.cropModal.imageType === "screenshot" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Add</span>
                  </>
                )}
              </button>
            )}
          </div>

          <input
            ref={screenshotInputRef}
            type="file"
            accept="image/*"
            onChange={handleScreenshotSelect}
            className="hidden"
          />
        </div>

        {/* Demo Video */}
        <div className="space-y-2">
          <Label
            htmlFor="videoUrl"
            className="text-sm text-foreground flex items-center gap-2"
          >
            <Video className="h-4 w-4 text-muted-foreground" />
            Demo Video URL
          </Label>
          <Input
            id="videoUrl"
            value={state.demoVideoUrl}
            onChange={(e) =>
              dispatch({ type: "SET_VIDEO_URL", payload: e.target.value })
            }
            placeholder="https://youtube.com/watch?v=..."
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            YouTube or Loom links work best
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
