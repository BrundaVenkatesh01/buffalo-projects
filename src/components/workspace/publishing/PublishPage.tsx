/**
 * Publish Page - Simplified Single-Scroll Design
 *
 * Clean, single-scroll form with visual grouping (no collapsibles).
 * Auto-saves on change with clear visual feedback.
 *
 * Layout:
 * - Left: Scrollable form with all fields visible
 * - Right: Sticky preview + publish controls (desktop)
 */

"use client";

import type React from "react";
import { useRef, useEffect, useCallback, useState } from "react";
import { toast } from "sonner";

import { GivesAsksExplainer } from "./GivesAsksExplainer";
import { ImageCropModal } from "./ImageCropModal";
import { LivePreviewCard } from "./LivePreviewCard";
import { PublishActions } from "./PublishActions";
import {
  PublishFormProvider,
  usePublishForm,
  CATEGORY_OPTIONS,
  TAG_SUGGESTIONS,
} from "./PublishFormContext";

import {
  Button,
  ScrollArea,
  Input,
  Label,
  Textarea,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/unified";
import { STAGE_PROGRESSION, type StageConfig } from "@/constants/stages";
import {
  Download,
  Layers3,
  X,
  Plus,
  Image,
  Video,
  Upload,
  Crop,
  Loader2,
  Globe,
  Github,
  ExternalLink,
  HandHelping,
  Gift,
  Check,
  AlertCircle,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import { validateImageFile } from "@/utils/imageUtils";

// ============================================================================
// Auto-save Hook
// ============================================================================

function useAutoSave(save: () => Promise<void>, isDirty: boolean) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const triggerSave = useCallback(async () => {
    if (!isDirty) {return;}
    setIsSaving(true);
    try {
      await save();
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, [save, isDirty]);

  // Auto-save after 2 seconds of no changes
  useEffect(() => {
    if (!isDirty) {return;}

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void triggerSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, triggerSave]);

  return { lastSaved, isSaving, triggerSave };
}

// ============================================================================
// Section Header (visual grouping, not collapsible)
// ============================================================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Chip Input (reusable for tags, asks, gives)
// ============================================================================

interface ChipInputProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  suggestions?: string[];
  placeholder: string;
  variant?: "default" | "ask" | "give";
  maxItems?: number;
}

function ChipInput({
  items,
  onAdd,
  onRemove,
  suggestions = [],
  placeholder,
  variant = "default",
  maxItems = 10,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !items.includes(trimmed) && items.length < maxItems) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(inputValue);
    }
  };

  const filteredSuggestions = suggestions
    .filter((s) => !items.includes(s))
    .slice(0, 6);

  const chipColors = {
    default: "bg-white/10 text-foreground hover:bg-white/15",
    ask: "bg-amber-500/20 text-amber-300 hover:bg-amber-500/25",
    give: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/25",
  };

  const buttonColors = {
    default: "bg-primary/20 text-primary hover:bg-primary/30",
    ask: "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
    give: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
  };

  return (
    <div className="space-y-2">
      {/* Input row */}
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary flex-1"
        />
        <button
          type="button"
          onClick={() => handleAdd(inputValue)}
          disabled={!inputValue.trim() || items.length >= maxItems}
          className={cn(
            "p-2 rounded-md transition-colors",
            inputValue.trim() && items.length < maxItems
              ? buttonColors[variant]
              : "bg-white/5 text-muted-foreground cursor-not-allowed",
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Selected items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className={cn("cursor-default group", chipColors[variant])}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-1.5 opacity-60 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAdd(suggestion)}
              className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Form Content
// ============================================================================

interface PublishPageInnerProps {
  onExpand: () => void;
  onImport?: () => void;
}

function PublishPageInner({ onExpand, onImport }: PublishPageInnerProps) {
  const { state, dispatch, save, closeCropModal, handleCropComplete, workspace } =
    usePublishForm();

  // Auto-save hook
  const { lastSaved, isSaving: autoSaving } = useAutoSave(
    () => save(),
    state.isDirty,
  );

  // Image upload refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Get actual image values from workspace
  const coverImage = workspace.assets?.coverImage;
  const screenshots = workspace.assets?.screenshots || [];

  // Image handlers
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    dispatch({
      type: "OPEN_CROP_MODAL",
      payload: { file, imageType: "cover" },
    });
    if (coverInputRef.current) {coverInputRef.current.value = "";}
  };

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    dispatch({
      type: "OPEN_CROP_MODAL",
      payload: { file, imageType: "screenshot" },
    });
    if (screenshotInputRef.current) {screenshotInputRef.current.value = "";}
  };

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

  // Save status text
  const getSaveStatus = () => {
    if (autoSaving || state.isSaving) {
      return (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </span>
      );
    }
    if (state.isDirty) {
      return (
        <span className="flex items-center gap-1.5 text-amber-400">
          <AlertCircle className="h-3 w-3" />
          Unsaved changes
        </span>
      );
    }
    if (lastSaved) {
      return (
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Check className="h-3 w-3" />
          Saved
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-black via-black/95 to-black">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-black/40 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Publish Your Project
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs text-muted-foreground">
                Fill in the details to share with the community
              </p>
              <span className="text-xs">{getSaveStatus()}</span>
            </div>
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
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left Column: Scrollable Form */}
        <div className="flex-1 lg:max-w-2xl overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
              {/* ══════════════════════════════════════════════════════════
                  BASICS
                  ══════════════════════════════════════════════════════════ */}
              <section className="space-y-4">
                <SectionHeader
                  title="Project Details"
                  subtitle="The essentials about your project"
                />

                {/* Project Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="projectName" className="text-sm text-foreground">
                    Project Name *
                  </Label>
                  <Input
                    id="projectName"
                    value={state.projectName}
                    onChange={(e) =>
                      dispatch({ type: "SET_PROJECT_NAME", payload: e.target.value })
                    }
                    placeholder="What's your project called?"
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                {/* One-liner Pitch */}
                <div className="space-y-1.5">
                  <Label htmlFor="oneLiner" className="text-sm text-foreground">
                    One-liner Pitch *
                  </Label>
                  <Input
                    id="oneLiner"
                    value={state.oneLiner}
                    onChange={(e) =>
                      dispatch({ type: "SET_ONE_LINER", payload: e.target.value })
                    }
                    placeholder="Describe your project in one sentence"
                    maxLength={120}
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    {state.oneLiner.length}/120
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={state.description}
                    onChange={(e) =>
                      dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
                    }
                    placeholder="Tell us more about your project..."
                    rows={3}
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
                  />
                </div>

                {/* Category & Stage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm text-foreground">
                      Category
                    </Label>
                    <Select
                      value={state.category}
                      onValueChange={(value) =>
                        dispatch({
                          type: "SET_CATEGORY",
                          payload: value as typeof state.category,
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="stage" className="text-sm text-foreground">
                      Stage
                    </Label>
                    <Select
                      value={state.stage}
                      onValueChange={(value) =>
                        dispatch({
                          type: "SET_STAGE",
                          payload: value as typeof state.stage,
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGE_PROGRESSION.map((stage: StageConfig) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            <span className="flex items-center gap-2">
                              <stage.icon className="h-4 w-4" />
                              <span>{stage.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground">Tags</Label>
                  <ChipInput
                    items={state.tags}
                    onAdd={(tag) => dispatch({ type: "ADD_TAG", payload: tag })}
                    onRemove={(tag) => dispatch({ type: "REMOVE_TAG", payload: tag })}
                    suggestions={TAG_SUGGESTIONS}
                    placeholder="Add a tag..."
                    maxItems={8}
                  />
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  COVER IMAGE
                  ══════════════════════════════════════════════════════════ */}
              <section className="space-y-4">
                <SectionHeader
                  title="Cover Image"
                  subtitle="16:9 ratio recommended"
                  icon={<Image className="h-4 w-4" />}
                />

                {coverImage ? (
                  <div className="relative group rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-40 object-cover"
                    />
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
                      "w-full h-32 rounded-lg border-2 border-dashed border-white/10",
                      "flex flex-col items-center justify-center gap-2",
                      "text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.02]",
                      "transition-all cursor-pointer",
                      state.isUploading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {state.isUploading && state.cropModal.imageType === "cover" ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-sm">Uploading... {state.uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6" />
                        <span className="text-sm">Click to upload</span>
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
              </section>

              {/* ══════════════════════════════════════════════════════════
                  LINKS
                  ══════════════════════════════════════════════════════════ */}
              <section className="space-y-4">
                <SectionHeader
                  title="Links"
                  subtitle="Where people can find your project"
                  icon={<Globe className="h-4 w-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Live Demo */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="demoUrl"
                      className="text-sm text-foreground flex items-center gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      Live Demo
                    </Label>
                    <Input
                      id="demoUrl"
                      type="url"
                      value={state.demoUrl}
                      onChange={(e) =>
                        dispatch({ type: "SET_DEMO_URL", payload: e.target.value })
                      }
                      placeholder="https://your-demo.com"
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="githubUrl"
                      className="text-sm text-foreground flex items-center gap-2"
                    >
                      <Github className="h-3.5 w-3.5 text-muted-foreground" />
                      GitHub
                    </Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={state.githubUrl}
                      onChange={(e) =>
                        dispatch({ type: "SET_GITHUB_URL", payload: e.target.value })
                      }
                      placeholder="https://github.com/..."
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="websiteUrl"
                      className="text-sm text-foreground flex items-center gap-2"
                    >
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      Website
                    </Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={state.websiteUrl}
                      onChange={(e) =>
                        dispatch({ type: "SET_WEBSITE_URL", payload: e.target.value })
                      }
                      placeholder="https://your-project.com"
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>

                  {/* Demo Video */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="videoUrl"
                      className="text-sm text-foreground flex items-center gap-2"
                    >
                      <Video className="h-3.5 w-3.5 text-muted-foreground" />
                      Demo Video
                    </Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={state.demoVideoUrl}
                      onChange={(e) =>
                        dispatch({ type: "SET_VIDEO_URL", payload: e.target.value })
                      }
                      placeholder="YouTube or Loom URL"
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  COMMUNITY EXCHANGE
                  ══════════════════════════════════════════════════════════ */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    title="Community Exchange"
                    subtitle="Connect with other builders"
                    icon={<HandHelping className="h-4 w-4" />}
                  />
                  <GivesAsksExplainer />
                </div>

                {/* Asks */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground flex items-center gap-2">
                    <HandHelping className="h-3.5 w-3.5 text-amber-400" />
                    What I&apos;m Looking For
                  </Label>
                  <ChipInput
                    items={state.asks}
                    onAdd={(item) => dispatch({ type: "ADD_ASK", payload: item })}
                    onRemove={(item) => dispatch({ type: "REMOVE_ASK", payload: item })}
                    suggestions={[
                      "Feedback",
                      "Co-founder",
                      "Designer",
                      "Developer",
                      "User testers",
                      "Mentorship",
                    ]}
                    placeholder="e.g., Design feedback, Beta testers..."
                    variant="ask"
                  />
                </div>

                {/* Gives */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground flex items-center gap-2">
                    <Gift className="h-3.5 w-3.5 text-emerald-400" />
                    What I Can Offer
                  </Label>
                  <ChipInput
                    items={state.gives}
                    onAdd={(item) => dispatch({ type: "ADD_GIVE", payload: item })}
                    onRemove={(item) => dispatch({ type: "REMOVE_GIVE", payload: item })}
                    suggestions={[
                      "Product strategy",
                      "Frontend dev",
                      "Backend dev",
                      "Design feedback",
                      "User research",
                    ]}
                    placeholder="e.g., Code review, UX advice..."
                    variant="give"
                  />
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  SCREENSHOTS (Optional)
                  ══════════════════════════════════════════════════════════ */}
              <section className="space-y-4">
                <SectionHeader
                  title="Screenshots"
                  subtitle="Optional - showcase your project"
                  icon={<Image className="h-4 w-4" />}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {screenshots.map((url, index) => (
                    <div
                      key={url}
                      className="relative group rounded-lg overflow-hidden border border-white/10"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-20 object-cover"
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

                  {screenshots.length < 4 && (
                    <button
                      type="button"
                      onClick={() => screenshotInputRef.current?.click()}
                      disabled={state.isUploading}
                      className={cn(
                        "h-20 rounded-lg border-2 border-dashed border-white/10",
                        "flex flex-col items-center justify-center gap-1",
                        "text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.02]",
                        "transition-all cursor-pointer",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">Add</span>
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
              </section>

              {/* Mobile: Preview and Actions at bottom */}
              <div className="lg:hidden space-y-4 pt-4 border-t border-white/10">
                <LivePreviewCard />
                <PublishActions />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Sticky Preview (Desktop only) */}
        <div className="hidden lg:block w-96 border-l border-white/10 bg-black/20">
          <div className="sticky top-0 p-6 space-y-6 h-full overflow-auto">
            <LivePreviewCard />
            <PublishActions />
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={state.cropModal.isOpen}
        onClose={closeCropModal}
        imageFile={state.cropModal.imageFile}
        imageType={state.cropModal.imageType}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export interface PublishPageProps {
  workspace: Workspace;
  onExpand: () => void;
  onImport?: () => void;
}

export function PublishPage({ workspace, onExpand, onImport }: PublishPageProps) {
  return (
    <PublishFormProvider workspace={workspace}>
      <PublishPageInner onExpand={onExpand} onImport={onImport} />
    </PublishFormProvider>
  );
}
