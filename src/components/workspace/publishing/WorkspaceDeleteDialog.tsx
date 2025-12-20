/**
 * Workspace Delete Dialog
 *
 * Explicit deletion with clear consequences. Implements Privacy Charter
 * commitment: "One-click permanent deletion" with transparent timeline.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
} from "@/components/unified";
import { AlertTriangle, Trash2 } from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";

interface WorkspaceDeleteDialogProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceDeleteDialog({
  workspace,
  isOpen,
  onClose,
}: WorkspaceDeleteDialogProps) {
  const router = useRouter();
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const projectName = workspace.projectName || "Untitled";
  const canDelete = confirmText === projectName;

  const handleDelete = async () => {
    if (!canDelete) {
      return;
    }

    setDeleting(true);
    try {
      await deleteWorkspace(workspace.code);
      toast.success("Project deleted permanently");
      onClose();
      router.push("/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete &quot;{projectName}&quot;?
          </DialogTitle>
          <DialogDescription>This action cannot be undone</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Explicit consequences */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-destructive" />
              <div className="flex-1 space-y-3 text-sm">
                <p className="font-semibold text-destructive-foreground">
                  All data will be permanently deleted:
                </p>
                <ul className="space-y-2 text-destructive-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-destructive">•</span>
                    <span>
                      <strong>Immediate:</strong> Removed from our servers and
                      unpublished from gallery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-destructive">•</span>
                    <span>
                      <strong>Within 24 hours:</strong> Deleted from all active
                      databases
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-destructive">•</span>
                    <span>
                      <strong>Within 30 days:</strong> Purged from all backups
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What will be deleted */}
          <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs font-semibold text-muted-foreground">
              This will delete:
            </p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                Business Model Canvas (
                {Object.keys(workspace.bmcData || {}).length} blocks)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                Evidence documents ({workspace.documents?.length || 0} files)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                Version history ({workspace.versions?.length || 0} snapshots)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                All links, embeds, and metadata
              </li>
            </ul>
          </div>

          {/* Confirmation input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              Type the project name to confirm deletion
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={projectName}
              className="font-mono"
              autoComplete="off"
            />
            {confirmText.length > 0 && !canDelete && (
              <p className="text-xs text-destructive">
                Name doesn&apos;t match. Type &quot;{projectName}&quot; exactly.
              </p>
            )}
          </div>

          {/* Export reminder */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <p className="text-xs text-blue-100">
              <strong>Before deleting:</strong> Use &quot;Export Data&quot; to
              download a backup of this project
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={!canDelete || deleting}
          >
            {deleting ? "Deleting..." : "Delete Forever"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
