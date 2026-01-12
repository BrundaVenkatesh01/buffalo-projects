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
  Sparkles,
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

function getCompletionColor(percentage: number): {
  gradient: string;
  text: string;
  bg: string;
} {
  if (percentage >= 75) {
    return {
      gradient: "from-green-400 via-emerald-400 to-teal-400",
      text: "text-green-400",
      bg: "bg-green-500/10",
    };
  }
  if (percentage >= 50) {
    return {
      gradient: "from-amber-400 via-orange-400 to-yellow-400",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
    };
  }
  return {
    gradient: "from-red-400 via-pink-400 to-rose-400",
    text: "text-red-400",
    bg: "bg-red-500/10",
  };
}

export function ProjectOverview({
  workspace,
  onNavigateToTab,
}: ProjectOverviewProps) {
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);

  const completion = calculateWorkspaceCompletion(workspace);
  const stageConfig = workspace.stage ? STAGE_CONFIG[workspace.stage] : null;
  const StageIcon = stageConfig?.icon || Lightbulb;
  const completionColor = getCompletionColor(completion.overall);
  const completionLabel = getCompletionLabel(completion.overall);

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

  const stats = {
    journalEntries: workspace.journal?.length || 0,
    pivots: workspace.pivots?.length || 0,
    documents: workspace.documents?.length || 0,
    versions: workspace.versions?.length || 0,
    lastModified: workspace.lastModified,
  };

  const nextActions = [];
  if (completion.canvas < 50) {
    nextActions.push({
      title: "Complete your Project Canvas",
      description: `${completion.canvas}% complete. Fill out key sections to unlock publishing.`,
      action: "Go to Canvas",
      tab: "canvas" as WorkspaceTabId,
      icon: Layers3,
      urgent: true,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
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
      gradient: "from-purple-500 via-pink-500 to-rose-500",
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
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
    });
  }

  if (nextActions.length === 0) {
    nextActions.push({
      title: "Track your pivots",
      description: "View major shifts in your strategy over time.",
      action: "View Timeline",
      tab: "pivots" as WorkspaceTabId,
      icon: TrendingUp,
      urgent: false,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    });
  }

  return (
    <div className="w-full">
      <Stack gap="lg">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.15] via-transparent to-transparent opacity-60" />

            <div className="relative">
              <Stack gap="sm">
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

                <InlineEditable
                  value={workspace.projectDescription || workspace.oneLiner || ""}
                  onSave={handleDescriptionChange}
                  className="max-w-2xl text-sm leading-relaxed text-muted-foreground/90"
                  inputClassName="max-w-2xl text-sm leading-relaxed text-muted-foreground w-full"
                  placeholder="Add a description to help others understand your project..."
                />

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

          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-lg backdrop-blur-sm">
            <Stack gap="md">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <svg width="72" height="72" className="transform -rotate-90">
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-white/10"
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={cn("stop-color-[currentColor]", completionColor.text)} />
                        <stop offset="100%" className={cn("stop-color-[currentColor]", completionColor.text)} style={{opacity: 0.6}} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke="url(#progress-gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(completion.overall / 100) * 201.06} 201.06`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className={cn("font-display text-xl font-bold bg-gradient-to-br bg-clip-text text-transparent", completionColor.gradient)}>
                      {completion.overall}%
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs font-medium text-neutral-300">
                  {completionLabel}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 px-3 py-2 backdrop-blur-sm">
                  <Layers3 className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-neutral-300">Canvas</span>
                  <span className="ml-auto text-base font-bold tabular-nums text-white">
                    {completion.canvas}%
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 px-3 py-2 backdrop-blur-sm">
                  <StickyNote className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-neutral-300">Journey</span>
                  <span className="ml-auto text-base font-bold tabular-nums text-white">
                    {stats.journalEntries}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 px-3 py-2 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-neutral-300">Pivots</span>
                  <span className="ml-auto text-base font-bold tabular-nums text-white">
                    {stats.pivots}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 px-3 py-2 backdrop-blur-sm">
                  <FileArchive className="h-4 w-4 text-orange-400" />
                  <span className="text-xs text-neutral-300">Docs</span>
                  <span className="ml-auto text-base font-bold tabular-nums text-white">
                    {stats.documents}
                  </span>
                </div>
              </div>

              <p className="text-center text-xs text-neutral-400">
                <Clock className="mr-1 inline h-3 w-3" />
                Updated{" "}
                {formatDistanceToNow(new Date(stats.lastModified), {
                  addSuffix: true,
                })}
              </p>
            </Stack>
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                What&apos;s Next?
              </h2>
              <p className="text-sm text-neutral-300">
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
                  className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 text-left transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", action.gradient)} />
                  {action.urgent && (
                    <div className="absolute right-4 top-4">
                      <div className={cn("rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r", action.gradient, "text-white")}>
                        <Sparkles className="inline h-3 w-3 mr-1" />
                        Priority
                      </div>
                    </div>
                  )}

                  <div className="relative flex flex-col gap-4">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 bg-gradient-to-br",
                        action.gradient
                      )}
                    >
                      <ActionIcon className="h-8 w-8 text-white" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold leading-tight text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-300">
                        {action.description}
                      </p>
                    </div>

                    <div className={cn("mt-2 flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3 bg-gradient-to-r bg-clip-text text-transparent", action.gradient)}>
                      <span>{action.action}</span>
                      <ArrowRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", action.gradient.replace('from-', 'text-').split(' ')[0])} style={{color: 'currentColor'}} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Your Toolkit
              </h2>
              <p className="text-sm text-neutral-300">
                Everything you need to build and iterate
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => onNavigateToTab("canvas")}
              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6 text-left transition-all duration-300 hover:from-blue-500/15 hover:to-cyan-500/10 hover:border-blue-500/40 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Layers3 className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    Project Canvas
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-300">
                    Map what makes your project special
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-400">
                      Progress
                    </span>
                    <span className="font-bold tabular-nums text-white">
                      {completion.canvas}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 shadow-lg shadow-blue-500/50"
                      style={{ width: `${completion.canvas}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigateToTab("documents")}
              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-6 text-left transition-all duration-300 hover:from-orange-500/15 hover:to-amber-500/10 hover:border-orange-500/40 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <FileArchive className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    Evidence Library
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-300">
                    Store decks, research, and materials
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                    <span className="text-xl font-bold tabular-nums text-white">
                      {stats.documents}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-300">
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