/**
 * Publish Preview Dialog
 *
 * Shows explicit data boundaries before publishing - what becomes public,
 * what stays private. No ambiguity, no decorative elements.
 */

"use client";

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
} from "@/components/unified";
import { Globe, Lock, AlertTriangle } from "@/icons";
import type { Workspace } from "@/types";

interface PublishPreviewDialogProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function PublishPreviewDialog({
  workspace,
  isOpen,
  onClose,
  onConfirm,
}: PublishPreviewDialogProps) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error("Failed to publish project");
    } finally {
      setPublishing(false);
    }
  };

  // Count what's being shared
  const bmcFieldCount = Object.values(workspace.bmcData || {}).filter(
    (value) => value && String(value).trim().length > 0,
  ).length;
  const documentCount = workspace.documents?.length || 0;
  const hasGithub = Boolean(workspace.embeds?.github?.repoUrl);
  const hasWebsite = Boolean(
    workspace.embeds?.website || workspace.embeds?.demo,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5" />
            Publish to Community Gallery
          </DialogTitle>
          <DialogDescription>
            Review what becomes public before publishing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-amber-100">
                Publishing makes this project visible to everyone
              </p>
              <p className="mt-1 text-amber-200/80">
                Anyone with the link can view the public page. You can unpublish
                anytime.
              </p>
            </div>
          </div>

          {/* What becomes public */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-foreground">
                What becomes public
              </h3>
            </div>
            <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <DataItem
                label="Project name & description"
                value={workspace.projectName || "Untitled"}
                alwaysPublic
              />
              <DataItem
                label="Business Model Canvas"
                value={`${bmcFieldCount} of 9 fields completed`}
                alwaysPublic
              />
              {workspace.stage && (
                <DataItem
                  label="Project stage"
                  value={workspace.stage}
                  alwaysPublic
                />
              )}
              {workspace.tags && workspace.tags.length > 0 && (
                <DataItem
                  label="Tags"
                  value={workspace.tags.join(", ")}
                  alwaysPublic
                />
              )}
              {documentCount > 0 && (
                <DataItem
                  label="Evidence documents"
                  value={`${documentCount} ${documentCount === 1 ? "document" : "documents"}`}
                  alwaysPublic
                />
              )}
              {hasGithub && (
                <DataItem label="GitHub repository link" alwaysPublic />
              )}
              {hasWebsite && (
                <DataItem label="Demo/website link" alwaysPublic />
              )}
              {workspace.lookingFor && workspace.lookingFor.length > 0 && (
                <DataItem
                  label="Asks (what you need help with)"
                  value={workspace.lookingFor.join(", ")}
                  alwaysPublic
                />
              )}
              {workspace.gives && workspace.gives.length > 0 && (
                <DataItem
                  label="Gives (what you can offer)"
                  value={workspace.gives.join(", ")}
                  alwaysPublic
                />
              )}
            </div>
          </div>

          {/* What stays private */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-400" />
              <h3 className="font-semibold text-foreground">
                What stays private
              </h3>
            </div>
            <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 opacity-70">
              <DataItem label="Workspace editor (only you can edit)" private />
              <DataItem label="Version history & pivot tracking" private />
              <DataItem label="AI chat conversations" private />
              <DataItem
                label="Evidence links to specific canvas blocks"
                private
              />
              <DataItem label="Context notes and internal comments" private />
            </div>
          </div>

          {/* Public URL preview */}
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Public URL (after publishing)
            </p>
            <code className="block rounded bg-black/30 px-3 py-2 text-sm text-foreground/70 break-all">
              {typeof window !== "undefined" && window.location.origin}/p/
              {workspace.slug ||
                workspace.projectName
                  ?.toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "") ||
                `project-${workspace.code}`}
            </code>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={publishing}>
            Cancel
          </Button>
          <Button onClick={() => void handlePublish()} disabled={publishing}>
            {publishing ? "Publishing..." : "Make Public"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DataItem({
  label,
  value,
  alwaysPublic,
  private: isPrivate,
}: {
  label: string;
  value?: string;
  alwaysPublic?: boolean;
  private?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="mt-0.5 flex-shrink-0">
        {alwaysPublic ? (
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        ) : isPrivate ? (
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        {value && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
