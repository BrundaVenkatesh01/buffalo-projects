/**
 * Quick Publish Panel
 *
 * Simplified interface for quickly publishing projects without
 * navigating through complex workspace tabs (Canvas, Journey, Documents).
 * Shows essential fields and publish controls.
 */

"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";

import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  Button,
  Input,
  Label,
  Textarea,
  Badge,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/unified";
import { STAGE_PROGRESSION, type StageConfig } from "@/constants/stages";
import {
  ChevronRight,
  Eye,
  Layers3,
  Upload,
  X,
  Plus,
  Video,
  Github,
  Globe,
  Linkedin,
  Share2,
  Download,
} from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace, ProjectStage, ProjectCategory } from "@/types";

const CATEGORY_OPTIONS: Array<{ value: ProjectCategory; label: string }> = [
  { value: "startup", label: "Startup" },
  { value: "design", label: "Design" },
  { value: "research", label: "Research" },
  { value: "indie", label: "Indie" },
  { value: "open-source", label: "Open Source" },
  { value: "creative", label: "Creative" },
  { value: "other", label: "Other" },
];

const TAG_SUGGESTIONS = [
  "AI",
  "SaaS",
  "Climate",
  "EdTech",
  "HealthTech",
  "FinTech",
  "E-commerce",
  "Manufacturing",
  "Nonprofit",
  "Hardware",
  "Mobile",
  "Web3",
  "Analytics",
  "Infrastructure",
];

interface QuickPublishPanelProps {
  workspace: Workspace;
  onExpand: () => void;
  onImport?: () => void;
}

export function QuickPublishPanel({
  workspace,
  onExpand,
  onImport,
}: QuickPublishPanelProps) {
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const saveWorkspace = useWorkspaceStore((state) => state.saveWorkspace);
  const publishWorkspace = useWorkspaceStore((state) => state.publishWorkspace);
  const unpublishWorkspace = useWorkspaceStore(
    (state) => state.unpublishWorkspace,
  );
  const [saving, setSaving] = useState(false);

  // Local state for editing
  const [projectName, setProjectName] = useState(
    workspace.projectName || "Untitled",
  );
  const [oneLiner, setOneLiner] = useState(workspace.oneLiner || "");
  const [description, setDescription] = useState(
    workspace.projectDescription || "",
  );
  const [category, setCategory] = useState<ProjectCategory>(
    workspace.category || "other",
  );
  const [stage, setStage] = useState(workspace.stage || "idea");
  const [tags, setTags] = useState<string[]>(workspace.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isPublic, setIsPublic] = useState(workspace.isPublic || false);

  // Media section state
  const [demoVideoUrl, setDemoVideoUrl] = useState(
    workspace.embeds?.youtube?.url || "",
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // File input refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Links section state
  const [demoUrl, setDemoUrl] = useState(workspace.embeds?.demo || "");
  const [githubUrl, setGithubUrl] = useState(
    workspace.embeds?.github?.repoUrl || "",
  );
  const [websiteUrl, setWebsiteUrl] = useState(workspace.embeds?.website || "");
  const [twitterUrl, setTwitterUrl] = useState(
    workspace.socialLinks?.twitter || "",
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    workspace.socialLinks?.linkedin || "",
  );

  // Community section state - support both asks (new) and lookingFor (deprecated)
  const [asks, setAsks] = useState<string[]>(
    workspace.asks || workspace.lookingFor || [],
  );
  const [gives, setGives] = useState<string[]>(workspace.gives || []);
  const [newAsk, setNewAsk] = useState("");
  const [newGive, setNewGive] = useState("");

  // Team section state
  const [collaborators, setCollaborators] = useState<
    Array<{ name: string; role: string }>
  >(workspace.teamMembers || []);
  const [acknowledgments, setAcknowledgments] = useState(
    workspace.acknowledgments || "",
  );

  const handleSave = async (publishOverride?: boolean) => {
    const shouldPublish =
      publishOverride !== undefined ? publishOverride : isPublic;
    setSaving(true);
    try {
      updateWorkspace({
        // Basics section
        projectName: projectName.trim(),
        oneLiner: oneLiner.trim(),
        projectDescription: description.trim(),
        category,
        stage,
        tags: tags.filter((t) => t.trim()),
        isPublic: shouldPublish,
        ...(shouldPublish && !workspace.slug
          ? {
              slug:
                projectName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "") || `project-${workspace.code}`,
            }
          : {}),

        // Media & Links sections - merge with existing embeds
        embeds: {
          ...workspace.embeds,
          ...(demoVideoUrl ? { youtube: { url: demoVideoUrl } } : {}),
          ...(demoUrl ? { demo: demoUrl } : {}),
          ...(githubUrl ? { github: { repoUrl: githubUrl } } : {}),
          ...(websiteUrl ? { website: websiteUrl } : {}),
        },

        // Social links
        socialLinks: {
          ...(twitterUrl ? { twitter: twitterUrl } : {}),
          ...(linkedinUrl ? { linkedin: linkedinUrl } : {}),
        },

        // Community section - save to 'asks' (lookingFor is deprecated)
        asks: asks.filter((a) => a.trim()),
        gives: gives.filter((g) => g.trim()),

        // Team section
        teamMembers: collaborators.filter(
          (c) => c.name.trim() && c.role.trim(),
        ),
        acknowledgments: acknowledgments.trim(),
      });

      // Actually persist to Firestore
      await saveWorkspace();

      toast.success(
        shouldPublish ? "Project published successfully!" : "Changes saved",
        {
          description: shouldPublish
            ? "Your project is now visible in the community gallery"
            : "Your changes have been saved",
        },
      );
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save changes", {
        description: "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(newTag);
    }
  };

  // Handle cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploadingCover(true);
    setUploadProgress(0);

    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.uploadCoverImage(workspace.code, file, {
        onProgress: (progress) => setUploadProgress(progress),
      });

      // The upload function already updated Firestore directly.
      // Reload workspace from Firestore to ensure local state is in sync.
      // This prevents stale data issues where local state overwrites Firestore on save.
      await useWorkspaceStore.getState().loadWorkspace(workspace.code);

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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const { firebaseDatabase } = await import("@/services/firebaseDatabase");
      await firebaseDatabase.uploadProjectImage(workspace.code, file, {
        onProgress: (progress) => setUploadProgress(progress),
      });

      // The upload function already updated Firestore directly.
      // Reload workspace from Firestore to ensure local state is in sync.
      // This prevents stale data issues where local state overwrites Firestore on save.
      await useWorkspaceStore.getState().loadWorkspace(workspace.code);

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
      await firebaseDatabase.deleteCoverImage(workspace.code);

      // Reload workspace from Firestore to ensure local state is in sync
      await useWorkspaceStore.getState().loadWorkspace(workspace.code);

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
      await firebaseDatabase.deleteProjectImage(workspace.code, imageUrl);

      // Reload workspace from Firestore to ensure local state is in sync
      await useWorkspaceStore.getState().loadWorkspace(workspace.code);

      toast.success("Image removed");
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-black via-black/95 to-black">
      {/* Header - Simplified */}
      <div className="flex-shrink-0 border-b border-white/10 bg-black/40 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Get Your Shareable Link
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create a professional page anyone can view
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onImport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onImport}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Import</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <Layers3 className="h-3.5 w-3.5" />
              <span>Workspace</span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1 py-0 leading-none"
              >
                Beta
              </Badge>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content - All sections visible */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* BASICS SECTION - Always visible, primary */}
          <section className="space-y-5">
            {/* Project Name */}
            <div className="space-y-1.5">
              <Label htmlFor="projectName" className="text-sm font-medium">
                Project Name *
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="h-9"
              />
            </div>

            {/* One-Liner */}
            <div className="space-y-1.5">
              <Label htmlFor="oneLiner" className="text-sm font-medium">
                One-Line Pitch
              </Label>
              <Input
                id="oneLiner"
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value.slice(0, 120))}
                placeholder="A brief tagline for your project"
                className="h-9"
                maxLength={120}
              />
              <p className="text-[11px] text-muted-foreground">
                {oneLiner.length}/120 • Appears on your project card
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ProjectCategory)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the community what you're building..."
                rows={5}
                className="resize-none text-sm"
              />
            </div>

            {/* Stage */}
            <div className="space-y-1.5">
              <Label htmlFor="stage" className="text-sm font-medium">
                Project Stage
              </Label>
              <Select
                value={stage}
                onValueChange={(value) => setStage(value as ProjectStage)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue>
                    {(() => {
                      const currentStage = STAGE_PROGRESSION.find(
                        (s) => s.value === stage,
                      );
                      const Icon = currentStage?.icon;
                      return (
                        <div className="flex items-center gap-2.5">
                          {Icon && (
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{currentStage?.label}</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STAGE_PROGRESSION.map((option: StageConfig) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-3 py-0.5">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Tags</Label>

              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="cursor-pointer text-xs hover:opacity-80"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <span className="ml-1">×</span>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tag Input */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="h-9 flex-1 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(newTag)}
                  disabled={!newTag.trim()}
                  className="h-9 px-3"
                >
                  Add
                </Button>
              </div>

              {/* Compact Tag Suggestions */}
              <details className="group">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none list-none flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
                  Suggested tags (
                  {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).length})
                </summary>
                <div className="flex flex-wrap gap-1 mt-2">
                  {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).map(
                    (tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer text-[11px] hover:bg-primary/20 transition-colors"
                        onClick={() => addTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ),
                  )}
                </div>
              </details>
            </div>
          </section>

          {/* MEDIA SECTION - Collapsible */}
          <details className="group border border-white/10 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <h2 className="text-lg font-semibold">Visual Media</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cover image, screenshots, demo video
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="p-4 pt-0 space-y-6">
              {/* Cover Image */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Cover Image</Label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => void handleCoverUpload(e)}
                  className="hidden"
                />
                <div
                  className="border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() =>
                    !uploadingCover &&
                    !workspace.assets?.coverImage &&
                    coverInputRef.current?.click()
                  }
                >
                  {workspace.assets?.coverImage ? (
                    <div className="relative">
                      <img
                        src={workspace.assets.coverImage}
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
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-primary mb-3 animate-pulse" />
                      <p className="text-sm text-foreground mb-2">
                        Uploading...
                      </p>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
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
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-sm text-foreground mb-1">
                        Click to upload cover image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          coverInputRef.current?.click();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Images */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Project Images</Label>
                <p className="text-xs text-muted-foreground">
                  Add up to 10 images of your project
                </p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => void handleImageUpload(e)}
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-4">
                  {/* Existing images */}
                  {workspace.assets?.screenshots?.map((imageUrl, index) => (
                    <div
                      key={imageUrl}
                      className="relative aspect-video border border-white/20 rounded-lg overflow-hidden group"
                    >
                      <img
                        src={imageUrl}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => void handleDeleteImage(imageUrl)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add new image slots */}
                  {(!workspace.assets?.screenshots ||
                    workspace.assets.screenshots.length < 10) &&
                    !uploadingImage && (
                      <div
                        className="aspect-video border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <div className="text-center">
                          <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-1" />
                          <p className="text-xs text-muted-foreground">
                            Add image
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Upload progress indicator */}
                  {uploadingImage && (
                    <div className="aspect-video border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center bg-primary/5">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-primary mb-2 animate-pulse" />
                        <p className="text-xs text-foreground mb-1">
                          Uploading...
                        </p>
                        <p className="text-xs text-primary">
                          {uploadProgress}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Video */}
              <div className="space-y-3">
                <Label htmlFor="demoVideo" className="text-sm font-medium">
                  Demo Video
                </Label>
                <p className="text-xs text-muted-foreground">
                  YouTube or Vimeo URL
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="demoVideo"
                      value={demoVideoUrl}
                      onChange={(e) => setDemoVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="h-9 pl-10"
                    />
                  </div>
                  {demoVideoUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDemoVideoUrl("")}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {demoVideoUrl && (
                  <div className="aspect-video bg-black/20 rounded-lg border border-white/10 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                      Video preview will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </details>

          {/* LINKS SECTION - Collapsible */}
          <details className="group border border-white/10 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <h2 className="text-lg font-semibold">Project Links</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Demo URL, GitHub, website, social media
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="p-4 pt-0 space-y-6">
              {/* Demo URL */}
              <div className="space-y-2">
                <Label htmlFor="demoUrl" className="text-sm font-medium">
                  Demo / Live Site
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="demoUrl"
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://yourproject.com"
                    className="h-9 pl-10"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <Label htmlFor="github" className="text-sm font-medium">
                  GitHub Repository
                </Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="h-9 pl-10"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website / Landing Page
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="h-9 pl-10"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Social Media</Label>

                {/* Twitter/X */}
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="h-9 pl-10"
                  />
                </div>

                {/* LinkedIn */}
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="h-9 pl-10"
                  />
                </div>
              </div>

              {/* Preview Card */}
              {(demoUrl ||
                githubUrl ||
                websiteUrl ||
                twitterUrl ||
                linkedinUrl) && (
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Active Links
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {demoUrl && (
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="mr-1 h-3 w-3" />
                        Demo
                      </Badge>
                    )}
                    {githubUrl && (
                      <Badge variant="secondary" className="text-xs">
                        <Github className="mr-1 h-3 w-3" />
                        GitHub
                      </Badge>
                    )}
                    {websiteUrl && (
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="mr-1 h-3 w-3" />
                        Website
                      </Badge>
                    )}
                    {twitterUrl && (
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="mr-1 h-3 w-3" />
                        Twitter
                      </Badge>
                    )}
                    {linkedinUrl && (
                      <Badge variant="secondary" className="text-xs">
                        <Linkedin className="mr-1 h-3 w-3" />
                        LinkedIn
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* COMMUNITY SECTION - Collapsible */}
          <details className="group border border-white/10 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <h2 className="text-lg font-semibold">Community Exchange</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  What you need help with, what you can offer
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="p-4 pt-0 space-y-6">
              {/* Asks */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Asks</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    What do you need help with?
                  </p>
                </div>

                {/* Selected Asks */}
                {asks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {asks.map((ask) => (
                      <Badge
                        key={ask}
                        variant="default"
                        className="cursor-pointer text-xs hover:opacity-80"
                        onClick={() => setAsks(asks.filter((a) => a !== ask))}
                      >
                        {ask}
                        <span className="ml-1">×</span>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Ask Input */}
                <div className="flex gap-2">
                  <Input
                    value={newAsk}
                    onChange={(e) => setNewAsk(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newAsk.trim()) {
                        e.preventDefault();
                        setAsks([...asks, newAsk.trim()]);
                        setNewAsk("");
                      }
                    }}
                    placeholder="e.g., Feedback on MVP, Beta testers, Marketing advice"
                    className="h-9 flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newAsk.trim()) {
                        setAsks([...asks, newAsk.trim()]);
                        setNewAsk("");
                      }
                    }}
                    disabled={!newAsk.trim()}
                    className="h-9 px-3"
                  >
                    Add
                  </Button>
                </div>

                {/* Suggestions */}
                <details className="group">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none list-none flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
                    Common asks
                  </summary>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "Feedback on MVP",
                      "Beta testers",
                      "Design review",
                      "Technical advice",
                      "Marketing help",
                      "Investor intros",
                    ].map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="secondary"
                        className="cursor-pointer text-[11px] hover:bg-primary/20 transition-colors"
                        onClick={() => {
                          if (!asks.includes(suggestion)) {
                            setAsks([...asks, suggestion]);
                          }
                        }}
                      >
                        + {suggestion}
                      </Badge>
                    ))}
                  </div>
                </details>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Gives */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Gives</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    What can you offer to others?
                  </p>
                </div>

                {/* Selected Gives */}
                {gives.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gives.map((give) => (
                      <Badge
                        key={give}
                        variant="default"
                        className="cursor-pointer text-xs hover:opacity-80 bg-primary/20"
                        onClick={() =>
                          setGives(gives.filter((g) => g !== give))
                        }
                      >
                        {give}
                        <span className="ml-1">×</span>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Give Input */}
                <div className="flex gap-2">
                  <Input
                    value={newGive}
                    onChange={(e) => setNewGive(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newGive.trim()) {
                        e.preventDefault();
                        setGives([...gives, newGive.trim()]);
                        setNewGive("");
                      }
                    }}
                    placeholder="e.g., Product strategy, Frontend dev, User research"
                    className="h-9 flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newGive.trim()) {
                        setGives([...gives, newGive.trim()]);
                        setNewGive("");
                      }
                    }}
                    disabled={!newGive.trim()}
                    className="h-9 px-3"
                  >
                    Add
                  </Button>
                </div>

                {/* Suggestions */}
                <details className="group">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none list-none flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
                    Common gives
                  </summary>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "Product strategy",
                      "Frontend development",
                      "Design work",
                      "User research",
                      "Data analysis",
                      "Content writing",
                    ].map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="secondary"
                        className="cursor-pointer text-[11px] hover:bg-primary/20 transition-colors"
                        onClick={() => {
                          if (!gives.includes(suggestion)) {
                            setGives([...gives, suggestion]);
                          }
                        }}
                      >
                        + {suggestion}
                      </Badge>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </details>

          {/* TEAM SECTION - Collapsible */}
          <details className="group border border-white/10 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <h2 className="text-lg font-semibold">Team & Credits</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Collaborators and acknowledgments
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="p-4 pt-0 space-y-6">
              {/* Collaborators */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Collaborators</Label>

                {/* Collaborator List */}
                {collaborators.length > 0 && (
                  <div className="space-y-2">
                    {collaborators.map((collab, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/10"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{collab.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {collab.role}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setCollaborators(
                              collaborators.filter((_, i) => i !== index),
                            )
                          }
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Collaborator Form */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Name"
                      className="h-9"
                      id="collab-name"
                    />
                    <Input
                      placeholder="Role"
                      className="h-9"
                      id="collab-role"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const nameInput = document.getElementById(
                        "collab-name",
                      ) as HTMLInputElement;
                      const roleInput = document.getElementById(
                        "collab-role",
                      ) as HTMLInputElement;
                      if (nameInput?.value && roleInput?.value) {
                        setCollaborators([
                          ...collaborators,
                          { name: nameInput.value, role: roleInput.value },
                        ]);
                        nameInput.value = "";
                        roleInput.value = "";
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collaborator
                  </Button>
                </div>
              </div>

              {/* Acknowledgments */}
              <div className="space-y-2">
                <Label
                  htmlFor="acknowledgments"
                  className="text-sm font-medium"
                >
                  Acknowledgments
                </Label>
                <p className="text-xs text-muted-foreground">
                  Thank supporters, advisors, or inspirations
                </p>
                <Textarea
                  id="acknowledgments"
                  value={acknowledgments}
                  onChange={(e) => setAcknowledgments(e.target.value)}
                  placeholder="Special thanks to..."
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </details>

          {/* PUBLISH SECTION - Always visible, primary action */}
          <section className="space-y-5 border-t border-white/10 pt-6">
            {/* Live Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <Label className="text-sm font-medium">Live Preview</Label>
              </div>
              <Card className="border-white/10 bg-white/[0.02] p-4">
                <ProjectCard
                  workspace={{
                    ...workspace,
                    projectName,
                    oneLiner,
                    projectDescription: description,
                    stage,
                    tags,
                    isPublic,
                  }}
                  variant="medium"
                  onEdit={() => {
                    // No-op: edit is handled through the form fields above
                  }}
                />
              </Card>
            </div>

            {/* Publish Controls - Smart */}
            <div className="space-y-4">
              {!isPublic ? (
                /* Not Published - Value-first framing */
                <>
                  <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Get your shareable link
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your page will be live at a URL you can share
                        anywhere—LinkedIn, email, pitch decks. No login required
                        to view.
                      </p>
                    </div>
                    {/* Preview URL */}
                    <div className="rounded-md bg-black/20 border border-primary/20 p-2.5">
                      <p className="text-[11px] font-medium text-primary mb-1">
                        Your URL will be
                      </p>
                      <code className="block rounded bg-black/30 px-2 py-1.5 text-[10px] text-foreground/70 break-all">
                        {typeof window !== "undefined" &&
                          window.location.origin}
                        /p/
                        {projectName
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "") ||
                          `project-${workspace.code}`}
                      </code>
                    </div>
                    <Button
                      onClick={() => {
                        void (async () => {
                          setSaving(true);
                          try {
                            // First save all changes
                            await handleSave(false);
                            // Then properly publish using the store method
                            await publishWorkspace(workspace.code);
                            toast.success("Your page is live!", {
                              description:
                                "Copy your link and share it anywhere",
                            });
                            // Redirect to the public page so they see their work
                            const slug =
                              workspace.slug ||
                              projectName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "") ||
                              `project-${workspace.code}`;
                            window.location.href = `/p/${slug}`;
                          } catch (error) {
                            console.error("Failed to publish:", error);
                            toast.error("Failed to publish project", {
                              description: "Please try again",
                            });
                          } finally {
                            setSaving(false);
                          }
                        })();
                      }}
                      className="w-full bg-primary hover:bg-primary/90 h-12"
                      size="lg"
                      disabled={saving}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {saving ? "Publishing..." : "Publish & Get My Link"}
                    </Button>
                  </div>

                  <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Keep editing
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Save your progress and continue working. You can publish
                        anytime.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        void (async () => {
                          await handleSave();
                          // Redirect to workspace beta
                          if (onExpand) {
                            onExpand();
                          }
                        })();
                      }}
                      className="w-full h-12"
                      size="lg"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save & Continue Editing"}
                    </Button>
                  </div>
                </>
              ) : (
                /* Published - Celebrate the shareable link */
                <div className="space-y-3">
                  <div className="rounded-lg border border-primary/40 bg-primary/10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <Share2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-foreground">
                          Your page is live!
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Anyone with the link can view—no login required
                        </p>
                      </div>
                    </div>

                    {/* Public URL */}
                    <div className="mt-3 space-y-1.5 rounded-md bg-black/20 border border-primary/20 p-2.5">
                      <p className="text-[11px] font-medium text-primary">
                        Public URL
                      </p>
                      <code className="block rounded bg-black/30 px-2 py-1.5 text-[10px] text-foreground/70 break-all">
                        {typeof window !== "undefined" &&
                          window.location.origin}
                        /p/
                        {workspace.slug ||
                          projectName
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "") ||
                          `project-${workspace.code}`}
                      </code>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => {
                            const url = `${window.location.origin}/p/${
                              workspace.slug ||
                              projectName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "") ||
                              `project-${workspace.code}`
                            }`;
                            void navigator.clipboard.writeText(url);
                            toast.success("Link copied! Share it anywhere.");
                          }}
                        >
                          Copy Link
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90"
                          onClick={() => {
                            const slug =
                              workspace.slug ||
                              projectName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "") ||
                              `project-${workspace.code}`;
                            window.location.href = `/p/${slug}`;
                          }}
                        >
                          View My Page
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Unpublish Option */}
                  <details className="group">
                    <summary className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors list-none">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          Make project private
                        </p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                      </div>
                    </summary>
                    <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Unpublishing will remove your project from the community
                        gallery. You can republish it anytime.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void (async () => {
                            try {
                              await unpublishWorkspace(workspace.code);
                              setIsPublic(false);
                              toast.success("Project is now private", {
                                description:
                                  "Your project has been removed from the gallery",
                              });
                            } catch (error) {
                              console.error("Failed to unpublish:", error);
                              toast.error("Failed to make project private");
                            }
                          })();
                        }}
                        className="w-full text-xs"
                      >
                        <X className="mr-2 h-3 w-3" />
                        Make Private
                      </Button>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 border-t border-white/10 bg-black/40 px-6 py-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Changes save automatically
          </p>
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Reset to workspace values
                setProjectName(workspace.projectName || "Untitled");
                setOneLiner(workspace.oneLiner || "");
                setDescription(workspace.projectDescription || "");
                setCategory(workspace.category || "other");
                setStage(workspace.stage || "idea");
                setTags(workspace.tags || []);
                setIsPublic(workspace.isPublic || false);
                toast.info("Changes discarded");
              }}
              className="h-8"
            >
              Reset
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={saving}
              size="sm"
              className="h-8"
            >
              {saving
                ? "Saving..."
                : isPublic
                  ? "Save & Stay Public"
                  : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
