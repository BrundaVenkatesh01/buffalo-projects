"use client";

import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui-next";
import { Button } from "@/components/ui-next";
import { Input } from "@/components/ui-next";
import { Label } from "@/components/unified";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Globe,
  Lock,
  Link as LinkIcon,
  AlertCircle,
  Upload,
  X,
  Plus,
  ChevronRight,
  Image as ImageIcon,
} from "@/icons";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";

interface WorkspaceSharePanelProps {
  onNavigateToCanvas?: () => void;
  onSaved?: (timestamp?: string | null) => void;
}

export function WorkspaceSharePanel({ onSaved }: WorkspaceSharePanelProps) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const saveWorkspace = useWorkspaceStore((state) => state.saveWorkspace);
  const publishWorkspace = useWorkspaceStore((state) => state.publishWorkspace);
  const unpublishWorkspace = useWorkspaceStore(
    (state) => state.unpublishWorkspace,
  );

  const [externalLink, setExternalLink] = useState(
    currentWorkspace?.publicLink ?? "",
  );
  const [linkSaving, setLinkSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedEditor, setCopiedEditor] = useState(false);

  // Image upload state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setExternalLink(currentWorkspace?.publicLink ?? "");
  }, [currentWorkspace?.publicLink]);

  const projectName = currentWorkspace?.projectName?.trim() ?? "";
  const projectDescription = currentWorkspace?.projectDescription?.trim() ?? "";

  // Simplified publish requirements - just name and description
  const requirements = useMemo(() => {
    const description =
      projectDescription || currentWorkspace?.description?.trim() || "";

    return [
      {
        id: "title",
        label: "Project name",
        met: projectName.length >= 3,
        helper: "Give your project a name (at least 3 characters)",
      },
      {
        id: "description",
        label: "Description",
        met: description.length >= 20,
        helper: "Write a brief description (at least 20 characters)",
      },
    ];
  }, [projectName, projectDescription, currentWorkspace?.description]);

  const completedRequirements = requirements.filter((item) => item.met).length;
  const readyToPublish = completedRequirements === requirements.length;

  if (!currentWorkspace) {
    return null;
  }

  const isPublic = Boolean(currentWorkspace.isPublic);
  const slug = currentWorkspace.slug ?? "";
  const publishedAt = currentWorkspace.publishedAt ?? null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = slug
    ? `${baseUrl ? `${baseUrl}/p/${slug}` : `/p/${slug}`}`
    : "";
  const editorUrl = `${baseUrl ? `${baseUrl}/project/${currentWorkspace.code}` : `/project/${currentWorkspace.code}`}`;

  const publishedAtLabel = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null;

  const handlePublish = async () => {
    if (!readyToPublish) {
      toast.error(
        `Almost there! ${requirements.find((r) => !r.met)?.helper || "Complete the requirements to publish."}`,
      );
      return;
    }

    setPublishing(true);
    try {
      const updated = await publishWorkspace(currentWorkspace.code);
      const timestamp = updated.publishedAt
        ? new Date(updated.publishedAt).toISOString()
        : (updated.lastModified ?? null);
      onSaved?.(timestamp);
      toast.success(
        "🎉 Project published! It's now live in Buffalo's project directory.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to publish project.";
      toast.error(message);
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!isPublic) {
      return;
    }

    setUnpublishing(true);
    try {
      const updated = await unpublishWorkspace(currentWorkspace.code);
      onSaved?.(updated.lastModified ?? null);
      toast.success("Project unpublished. It is no longer publicly visible.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to unpublish project.";
      toast.error(message);
    } finally {
      setUnpublishing(false);
    }
  };

  const handleCopyPublicUrl = () => {
    if (!publicUrl) {
      return;
    }
    void navigator.clipboard.writeText(publicUrl);
    setCopiedPublic(true);
    setTimeout(() => setCopiedPublic(false), 2000);
    toast.success("Public URL copied to clipboard.");
  };

  const handleCopyEditorUrl = () => {
    void navigator.clipboard.writeText(editorUrl);
    setCopiedEditor(true);
    setTimeout(() => setCopiedEditor(false), 2000);
    toast.success("Editor link copied to clipboard.");
  };

  const handleExternalLinkSave = async () => {
    setLinkSaving(true);
    try {
      const trimmed = externalLink.trim();
      updateWorkspace({ publicLink: trimmed.length > 0 ? trimmed : undefined });
      await saveWorkspace();
      const latestTimestamp =
        useWorkspaceStore.getState().currentWorkspace?.lastModified ?? null;
      onSaved?.(latestTimestamp);
      toast.success("External link saved.");
    } catch (error) {
      console.error("Failed to save external link", error);
      toast.error("Could not save link right now.");
    } finally {
      setLinkSaving(false);
    }
  };

  // Handle cover image upload
  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploadingCover(true);
    setUploadProgress(0);

    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.uploadCoverImage(currentWorkspace.code, file, {
        onProgress: (progress) => setUploadProgress(progress),
      });

      await useWorkspaceStore.getState().loadWorkspace(currentWorkspace.code);
      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploadingCover(false);
      setUploadProgress(0);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  // Handle project image upload
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.uploadProjectImage(currentWorkspace.code, file, {
        onProgress: (progress) => setUploadProgress(progress),
      });

      await useWorkspaceStore.getState().loadWorkspace(currentWorkspace.code);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  // Handle delete cover image
  const handleDeleteCover = async () => {
    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.deleteCoverImage(currentWorkspace.code);
      await useWorkspaceStore.getState().loadWorkspace(currentWorkspace.code);
      toast.success("Cover image removed");
    } catch (error) {
      console.error("Failed to delete cover image:", error);
      toast.error("Failed to remove image");
    }
  };

  // Handle delete project image
  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.deleteProjectImage(
        currentWorkspace.code,
        imageUrl,
      );
      await useWorkspaceStore.getState().loadWorkspace(currentWorkspace.code);
      toast.success("Image removed");
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Status Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Share & Publish
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Make your project visible to the Buffalo community
          </p>
        </div>
        <Badge
          className={cn(
            "px-3 py-1.5 text-sm",
            isPublic
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-white/5 text-muted-foreground",
          )}
        >
          {isPublic ? (
            <>
              <Globe className="mr-1.5 h-3.5 w-3.5" />
              Published
            </>
          ) : (
            <>
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Private
            </>
          )}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Publish Gate */}
        <div className="space-y-6">
          {/* Publish Requirements Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                Publishing Checklist
              </h3>
              <Badge variant="outline">
                {completedRequirements}/{requirements.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {requirements.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 transition-all",
                    item.met
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/10 bg-white/[0.02]",
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {item.met ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    {!item.met && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.helper}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Ready Banner */}
            {readyToPublish && !isPublic && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-100">
                    Ready to publish!
                  </p>
                  <p className="mt-1 text-xs text-emerald-200/80">
                    Your project meets all requirements to go live
                  </p>
                </div>
              </div>
            )}

            {/* Publish Actions */}
            <div className="mt-6 flex flex-col gap-3">
              {!isPublic ? (
                <Button
                  onClick={() => {
                    void handlePublish();
                  }}
                  disabled={!readyToPublish || publishing}
                  isLoading={publishing}
                  size="lg"
                  block
                >
                  {publishing ? "Publishing…" : "Publish Project"}
                </Button>
              ) : (
                <>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
                    <p className="text-sm font-medium text-emerald-100">
                      Project is live
                    </p>
                    {publishedAtLabel && (
                      <p className="mt-1 text-xs text-emerald-200/80">
                        Published {publishedAtLabel}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      void handleUnpublish();
                    }}
                    disabled={unpublishing}
                    isLoading={unpublishing}
                    size="md"
                    block
                  >
                    {unpublishing ? "Unpublishing…" : "Unpublish Project"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Share Links */}
        <div className="space-y-6">
          {/* Public Link */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Public URL</h3>
            </div>

            {isPublic && publicUrl ? (
              <>
                <div className="flex gap-2">
                  <Input
                    value={publicUrl}
                    readOnly
                    className="flex-1 cursor-text bg-white/5 text-sm font-mono text-muted-foreground"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPublicUrl}
                    leftIcon={copiedPublic ? <CheckCircle /> : <Copy />}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Share this link with mentors and the Buffalo community
                </p>
                <Button
                  variant="outline"
                  size="md"
                  block
                  leftIcon={<ExternalLink />}
                  onClick={() => {
                    window.open(publicUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="mt-4"
                >
                  View Public Page
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Not published yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Publish your project to generate a public link
                </p>
              </div>
            )}
          </div>

          {/* Workspace Link */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                Workspace URL
              </h3>
            </div>

            <div className="flex gap-2">
              <Input
                value={editorUrl}
                readOnly
                className="flex-1 cursor-text bg-white/5 text-sm font-mono text-muted-foreground"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEditorUrl}
                leftIcon={copiedEditor ? <CheckCircle /> : <Copy />}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Private editor link for you and collaborators
            </p>
          </div>

          {/* External Link */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                External Link
              </h3>
              <Badge variant="outline" className="ml-auto text-xs">
                Optional
              </Badge>
            </div>

            <Input
              value={externalLink}
              onChange={(event) => setExternalLink(event.target.value)}
              placeholder="https://your-demo.com"
              className="bg-white/5"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Link to your demo, GitHub repo, or landing page
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled={linkSaving}
                isLoading={linkSaving}
                onClick={() => {
                  void handleExternalLinkSave();
                }}
              >
                {linkSaving ? "Saving…" : "Save Link"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Media Section - Collapsible */}
      <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]">
        <summary className="flex cursor-pointer items-center justify-between p-6 hover:bg-white/5 transition-colors list-none">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Visual Media
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cover image and project screenshots
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
        </summary>
        <div className="px-6 pb-6 space-y-6">
          {/* Hidden file inputs */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void handleCoverUpload(e)}
            className="hidden"
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void handleImageUpload(e)}
            className="hidden"
          />

          {/* Cover Image */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cover Image</Label>
            <p className="text-xs text-muted-foreground">
              Featured image shown at the top of your public page
            </p>
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 transition-colors",
                currentWorkspace.assets?.coverImage
                  ? "border-white/20"
                  : "border-white/20 hover:border-primary/50 cursor-pointer",
              )}
              onClick={() =>
                !uploadingCover &&
                !currentWorkspace.assets?.coverImage &&
                coverInputRef.current?.click()
              }
            >
              {currentWorkspace.assets?.coverImage ? (
                <div className="relative">
                  <img
                    src={currentWorkspace.assets.coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDeleteCover();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : uploadingCover ? (
                <div className="text-center py-4">
                  <Upload className="mx-auto h-10 w-10 text-primary mb-3 animate-pulse" />
                  <p className="text-sm text-foreground mb-2">Uploading...</p>
                  <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {uploadProgress}%
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-foreground mb-1">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Project Screenshots */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Project Screenshots</Label>
            <p className="text-xs text-muted-foreground">
              Add up to 10 images showcasing your project
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Existing images */}
              {currentWorkspace.assets?.screenshots?.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className="relative aspect-video border border-white/20 rounded-lg overflow-hidden group/img"
                >
                  <img
                    src={imageUrl}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 opacity-0 group-hover/img:opacity-100 transition-opacity"
                    onClick={() => void handleDeleteImage(imageUrl)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Add new image slot */}
              {(!currentWorkspace.assets?.screenshots ||
                currentWorkspace.assets.screenshots.length < 10) &&
                !uploadingImage && (
                  <div
                    className="aspect-video border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Add image</p>
                    </div>
                  </div>
                )}

              {/* Upload progress indicator */}
              {uploadingImage && (
                <div className="aspect-video border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center bg-primary/5">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-primary mb-2 animate-pulse" />
                    <p className="text-xs text-foreground mb-1">Uploading...</p>
                    <p className="text-xs text-primary">{uploadProgress}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </details>

      {/* Privacy Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
        <div className="flex-1">
          <p className="text-sm text-blue-100">
            <strong>Privacy:</strong> Published projects are visible to anyone
            with the link. Your workspace editor remains private.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceSharePanel;
