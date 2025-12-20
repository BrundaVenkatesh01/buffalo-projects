"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui-next";
import { Button } from "@/components/ui-next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-next";
import { Eye, History, Loader2, RotateCcw } from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { CanvasState, Version } from "@/types";

const FIELD_LABELS: Record<keyof CanvasState, string> = {
  keyPartners: "Key partners",
  keyActivities: "Key activities",
  keyResources: "Key resources",
  valuePropositions: "Value propositions",
  customerRelationships: "Customer relationships",
  channels: "Channels",
  customerSegments: "Customer segments",
  costStructure: "Cost structure",
  revenueStreams: "Revenue streams",
};

interface VersionHistoryProps {
  onRestoreComplete?: (timestamp?: string | null) => void;
}

export function VersionHistory({ onRestoreComplete }: VersionHistoryProps) {
  const workspace = useWorkspaceStore((state) => state.currentWorkspace);
  const restoreVersion = useWorkspaceStore((state) => state.restoreVersion);

  const versions = useMemo(() => {
    const entries = workspace?.versions ?? [];
    return [...entries].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [workspace?.versions]);

  const [previewVersion, setPreviewVersion] = useState<Version | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<Version | null>(null);
  const [isRestoreOpen, setRestoreOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  if (!workspace) {
    return null;
  }

  const openPreview = (version: Version) => {
    setPreviewVersion(version);
    setPreviewOpen(true);
  };

  const openRestoreConfirm = (version: Version) => {
    setRestoreTarget(version);
    setRestoreOpen(true);
  };

  const handleRestore = async () => {
    if (!restoreTarget) {
      return;
    }

    setRestoring(true);
    try {
      await restoreVersion(restoreTarget.id);
      const latestTimestamp =
        useWorkspaceStore.getState().currentWorkspace?.lastModified ?? null;
      onRestoreComplete?.(latestTimestamp);
      toast.success("Canvas restored to the selected snapshot.");
      setRestoreOpen(false);
    } catch (restoreError) {
      console.error("Failed to restore version", restoreError);
      toast.error("Unable to restore this snapshot right now.");
    } finally {
      setRestoring(false);
    }
  };

  const renderFieldPreview = (version: Version) => {
    return (Object.keys(FIELD_LABELS) as Array<keyof CanvasState>).map(
      (field) => {
        const value = version.bmcData[field]?.trim() ?? "";
        return (
          <div
            key={field}
            className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {FIELD_LABELS[field]}
            </p>
            <p className="text-sm text-foreground">
              {value.length > 0 ? value : "No content"}
            </p>
          </div>
        );
      },
    );
  };

  return (
    <aside className="pointer-events-none z-10 space-y-4 lg:sticky lg:top-32">
      <div className="pointer-events-auto flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
            Version history
          </p>
          <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-primary" />
            Snapshots
          </h3>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-white/15 text-xs text-muted-foreground"
        >
          {versions.length}
        </Badge>
      </div>

      {versions.length === 0 ? (
        <Card
          variant="light"
          className="pointer-events-auto border-dashed border-white/10 bg-white/5"
        >
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Take your first snapshot to track how the canvas evolves over time.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {versions.map((version, index) => {
            const displayTitle =
              version.note?.trim() ||
              version.snapshot ||
              `Snapshot ${versions.length - index}`;
            const timestampLabel = (() => {
              try {
                return format(
                  new Date(version.timestamp),
                  "MMM d, yyyy • h:mm a",
                );
              } catch {
                return version.timestamp;
              }
            })();
            const isLatest = index === 0;

            return (
              <Card
                key={version.id}
                variant="light"
                className="pointer-events-auto border-white/10 bg-white/5 transition hover:border-white/20"
              >
                <CardHeader className="space-y-2 p-4 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base text-foreground">
                      {displayTitle}
                    </CardTitle>
                    {isLatest ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/20 text-xs text-muted-foreground"
                      >
                        Latest
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
                    {timestampLabel}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 p-4 pt-0">
                  {version.note ? (
                    <p className="text-sm text-muted-foreground">
                      {version.note}
                    </p>
                  ) : null}
                  {!version.note && version.snapshot ? (
                    <p className="text-sm text-muted-foreground">
                      {version.snapshot}
                    </p>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 rounded-full px-3 text-xs uppercase tracking-[0.24em]"
                      onClick={() => openPreview(version)}
                    >
                      <Eye className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">Preview</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 rounded-full px-3 text-xs uppercase tracking-[0.24em]"
                      onClick={() => openRestoreConfirm(version)}
                    >
                      <RotateCcw className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">Restore</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl border-white/10 bg-[#0b0d0f]/95">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Snapshot preview
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Review this canvas snapshot without affecting your current
              workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
            {previewVersion ? (
              <>
                <section className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
                    Captured
                  </p>
                  <p className="text-sm text-foreground">
                    {format(
                      new Date(previewVersion.timestamp),
                      "MMM d, yyyy • h:mm a",
                    )}
                  </p>
                </section>
                <section className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
                    Project summary
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {previewVersion.projectDescription?.trim() ||
                      "No project description was captured in this snapshot."}
                  </p>
                </section>
                <section className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
                    Canvas fields
                  </p>
                  <div className="grid gap-3">
                    {renderFieldPreview(previewVersion)}
                  </div>
                </section>
              </>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              onClick={() => setPreviewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRestoreOpen} onOpenChange={setRestoreOpen}>
        <DialogContent className="max-w-md border-white/10 bg-[#0b0d0f]/95">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Restore snapshot?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Restoring replaces your current canvas with the selected snapshot.
              You can always capture a new snapshot afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setRestoreOpen(false)}
              className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                void handleRestore();
              }}
              disabled={restoring}
              className="flex items-center gap-2 rounded-full px-4 text-xs uppercase tracking-[0.24em]"
            >
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span className="whitespace-nowrap">Restoring…</span>
                </>
              ) : (
                <span className="whitespace-nowrap">Restore snapshot</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

export default VersionHistory;
