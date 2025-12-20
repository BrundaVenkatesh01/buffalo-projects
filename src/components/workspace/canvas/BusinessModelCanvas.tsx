"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type React from "react";
import { toast } from "sonner";

import { BMCBlockTooltip } from "./BMCBlockTooltip";
import { BMCFieldDialog } from "./BMCFieldDialog";

import { Stack } from "@/components/layout";
import { ProgressRingMini } from "@/components/motion";
import {
  Badge,
  Button,
  Skeleton,
  WORKSPACE_SURFACE,
} from "@/components/unified";
import { BMC_FIELDS, type BMCFieldConfig } from "@/constants/bmcFields";
import {
  CheckCircle2,
  FileText,
  Download,
  Camera,
  Layers3,
  AlertCircle,
  HelpCircle,
} from "@/icons";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { CanvasBlockId } from "@/types";

// BMC field definitions and types imported from centralized constants file

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BMC BLOCK COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BMCBlockProps {
  field: BMCFieldConfig;
  value: string;
  isComplete: boolean;
  showHints: boolean;
  onExpand: () => void;
  onChange: (value: string) => void;
}

function BMCBlock({ field, value, isComplete, showHints, onExpand, onChange }: BMCBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get documents to calculate evidence count
  const documents = useWorkspaceStore(
    (state) => state.currentWorkspace?.documents ?? [],
  );

  // Count documents linked to this block
  const evidenceCount = useMemo(() => {
    return documents.filter((doc) => doc.linkedFields?.includes(field.id))
      .length;
  }, [documents, field.id]);

  // Sync edit value when value prop changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleStartEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editValue !== value) {
      onChange(editValue);
    }
    setIsEditing(false);
  }, [editValue, value, onChange]);

  const handleCancelEdit = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancelEdit();
      }
      // Allow Enter for new lines in textarea
    },
    [handleCancelEdit],
  );

  const handleBlockKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {return;}
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsEditing(true);
    }
  };

  // Check if content is overflowing
  const hasLongContent = value && value.length > 200;
  const contentWordCount = value ? value.split(/\s+/).length : 0;

  return (
    <m.div
      role="button"
      tabIndex={0}
      onKeyDown={handleBlockKeyDown}
      onClick={isEditing ? undefined : handleStartEditing}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={isEditing ? {} : { scale: 1.01 }}
      whileTap={isEditing ? {} : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Border styling
        value ? "border-2" : "border-2 border-dashed",
        // Core value prop styling
        field.isCore && [
          "bg-gradient-to-br from-primary/[0.15] via-primary/[0.08] to-transparent",
          "border-primary/50",
          "shadow-2xl shadow-primary/20",
        ],
        // Completed non-core blocks
        isComplete &&
          !field.isCore && [
            "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
            "border-emerald-400/30",
            "shadow-lg shadow-emerald-400/5",
          ],
        // In progress blocks
        value &&
          !isComplete &&
          !field.isCore && [
            "bg-gradient-to-br from-white/[0.06] to-white/[0.01]",
            "border-amber-400/30",
            "shadow-md",
          ],
        // Empty blocks
        !value && !field.isCore && ["bg-white/[0.02]", "border-white/20"],
        // Hover states
        "hover:border-primary/70 hover:shadow-2xl hover:shadow-primary/15",
      )}
      style={{
        gridArea: field.gridArea,
        minHeight: field.isCore ? "240px" : "160px",
      }}
      aria-label={`${field.title}: ${value || "Not yet filled"}. Click to edit. ${evidenceCount > 0 ? `${evidenceCount} evidence ${evidenceCount === 1 ? "file" : "files"} attached` : ""}`}
    >
      {/* Ambient glow effect for core block */}
      {field.isCore && (
        <>
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        </>
      )}

      {/* Header - Clean and functional */}
      <div
        className={cn(
          "relative flex items-center justify-between gap-3 border-b backdrop-blur-sm",
          field.isCore
            ? "bg-primary/10 px-5 py-4"
            : "bg-white/[0.03] px-4 py-3",
        )}
        style={{
          borderColor: field.isCore
            ? "rgba(0, 112, 243, 0.3)"
            : WORKSPACE_SURFACE.subtle.border,
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3
            id={`${field.id}-title`}
            className={cn(
              "font-bold leading-tight tracking-tight truncate",
              field.isCore
                ? "text-base text-primary"
                : "text-sm text-foreground",
            )}
          >
            {field.title}
          </h3>
          <BMCBlockTooltip
            blockId={field.id}
            showHints={showHints}
            className="opacity-60 hover:opacity-100"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Evidence Badge */}
          {evidenceCount > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary border-0 flex items-center gap-1"
              aria-label={`${evidenceCount} evidence ${evidenceCount === 1 ? "file" : "files"}`}
            >
              <FileText className="h-2.5 w-2.5" />
              {evidenceCount}
            </Badge>
          )}

          {/* Completion indicator */}
          {isComplete && (
            <div className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
          )}
        </div>
      </div>

      {/* Content Area - Inline Editing or Preview */}
      <div
        className={cn(
          "relative flex-1 flex flex-col",
          field.isCore ? "p-6" : "p-5",
        )}
      >
        {isEditing ? (
          /* ─── INLINE EDITING MODE ─── */
          <div className="flex flex-col h-full">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              onBlur={handleSaveEdit}
              placeholder={field.hint}
              className={cn(
                "flex-1 w-full bg-transparent resize-none outline-none",
                "leading-relaxed text-foreground/90 font-normal",
                "placeholder:text-muted-foreground/50",
                field.isCore ? "text-base" : "text-sm",
              )}
            />
            {/* Editing toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand();
                  }}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Layers3 className="h-3 w-3" />
                  AI Suggestions
                </button>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">
                  Esc
                </kbd>
                <span>to cancel</span>
              </div>
            </div>
          </div>
        ) : value ? (
          /* ─── CONTENT PREVIEW MODE ─── */
          <>
            <div
              className={cn(
                "relative flex-1 overflow-hidden",
                hasLongContent && "mask-gradient-bottom",
              )}
            >
              <p
                className={cn(
                  "leading-relaxed text-foreground/90 font-normal whitespace-pre-wrap",
                  field.isCore ? "text-base" : "text-sm",
                  !hasLongContent &&
                    (field.isCore ? "line-clamp-8" : "line-clamp-6"),
                )}
              >
                {value}
              </p>
            </div>

            {/* Content overflow indicator */}
            {hasLongContent && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/60">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="font-medium">
                  {contentWordCount} words • Click to edit
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            )}
          </>
        ) : (
          /* ─── EMPTY STATE ─── */
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70 group-hover:opacity-100 transition-all duration-300">
            <div
              className={cn(
                "rounded-full p-3 bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300",
                field.isCore && "p-4",
              )}
            >
              <AlertCircle
                className={cn(
                  "text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300",
                  field.isCore ? "h-6 w-6" : "h-5 w-5",
                )}
              />
            </div>
            <div className="space-y-2">
              <p
                className={cn(
                  "font-medium text-muted-foreground group-hover:text-foreground transition-colors",
                  field.isCore ? "text-sm" : "text-xs",
                )}
              >
                {field.hint}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 border border-primary/20 group-hover:border-primary/30 transition-all">
                <span className="text-xs font-semibold text-primary">
                  Click to add
                </span>
                <kbd className="text-[10px] font-mono text-primary/60">
                  Enter
                </kbd>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover edit indicator - only show when not editing and has content */}
      <AnimatePresence>
        {isHovered && value && !isEditing && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
          >
            <span>Click to edit</span>
            <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-mono">
              ↵
            </kbd>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

// Field dialog component extracted to @/components/workspace/BMCFieldDialog

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN GRID COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function BusinessModelCanvasRefactored() {
  const workspace = useWorkspaceStore((state) => state.currentWorkspace);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const saveAndCreateSnapshot = useWorkspaceStore(
    (state) => state.saveAndCreateSnapshot,
  );

  // Onboarding hints
  const showBMCHints = useOnboardingStore((state) => state.showBMCHints);
  const toggleBMCHints = useOnboardingStore((state) => state.toggleBMCHints);

  // Block focus from intro modal
  const pendingBlockFocus = useOnboardingStore(
    (state) => state.pendingBlockFocus,
  );
  const setPendingBlockFocus = useOnboardingStore(
    (state) => state.setPendingBlockFocus,
  );

  const [expandedField, setExpandedField] = useState<CanvasBlockId | null>(
    null,
  );
  const [displayedPercent, setDisplayedPercent] = useState(0);

  const projectName = workspace?.projectName ?? "Untitled project";
  const description = workspace?.projectDescription ?? "";

  // ─── COMPLETION TRACKING ──────────────────────────────────────────
  const completion = useMemo(() => {
    if (!workspace) {
      return { completed: 0, total: BMC_FIELDS.length, evidenceValidated: 0 };
    }

    const documents = workspace.documents ?? [];
    let completed = 0;
    let evidenceValidated = 0;

    BMC_FIELDS.forEach((field) => {
      const value = workspace.bmcData?.[field.id];
      if (value && value.trim().length > 0) {
        completed++;
      }

      // Check if this block has evidence
      const hasEvidence = documents.some((doc) =>
        doc.linkedFields?.includes(field.id),
      );
      if (hasEvidence) {
        evidenceValidated++;
      }
    });

    return { completed, total: BMC_FIELDS.length, evidenceValidated };
  }, [workspace]);

  // ─── HANDLERS ─────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field: CanvasBlockId, value: string) => {
      if (!workspace) {
        return;
      }

      updateWorkspace({
        bmcData: {
          ...workspace.bmcData,
          [field]: value,
        },
        lastModified: new Date().toISOString(),
      });
    },
    [workspace, updateWorkspace],
  );

  // Animate percentage number smoothly
  const percentComplete = useMemo(
    () => Math.round((completion.completed / completion.total) * 100),
    [completion.completed, completion.total],
  );

  useEffect(() => {
    const duration = 800; // ms
    const steps = 30;
    const stepDuration = duration / steps;
    const diff = percentComplete - displayedPercent;
    const increment = diff / steps;

    if (diff === 0) {
      return;
    }

    let current = 0;
    const timer = setInterval(() => {
      current++;
      if (current >= steps) {
        setDisplayedPercent(percentComplete);
        clearInterval(timer);
      } else {
        setDisplayedPercent((prev) => Math.round(prev + increment));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [percentComplete, displayedPercent]);

  // ─── HANDLE PENDING BLOCK FOCUS FROM INTRO MODAL ────────────────────
  useEffect(() => {
    if (pendingBlockFocus && workspace) {
      // Small delay to ensure the canvas has rendered
      const timer = setTimeout(() => {
        setExpandedField(pendingBlockFocus);
        setPendingBlockFocus(null); // Clear after consuming
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [pendingBlockFocus, workspace, setPendingBlockFocus]);

  // ─── LOADING STATE ────────────────────────────────────────────────
  if (!workspace) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  const expandedFieldConfig = expandedField
    ? BMC_FIELDS.find((f) => f.id === expandedField)
    : null;

  return (
    <div className="w-full">
      <Stack gap="lg">
        {/* ─── HERO PROGRESS SECTION ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-5 shadow-xl">
          {/* Ambient background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent opacity-60" />

          <div className="relative">
            {/* Header Row */}
            <div className="mb-4 flex items-start justify-between gap-4">
              {/* Left: Title & Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                    <Layers3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Business Model Canvas
                    </h2>
                    <p className="text-xs text-muted-foreground/70">
                      Click any block to expand and edit
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Progress Circle */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <ProgressRingMini
                    value={percentComplete}
                    size={64}
                    strokeWidth={5}
                    animated={true}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <m.p
                      key={displayedPercent}
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="font-display text-lg font-bold tabular-nums text-foreground"
                    >
                      {displayedPercent}%
                    </m.p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
              {/* Left: Quick Stats */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold tabular-nums text-emerald-400">
                      {completion.completed}
                    </span>
                    <span className="text-xs font-medium text-emerald-400/80">
                      / {completion.total} blocks
                    </span>
                  </div>
                </div>

                {completion.evidenceValidated > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold tabular-nums text-primary">
                        {completion.evidenceValidated}
                      </span>
                      <span className="text-xs font-medium text-primary/80">
                        with evidence
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    try {
                      // Navigate to documents tab
                      const event = new CustomEvent("workspace:navigate", {
                        detail: { tab: "documents" },
                      });
                      window.dispatchEvent(event);
                      toast.success("Opening documents tab", {
                        description:
                          "Upload files and link them to canvas blocks",
                      });
                    } catch {
                      toast.error("Failed to navigate to documents");
                    }
                  }}
                  className="group flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
                >
                  <FileText className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Add Evidence
                  </span>
                </button>

                <button
                  onClick={() => {
                    try {
                      // Create a text representation of the canvas
                      const canvasText = BMC_FIELDS.map((field) => {
                        const value =
                          workspace.bmcData?.[field.id] || "Not filled";
                        return `${field.title}:\n${value}\n`;
                      }).join("\n");

                      const blob = new Blob(
                        [
                          `Business Model Canvas - ${workspace.projectName}\n`,
                          `Generated: ${new Date().toLocaleDateString()}\n`,
                          `\n${"=".repeat(60)}\n\n`,
                          canvasText,
                        ],
                        { type: "text/plain" },
                      );

                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `BMC-${workspace.code || "export"}-${Date.now()}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);

                      toast.success("Canvas exported successfully", {
                        description: `Saved as ${a.download}`,
                      });
                    } catch (error) {
                      console.error("Export failed:", error);
                      toast.error("Failed to export canvas");
                    }
                  }}
                  className="group flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
                >
                  <Download className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Export
                  </span>
                </button>

                <button
                  onClick={() => {
                    void (async () => {
                      try {
                        // Create a version snapshot
                        const pivotDetected = await saveAndCreateSnapshot(
                          "Manual snapshot from Canvas",
                        );

                        if (pivotDetected) {
                          toast.success("Snapshot created - Pivot detected!", {
                            description:
                              "Significant changes found. View in Pivots tab.",
                          });
                        } else {
                          toast.success("Snapshot created successfully", {
                            description: "Canvas version saved to history",
                          });
                        }

                        // Optional: Navigate to pivots tab to show the snapshot
                        setTimeout(() => {
                          const event = new CustomEvent("workspace:navigate", {
                            detail: { tab: "pivots" },
                          });
                          window.dispatchEvent(event);
                        }, 500);
                      } catch (error) {
                        console.error("Snapshot failed:", error);
                        toast.error("Failed to create snapshot");
                      }
                    })();
                  }}
                  className="group flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
                >
                  <Camera className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Snapshot
                  </span>
                </button>

                {/* Hints Toggle */}
                <button
                  onClick={() => {
                    toggleBMCHints();
                    toast.success(
                      showBMCHints ? "Block hints hidden" : "Block hints shown",
                      {
                        description: showBMCHints
                          ? "Click the help icons when you need guidance"
                          : "Hover over the ? icons for explanations and tips",
                      },
                    );
                  }}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg border px-3.5 py-2 transition-all duration-200",
                    showBMCHints
                      ? "border-amber-400/40 bg-amber-400/10 hover:border-amber-400/60 hover:bg-amber-400/20"
                      : "border-white/20 bg-white/5 hover:border-primary/40 hover:bg-primary/10",
                  )}
                  aria-pressed={showBMCHints}
                  aria-label={showBMCHints ? "Hide block hints" : "Show block hints"}
                >
                  <HelpCircle
                    className={cn(
                      "h-4 w-4 transition-colors",
                      showBMCHints
                        ? "text-amber-400"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      showBMCHints ? "text-amber-400" : "text-foreground",
                    )}
                  >
                    Hints {showBMCHints ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── THE CANVAS GRID ────────────────────────────────── */}
        <div>
          {/* Mobile: Optimized stack */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {BMC_FIELDS.map((field) => {
              const value = workspace.bmcData?.[field.id] ?? "";
              const isComplete = value.trim().length > 0;

              return (
                <BMCBlock
                  key={field.id}
                  field={field}
                  value={value}
                  isComplete={isComplete}
                  showHints={showBMCHints}
                  onExpand={() => setExpandedField(field.id)}
                  onChange={(newValue) => handleChange(field.id, newValue)}
                />
              );
            })}
          </div>

          {/* Desktop: Authentic BMC Layout - Traditional Strategyzer Structure */}
          <div className="hidden md:block w-full">
            {/* Main Canvas Container with Background */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 shadow-2xl">
              {/* BMC Grid - Authentic Proportions */}
              <div
                className="w-full"
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr",
                  gridTemplateRows: "auto auto auto auto",
                  gridTemplateAreas: `
                    "partners partners value value segments"
                    "activities resources value value relationships"
                    "activities resources value value channels"
                    "costs costs costs revenue revenue"
                  `,
                }}
              >
                {BMC_FIELDS.map((field) => {
                  const value = workspace.bmcData?.[field.id] ?? "";
                  const isComplete = value.trim().length > 0;

                  return (
                    <BMCBlock
                      key={field.id}
                      field={field}
                      value={value}
                      isComplete={isComplete}
                      showHints={showBMCHints}
                      onExpand={() => setExpandedField(field.id)}
                      onChange={(newValue) => handleChange(field.id, newValue)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Stack>

      {/* ─── EXPANDED BLOCK DIALOG ─────────────────────────── */}
      {expandedFieldConfig && (
        <BMCFieldDialog
          field={expandedFieldConfig}
          value={workspace.bmcData?.[expandedFieldConfig.id] ?? ""}
          projectName={projectName}
          description={description}
          bmcData={workspace.bmcData || {}}
          isOpen={expandedField === expandedFieldConfig.id}
          onClose={() => setExpandedField(null)}
          onChange={(newValue: string) =>
            handleChange(expandedFieldConfig.id, newValue)
          }
        />
      )}

      {/* ─── COMPLETION CTA ─────────────────────────────────── */}
      <AnimatePresence>
        {percentComplete === 100 && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/[0.15] via-primary/[0.08] to-accent/[0.12] p-12 text-center shadow-2xl shadow-primary/20"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse" />

            {/* Glow orbs */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />

            <div className="relative space-y-6">
              {/* Checkmark icon */}
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/20"
              >
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </m.div>

              <div className="space-y-3">
                <h3 className="font-display text-3xl font-bold text-foreground">
                  Canvas Complete! 🎉
                </h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your business model is fully mapped. Ready to publish and get
                  feedback from Buffalo mentors?
                </p>
              </div>

              <Button
                size="xl"
                onClick={() => {
                  // Navigate to share tab
                  const event = new CustomEvent("workspace:navigate", {
                    detail: { tab: "share" },
                  });
                  window.dispatchEvent(event);
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Publish Project
                  <m.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    →
                  </m.span>
                </span>
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BusinessModelCanvasRefactored;
