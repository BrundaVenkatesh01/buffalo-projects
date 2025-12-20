"use client";

import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { WorkspaceErrorBoundary } from "../common/WorkspaceErrorBoundary";
import { useEditorShortcuts } from "../hooks/useEditorShortcuts";

import { EditorStatusBar } from "./EditorStatusBar";
import { VersionHistoryPanel } from "./VersionHistoryPanel";
import type { WorkspaceTabId } from "./WorkspaceTabs";

import { UnifiedImportDialog } from "@/components/import";
import { Stack } from "@/components/layout";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Textarea,
} from "@/components/unified";
import { useAutosave } from "@/hooks/useAutosave";
import { AlertCircle, Loader2 } from "@/icons";
import { cn } from "@/lib/utils";
import { urlAnalyzerService } from "@/services/urlAnalyzerService";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace, CanvasBlockId, ProjectDocument } from "@/types";
// import { calculateWorkspaceCompletion } from "@/utils/workspaceCompletion";

// Code-split workspace components - only load active tab
const WorkspaceContextPanel = dynamic(
  () =>
    import("./WorkspaceContextPanel").then((mod) => ({
      default: mod.WorkspaceContextPanel,
    })),
  {
    loading: () => <div className="h-full w-72 animate-pulse bg-white/5" />,
    ssr: false,
  },
);

const ProjectOverview = dynamic(
  () =>
    import("../project/ProjectOverview").then((mod) => ({
      default: mod.ProjectOverview,
    })),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
    ssr: false,
  },
);

const BusinessModelCanvas = dynamic(
  () => import("../canvas/BusinessModelCanvas"),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
    ssr: false, // Workspace is always client-side
  },
);

const DocumentManager = dynamic(() => import("../documents/DocumentManager"), {
  loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
  ssr: false,
});

// VersionHistory is now inside VersionHistoryPanel component

const WorkspaceSharePanel = dynamic(
  () => import("../publishing/WorkspaceSharePanel"),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
    ssr: false,
  },
);

const PublishPage = dynamic(
  () =>
    import("../publishing/PublishPage").then((mod) => ({
      default: mod.PublishPage,
    })),
  {
    loading: () => <Skeleton className="h-full w-full rounded-3xl" />,
    ssr: false,
  },
);

const ProjectJourney = dynamic(
  () =>
    import("../project/ProjectJourney").then((mod) => ({
      default: mod.ProjectJourney,
    })),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-3xl" />,
    ssr: false,
  },
);

// TrackSelector removed - users now go directly to editor without choosing Quick/Full track
// QuickSharePanel removed - consolidated into single publishing flow

interface WorkspaceEditorProps {
  workspaceId: string;
}

// const STAGE_LABELS: Record<string, string> = {
//   idea: "Idea",
//   research: "Research",
//   planning: "Planning",
//   building: "Building",
//   testing: "Testing",
//   launching: "Launching",
//   scaling: "Scaling",
// };

const AUTOSAVE_INTERVAL = 10_000;

export function WorkspaceEditor({ workspaceId }: WorkspaceEditorProps) {
  const router = useRouter();
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const loadWorkspace = useWorkspaceStore((state) => state.loadWorkspace);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);
  const clearError = useWorkspaceStore((state) => state.clearError);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const saveWorkspace = useWorkspaceStore((state) => state.saveWorkspace);
  const saveAndCreateSnapshot = useWorkspaceStore(
    (state) => state.saveAndCreateSnapshot,
  );
  const loading = useWorkspaceStore((state) => state.loading);
  const error = useWorkspaceStore((state) => state.error);

  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("overview");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [isSnapshotDialogOpen, setSnapshotDialogOpen] = useState(false);
  const [snapshotNote, setSnapshotNote] = useState("");
  const [isSnapshotSaving, setIsSnapshotSaving] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isVersionHistoryCollapsed, setIsVersionHistoryCollapsed] =
    useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  // Default to full editor (false) - users go directly to unified tabs
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastAutosaveTokenRef = useRef<string | null>(null);

  // Use new autosave hook with mutex-based concurrency control
  const {
    performSave: triggerAutosave,
    saveNow: saveImmediately,
    cancelPending: cancelAutosave,
    clearQueue: clearAutosaveQueue,
    state: autosaveState,
  } = useAutosave({
    interval: AUTOSAVE_INTERVAL,
    maxRetries: 3,
    onSuccess: () => {
      // Mark as saved in UI
      setSaveStatus("saved");
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
      saveStatusTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    },
    onError: (error) => {
      console.error("Autosave failed after retries:", error);
      // Error toast is handled by the hook
    },
  });

  // Aliases for backward compatibility
  const isSaving = autosaveState.isSaving;
  const isAutosaving = autosaveState.isPending || autosaveState.isSaving;
  const dirty = autosaveState.isDirty;

  useEffect(() => {
    clearError();
    lastAutosaveTokenRef.current = null;
    void loadWorkspace(workspaceId);

    return () => {
      // Cancel any pending saves and clear queue on workspace switch
      clearAutosaveQueue();
      clearWorkspace();
      lastAutosaveTokenRef.current = null;
    };
  }, [
    workspaceId,
    loadWorkspace,
    clearWorkspace,
    clearError,
    clearAutosaveQueue,
  ]);

  // Reset save status when workspace loads
  useEffect(() => {
    if (currentWorkspace) {
      setSaveStatus("idle");
    }
  }, [currentWorkspace]);

  // Auto-set publishTrack to "full" if not set (skip TrackSelector entirely)
  useEffect(() => {
    if (currentWorkspace && !currentWorkspace.publishTrack) {
      updateWorkspace({ publishTrack: "full" });
    }
  }, [currentWorkspace, updateWorkspace]);

  useEffect(() => {
    if (!isSnapshotDialogOpen) {
      setSnapshotNote("");
      setIsSnapshotSaving(false);
    }
  }, [isSnapshotDialogOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, []);

  const workspaceCode = currentWorkspace?.code;
  const workspaceLastModified = currentWorkspace?.lastModified ?? "no-ts";

  // Trigger autosave when workspace changes
  useEffect(() => {
    if (!workspaceCode || loading) {
      return;
    }

    const autosaveToken = `${workspaceCode}:${workspaceLastModified}`;
    if (autosaveToken === lastAutosaveTokenRef.current) {
      return;
    }

    lastAutosaveTokenRef.current = autosaveToken;

    // Trigger autosave via the hook
    triggerAutosave(async () => {
      await saveWorkspace();
      return (
        useWorkspaceStore.getState().currentWorkspace?.lastModified ??
        new Date().toISOString()
      );
    });
  }, [
    workspaceCode,
    workspaceLastModified,
    loading,
    triggerAutosave,
    saveWorkspace,
  ]);

  const handleManualSave = useCallback(async () => {
    if (!currentWorkspace) {
      return;
    }

    // Use immediate save (bypasses debounce)
    await saveImmediately(async () => {
      await saveWorkspace();
      const latest =
        useWorkspaceStore.getState().currentWorkspace?.lastModified ??
        currentWorkspace.lastModified;
      toast.success("Workspace saved successfully");
      return latest;
    });
  }, [currentWorkspace, saveWorkspace, saveImmediately]);

  // Keyboard shortcuts via extracted hook
  useEditorShortcuts({
    activeTab,
    isFullScreen,
    actions: {
      onToggleSidebar: () => setIsSidebarCollapsed((prev) => !prev),
      onManualSave: () => void handleManualSave(),
      onOpenSnapshot: () => setSnapshotDialogOpen(true),
      onToggleVersionHistory: () =>
        setIsVersionHistoryCollapsed((prev) => !prev),
      onToggleFullScreen: () => {
        setIsFullScreen((prev) => !prev);
        if (!isFullScreen) {
          setIsSidebarCollapsed(true);
        }
      },
      onExitFullScreen: () => setIsFullScreen(false),
    },
  });

  const handleSnapshotSave = async () => {
    if (!currentWorkspace) {
      return;
    }

    // Cancel any pending autosaves before snapshot
    cancelAutosave();

    setIsSnapshotSaving(true);
    try {
      const pivotDetected = await saveAndCreateSnapshot(snapshotNote);
      // Snapshot saves bypass autosave system
      setSaveStatus("saved");
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
      saveStatusTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
      if (pivotDetected) {
        toast.success(
          "Snapshot & journal entry saved. Pivot detected! Check the Pivots tab.",
        );
      } else {
        toast.success("Snapshot & journal entry saved.");
      }
      setSnapshotDialogOpen(false);
    } catch (snapshotError) {
      console.error("Snapshot save failed", snapshotError);
      toast.error("Unable to save snapshot right now.");
    } finally {
      setIsSnapshotSaving(false);
    }
  };

  const handleDocumentsChange = (documents: Workspace["documents"]) => {
    const current = useWorkspaceStore.getState().currentWorkspace;
    const existingLinks = current?.evidenceLinks ?? {};
    const validDocumentIds = new Set(documents.map((doc) => doc.id));

    const filteredLinks = Object.entries(existingLinks).reduce<
      Record<CanvasBlockId, string[]>
    >(
      (acc, [field, docIds]) => {
        const filtered =
          docIds?.filter((docId) => validDocumentIds.has(docId)) ?? [];
        if (filtered.length > 0) {
          acc[field as CanvasBlockId] = filtered;
        }
        return acc;
      },
      {} as Record<CanvasBlockId, string[]>,
    );

    const documentsWithLinks = documents.map((doc) => {
      const linkedFields = Object.entries(filteredLinks)
        .filter(([, docIds]) => docIds?.includes(doc.id))
        .map(([field]) => field as CanvasBlockId);

      if (linkedFields.length > 0) {
        return { ...doc, linkedFields };
      }

      if (doc.linkedFields && doc.linkedFields.length > 0) {
        const { linkedFields: _removed, ...rest } = doc;
        return rest as ProjectDocument;
      }

      return doc;
    });

    updateWorkspace({
      documents: documentsWithLinks,
      evidenceLinks: filteredLinks,
    });
  };

  // Handle URL import and merge into current workspace
  // Accepts URL from UnifiedImportDialog callback
  const handleUrlImport = useCallback(
    async (url: string) => {
      if (!currentWorkspace || !url.trim()) {
        return;
      }

      const normalizedUrl = urlAnalyzerService.normalizeURL(url.trim());
      if (!urlAnalyzerService.isValidURL(normalizedUrl)) {
        toast.error("Please enter a valid URL");
        return;
      }

      try {
        const importResult =
          await urlAnalyzerService.importFromURL(normalizedUrl);

        // Merge imported data with current workspace
        const updates: Partial<Workspace> = {};

        // Only update empty fields
        if (importResult.projectName && !currentWorkspace.projectName) {
          updates.projectName = importResult.projectName;
        }
        if (importResult.description && !currentWorkspace.description) {
          updates.description = importResult.description;
        }
        if (importResult.oneLiner && !currentWorkspace.oneLiner) {
          updates.oneLiner = importResult.oneLiner;
        }
        if (importResult.tags && importResult.tags.length > 0) {
          const existingTags = currentWorkspace.tags ?? [];
          const newTags = [...new Set([...existingTags, ...importResult.tags])];
          updates.tags = newTags;
        }

        // Handle embeds
        const currentEmbeds = currentWorkspace.embeds ?? {};
        const newEmbeds = { ...currentEmbeds };
        let embedsUpdated = false;

        if (
          importResult.embeds?.github?.repoUrl &&
          !currentEmbeds.github?.repoUrl
        ) {
          newEmbeds.github = {
            repoUrl: importResult.embeds.github.repoUrl,
            readmeUrl: importResult.embeds.github.readmeUrl,
          };
          embedsUpdated = true;
        }
        if (importResult.embeds?.website && !currentEmbeds.website) {
          newEmbeds.website = importResult.embeds.website;
          embedsUpdated = true;
        }
        if (importResult.embeds?.demo && !currentEmbeds.demo) {
          newEmbeds.demo = importResult.embeds.demo;
          embedsUpdated = true;
        }
        if (embedsUpdated) {
          updates.embeds = newEmbeds;
        }

        // Handle BMC data
        if (
          importResult.bmcData &&
          Object.keys(importResult.bmcData).length > 0
        ) {
          const currentBmc: Partial<Record<CanvasBlockId, string>> =
            currentWorkspace.bmcData ?? {};
          const mergedBmc: Partial<Record<CanvasBlockId, string>> = {
            ...currentBmc,
          };
          for (const [key, value] of Object.entries(importResult.bmcData)) {
            const bmcKey = key as CanvasBlockId;
            if (typeof value === "string" && value && !currentBmc[bmcKey]) {
              mergedBmc[bmcKey] = value;
            }
          }
          if (Object.keys(mergedBmc).length > Object.keys(currentBmc).length) {
            updates.bmcData = mergedBmc as Record<CanvasBlockId, string>;
          }
        }

        if (Object.keys(updates).length > 0) {
          updateWorkspace(updates);
          toast.success("Data imported and merged into project");
        } else {
          toast.info("No new data to import - all fields already filled");
        }
      } catch (err) {
        console.error("Import failed:", err);
        toast.error("Failed to import from URL");
      }
    },
    [currentWorkspace, updateWorkspace],
  );

  const resolvedLastSavedTimestamp =
    autosaveState.lastSaved ?? currentWorkspace?.lastModified ?? null;

  let lastSavedLabel = "Never";
  if (resolvedLastSavedTimestamp) {
    try {
      lastSavedLabel = formatDistanceToNow(
        new Date(resolvedLastSavedTimestamp),
        {
          addSuffix: true,
        },
      );
    } catch {
      lastSavedLabel = "Recently";
    }
  }

  const statusLabel = (() => {
    if (isSaving) {
      return "Saving…";
    }
    if (isAutosaving) {
      return "Autosaving…";
    }
    if (dirty) {
      return "Unsaved changes";
    }
    if (saveStatus === "saved") {
      return "All changes saved";
    }
    return resolvedLastSavedTimestamp
      ? `Last saved ${lastSavedLabel}`
      : "Never saved";
  })();

  // (computed labels and completion moved out; not needed in this component)

  const showLoadingState =
    loading && (!currentWorkspace || currentWorkspace.code !== workspaceId);

  const hasNotFoundError = error === "Workspace not found";

  if (hasNotFoundError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-blue-500" />
        <div className="space-y-1">
          <h2 className="font-display text-2xl text-white">
            Workspace not found
          </h2>
          <p className="text-sm text-neutral-400">
            The project you&apos;re looking for may have been moved or deleted.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/workspace/new")}
            className="rounded-full px-4 text-sm border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            Create new project
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            className="rounded-full px-4 text-sm bg-white text-black hover:bg-neutral-200"
          >
            Back to profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen",
        isFullScreen && "fixed inset-0 z-50 bg-[#0a0a0a]",
      )}
    >
      {/* Context Panel (Left Sidebar) - Hidden in full-screen */}
      {currentWorkspace && !showLoadingState && !isFullScreen && (
        <WorkspaceContextPanel
          workspace={currentWorkspace}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSnapshotClick={() => setSnapshotDialogOpen(true)}
          onSaveClick={() => {
            void handleManualSave();
          }}
          isSaving={isSaving}
          onCollapseChange={setIsSidebarCollapsed}
        />
      )}

      {/* Main Content Area - Full viewport utilization */}
      <div
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          // Standard padding for ALL tabs
          "p-4 lg:p-6",
          isFullScreen && "p-3 overflow-auto",
          !isFullScreen && currentWorkspace && !showLoadingState && "pt-16",
        )}
        style={{
          marginLeft: isFullScreen
            ? "0"
            : currentWorkspace && !showLoadingState
              ? isSidebarCollapsed
                ? "4rem"
                : "18rem"
              : "0",
          maxWidth: isFullScreen ? "none" : "1600px",
        }}
      >
        <Stack gap="lg">
          {/* Compact Status Bar with Controls */}
          {!showLoadingState && (
            <EditorStatusBar
              activeTab={activeTab}
              isFullScreen={isFullScreen}
              isSaving={isSaving}
              isAutosaving={isAutosaving}
              saveStatus={saveStatus}
              statusLabel={statusLabel}
              onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
            />
          )}

          {error && !showLoadingState && !hasNotFoundError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {showLoadingState ? (
            <Stack gap="sm">
              <Skeleton className="h-6 w-56 rounded-full" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={`loading-block-${index}`}
                    className="h-48 rounded-3xl"
                  />
                ))}
              </div>
            </Stack>
          ) : (
            <WorkspaceErrorBoundary
              workspaceId={workspaceId}
              onSaveAttempt={async () => {
                await saveWorkspace();
              }}
              onReset={() => {
                clearError();
                void loadWorkspace(workspaceId);
              }}
            >
              {/* Simplified Publishing Flow - No Track Selection */}
              {isWorkspaceCollapsed && currentWorkspace ? (
                // New two-column publish page with image cropping
                <PublishPage
                  workspace={currentWorkspace}
                  onExpand={() => setIsWorkspaceCollapsed(false)}
                  onImport={() => setIsImportDialogOpen(true)}
                />
              ) : (
                <section className="w-full">
                  {activeTab === "overview" && currentWorkspace ? (
                    <ProjectOverview
                      workspace={currentWorkspace}
                      onNavigateToTab={setActiveTab}
                    />
                  ) : null}
                  {activeTab === "canvas" ? <BusinessModelCanvas /> : null}
                  {activeTab === "journey" && currentWorkspace ? (
                    <ProjectJourney />
                  ) : null}
                  {activeTab === "documents" && currentWorkspace ? (
                    <DocumentManager
                      documents={currentWorkspace.documents ?? []}
                      onDocumentsChange={handleDocumentsChange}
                      workspaceCode={currentWorkspace.code}
                    />
                  ) : null}
                  {activeTab === "share" ? (
                    <WorkspaceSharePanel
                      onNavigateToCanvas={() => setActiveTab("canvas")}
                      onSaved={() => {
                        // Mark workspace as saved after publish
                        setSaveStatus("saved");
                        if (saveStatusTimeoutRef.current) {
                          clearTimeout(saveStatusTimeoutRef.current);
                        }
                        saveStatusTimeoutRef.current = setTimeout(() => {
                          setSaveStatus("idle");
                        }, 2000);
                      }}
                    />
                  ) : null}
                </section>
              )}
            </WorkspaceErrorBoundary>
          )}
          <Dialog
            open={isSnapshotDialogOpen}
            onOpenChange={setSnapshotDialogOpen}
          >
            <DialogContent className="max-w-md border-white/10 bg-[#0b0d0f]/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-white">
                  Save snapshot & journal entry
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-400">
                  Capture this moment in your project&apos;s history. Your note
                  will be saved to both the version snapshot and your journal.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={snapshotNote}
                onChange={(event) => setSnapshotNote(event.target.value)}
                placeholder="Example: Added evidence from customer interviews and updated revenue streams. Realized our target audience is actually small businesses, not consumers."
                rows={5}
              />
              <DialogFooter className="gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setSnapshotDialogOpen(false)}
                  className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    void handleSnapshotSave();
                  }}
                  disabled={isSnapshotSaving}
                  className="flex items-center gap-2 rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                >
                  {isSnapshotSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      <span className="whitespace-nowrap">Saving…</span>
                    </>
                  ) : (
                    <span className="whitespace-nowrap">Save snapshot</span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Unified Import Dialog - URL + File tabs */}
          <UnifiedImportDialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
            onUrlImport={handleUrlImport}
            onImportComplete={(result) => {
              // Handle file import result - merge extracted fields into workspace
              if (currentWorkspace && result.extractedFields) {
                const currentBmc = currentWorkspace.bmcData ?? {};
                const mergedBmc = { ...currentBmc };
                let hasUpdates = false;

                for (const [key, value] of Object.entries(
                  result.extractedFields,
                )) {
                  const bmcKey = key as CanvasBlockId;
                  if (
                    typeof value === "string" &&
                    value &&
                    !currentBmc[bmcKey]
                  ) {
                    mergedBmc[bmcKey] = value;
                    hasUpdates = true;
                  }
                }

                if (hasUpdates) {
                  updateWorkspace({
                    bmcData: mergedBmc as Record<CanvasBlockId, string>,
                  });
                  toast.success("File imported and merged into project");
                } else {
                  toast.info("No new data to import from file");
                }
              }
            }}
          />
        </Stack>
      </div>

      {/* Version History Panel (Right Sidebar) - Shows only on Canvas tab */}
      {currentWorkspace &&
        !showLoadingState &&
        activeTab === "canvas" &&
        !isFullScreen && (
          <VersionHistoryPanel
            isCollapsed={isVersionHistoryCollapsed}
            onToggleCollapsed={() =>
              setIsVersionHistoryCollapsed(!isVersionHistoryCollapsed)
            }
            onRestoreComplete={() => {
              setSaveStatus("saved");
              if (saveStatusTimeoutRef.current) {
                clearTimeout(saveStatusTimeoutRef.current);
              }
              saveStatusTimeoutRef.current = setTimeout(() => {
                setSaveStatus("idle");
              }, 2000);
            }}
          />
        )}
    </div>
  );
}

export default WorkspaceEditor;
