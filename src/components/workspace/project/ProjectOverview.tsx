"use client";
import { formatDistanceToNow } from "date-fns";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

import type { WorkspaceTabId } from "../layout/WorkspaceTabs";

import { Stack } from "@/components/layout";
import { Badge, STAGE_COLORS, WORKSPACE_SURFACE } from "@/components/unified";
import {
  Lightbulb,
  TrendingUp,
  Users,
  ArrowRight,
  Layers3,
  StickyNote,
  FileArchive,
  Share2,
  Clock,
  Target,
  Zap,
  Pencil,
  Check,
  X,
} from "@/icons";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { FONT_SIZES } from "@/tokens/primitives/typography";
import type { Workspace } from "@/types";
import {
  calculateWorkspaceCompletion,
  getCompletionLabel,
} from "@/utils/workspaceCompletion";

interface ProjectOverviewProps {
  workspace: Workspace;
  onNavigateToTab: (tab: WorkspaceTabId) => void;
}

const STAGE_CONFIG: Record<string, { label: string; icon: typeof TrendingUp }> =
  {
    idea: { label: "Idea", icon: Lightbulb },
    research: { label: "Research", icon: Users },
    planning: { label: "Planning", icon: Target },
    building: { label: "Building", icon: Zap },
    testing: { label: "Testing", icon: TrendingUp },
    launching: { label: "Launching", icon: TrendingUp },
    scaling: { label: "Scaling", icon: TrendingUp },
  };

// ============================================================================
// Inline Editable Text Component
// ============================================================================

interface InlineEditableProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

function InlineEditable({
  value,
  onSave,
  className,
  inputClassName,
  placeholder = "Enter text...",
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={cn(
            "bg-transparent border-b-2 border-primary outline-none",
            inputClassName,
          )}
        />
        <button
          onClick={handleSave}
          className="p-1 rounded hover:bg-white/10 text-emerald-400"
          type="button"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 rounded hover:bg-white/10 text-muted-foreground"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        "group flex items-center gap-2 text-left hover:opacity-80 transition-opacity cursor-text",
        className,
      )}
      type="button"
    >
      <span>{value || placeholder}</span>
      <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}

/**
 * Get color for completion percentage
 */
function getCompletionColor(percentage: number): {
  ring: string;
  text: string;
  bg: string;
} {
  if (percentage >= 75) {
    return {
      ring: "#10b981", // green
      text: "text-green-500",
      bg: "bg-green-500/10",
    };
  }
  if (percentage >= 50) {
    return {
      ring: "#f59e0b", // amber
      text: "text-amber-500",
      bg: "bg-amber-500/10",
    };
  }
  return {
    ring: "#ef4444", // red
    text: "text-red-500",
    bg: "bg-red-500/10",
  };
}

export function ProjectOverview({
  workspace,
  onNavigateToTab,
}: ProjectOverviewProps) {
  // Get store actions for inline editing
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);

  const completion = calculateWorkspaceCompletion(workspace);
  const stageConfig = workspace.stage ? STAGE_CONFIG[workspace.stage] : null;
  const StageIcon = stageConfig?.icon || Lightbulb;
  const completionColor = getCompletionColor(completion.overall);
  const completionLabel = getCompletionLabel(completion.overall);

  // Handlers for inline editing
  const handleProjectNameChange = useCallback(
    (newName: string) => {
      updateWorkspace({ projectName: newName });
    },
    [updateWorkspace],
  );

  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      updateWorkspace({ projectDescription: newDescription });
    },
    [updateWorkspace],
  );

  // Calculate workspace stats
  const stats = {
    journalEntries: workspace.journal?.length || 0,
    pivots: workspace.pivots?.length || 0,
    documents: workspace.documents?.length || 0,
    versions: workspace.versions?.length || 0,
    lastModified: workspace.lastModified,
  };

  // Determine next actions based on completion
  const nextActions = [];
  if (completion.canvas < 50) {
    nextActions.push({
      title: "Complete your Project Canvas",
      description: `${completion.canvas}% complete. Fill out key sections to unlock publishing.`,
      action: "Go to Canvas",
      tab: "canvas" as WorkspaceTabId,
      icon: Layers3,
      urgent: true,
    });
  }

  if (stats.journalEntries === 0) {
    nextActions.push({
      title: "Start documenting your journey",
      description: "Capture learnings, customer interviews, and key decisions.",
      action: "Open Journey",
      tab: "journey" as WorkspaceTabId,
      icon: StickyNote,
      urgent: false,
    });
  }

  if (stats.documents === 0) {
    nextActions.push({
      title: "Upload supporting documents",
      description:
        "Add pitch decks, research, or evidence to strengthen your project.",
      action: "Add Documents",
      tab: "documents" as WorkspaceTabId,
      icon: FileArchive,
      urgent: false,
    });
  }

  // Publishing hidden for now - projects won't be public initially
  // if (!workspace.isPublic && completion.overall >= 40) {
  //   nextActions.push({
  //     title: "Ready to share?",
  //     description:
  //       "Your project is taking shape. Consider publishing for feedback.",
  //     action: "Publish Project",
  //     tab: "share" as WorkspaceTabId,
  //     icon: Share2,
  //     urgent: false,
  //   });
  // }

  // If no next actions, show advanced actions
  if (nextActions.length === 0) {
    nextActions.push({
      title: "Track your pivots",
      description: "View major shifts in your strategy over time.",
      action: "View Timeline",
      tab: "pivots" as WorkspaceTabId,
      icon: TrendingUp,
      urgent: false,
    });
  }

  return (
    <div className="w-full">
      <Stack gap="lg">
        {/* Redesigned Hero Section - Split Layout */}
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          {/* Main Project Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-xl backdrop-blur-sm">
            {/* Ambient background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.15] via-transparent to-transparent opacity-60" />

            <div className="relative">
              <Stack gap="sm">
                {/* Stage Badge & Title */}
                <div>
                  {stageConfig && workspace.stage && (
                    <div
                      className="mb-2 inline-flex items-center gap-2 rounded-full border backdrop-blur-sm py-1 px-2.5"
                      style={{
                        borderColor: WORKSPACE_SURFACE.subtle.border,
                        backgroundColor: WORKSPACE_SURFACE.subtle.background,
                      }}
                    >
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-md bg-white/10 shrink-0"
                        style={{
                          color:
                            STAGE_COLORS[
                              workspace.stage as keyof typeof STAGE_COLORS
                            ]?.text || STAGE_COLORS.idea.text,
                        }}
                        aria-hidden="true"
                      >
                        <StageIcon className="h-3 w-3" />
                      </div>
                      <span
                        className="font-semibold uppercase tracking-wider text-foreground leading-none"
                        style={{ fontSize: FONT_SIZES.xs }}
                      >
                        {stageConfig.label}
                      </span>
                    </div>
                  )}
                  <InlineEditable
                    value={workspace.projectName || "Untitled Project"}
                    onSave={handleProjectNameChange}
                    className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl"
                    inputClassName="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl w-full"
                    placeholder="Project Name"
                  />
                </div>

                {/* Description */}
                <InlineEditable
                  value={workspace.projectDescription || workspace.oneLiner || ""}
                  onSave={handleDescriptionChange}
                  className="max-w-2xl text-sm leading-relaxed text-muted-foreground/90"
                  inputClassName="max-w-2xl text-sm leading-relaxed text-muted-foreground w-full"
                  placeholder="Add a description to help others understand your project..."
                />

                {/* Metadata Badges - Simple */}
                <div className="flex flex-wrap gap-2">
                  {workspace.isPublic && (
                    <Badge variant="default" className="px-3 py-1">
                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                      Published
                    </Badge>
                  )}
                  {workspace.location && (
                    <Badge variant="secondary" className="px-3 py-1">
                      {workspace.location === "buffalo"
                        ? "Buffalo based"
                        : "Remote team"}
                    </Badge>
                  )}
                  {workspace.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                  {workspace.tags && workspace.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="border-white/20 bg-white/5 px-3 py-1 text-muted-foreground"
                    >
                      +{workspace.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </Stack>
            </div>
          </div>

          {/* Progress & Quick Stats Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4 shadow-lg">
            <Stack gap="md">
              {/* Circular Progress - Simplified */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <svg width="72" height="72" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      className="text-white/10"
                    />
                    {/* Progress circle with subtle color */}
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke={completionColor.ring}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${(completion.overall / 100) * 201.06} 201.06`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-xl font-bold text-foreground">
                      {completion.overall}%
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {completionLabel}
                </p>
              </div>

              {/* Mini Stats - Compact grid */}
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5">
                  <Layers3 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Canvas</span>
                  <span className="ml-auto text-sm font-bold tabular-nums text-foreground">
                    {completion.canvas}%
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5">
                  <StickyNote className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Journey</span>
                  <span className="ml-auto text-sm font-bold tabular-nums text-foreground">
                    {stats.journalEntries}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Pivots</span>
                  <span className="ml-auto text-sm font-bold tabular-nums text-foreground">
                    {stats.pivots}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5">
                  <FileArchive className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Docs</span>
                  <span className="ml-auto text-sm font-bold tabular-nums text-foreground">
                    {stats.documents}
                  </span>
                </div>
              </div>

              {/* Last Updated - Inline */}
              <p className="text-center text-xs text-muted-foreground">
                <Clock className="mr-1 inline h-3 w-3" />
                Updated{" "}
                {formatDistanceToNow(new Date(stats.lastModified), {
                  addSuffix: true,
                })}
              </p>
            </Stack>
          </div>
        </div>

        {/* Suggested Next Steps - Redesigned */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                What&apos;s Next?
              </h2>
              <p className="text-sm text-muted-foreground">
                Keep your project moving forward
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {nextActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => onNavigateToTab(action.tab)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300",
                    action.urgent
                      ? "border-primary/50 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] hover:shadow-lg",
                  )}
                >
                  {/* Background decoration */}
                  {action.urgent && (
                    <>
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                      <div className="absolute right-4 top-4">
                        <div className="animate-pulse rounded-full bg-primary/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                          Priority
                        </div>
                      </div>
                    </>
                  )}

                  <div className="relative flex flex-col gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                        action.urgent
                          ? "bg-gradient-to-br from-primary/40 to-primary/20 shadow-lg shadow-primary/30"
                          : "bg-gradient-to-br from-white/15 to-white/5",
                      )}
                    >
                      <ActionIcon
                        className={cn(
                          "h-7 w-7",
                          action.urgent ? "text-primary" : "text-foreground/80",
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold leading-tight text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground/90">
                        {action.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                      <span>{action.action}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Tools - Redesigned */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Your Toolkit
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to build and iterate
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => onNavigateToTab("canvas")}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 text-left transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-lg"
            >
              <div className="relative space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Layers3 className="h-7 w-7 text-primary" />
                </div>

                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground">
                    Project Canvas
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground/80">
                    Map what makes your project special
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      Progress
                    </span>
                    <span className="font-bold tabular-nums text-foreground">
                      {completion.canvas}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                      style={{ width: `${completion.canvas}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigateToTab("documents")}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 text-left transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-lg"
            >
              <div className="relative space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <FileArchive className="h-7 w-7 text-primary" />
                </div>

                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground">
                    Evidence Library
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground/80">
                    Store decks, research, and materials
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-bold tabular-nums text-primary">
                      {stats.documents}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {stats.documents === 0
                      ? "No files yet"
                      : stats.documents === 1
                        ? "file"
                        : "files"}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </Stack>
    </div>
  );
}
