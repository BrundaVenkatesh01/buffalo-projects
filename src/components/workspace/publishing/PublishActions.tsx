/**
 * Publish Actions
 *
 * Publish/unpublish controls and public URL display.
 * Includes explicit "Unpublish" button for better discoverability.
 */

"use client";

import { useState } from "react";
import { toast } from "sonner";

import { usePublishForm } from "./PublishFormContext";

import {
  Button,
  Switch,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/unified";
import {
  Globe,
  Lock,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  Share2,
} from "@/icons";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { getPublicProjectUrl } from "@/utils/projectUrls";

// Public publishing is deferred - all projects stay private for now
const PUBLIC_PUBLISHING_ENABLED = false;

export function PublishActions() {
  const { state, dispatch, save, workspace } = usePublishForm();
  const [copied, setCopied] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);

  const publishWorkspace = useWorkspaceStore((s) => s.publishWorkspace);
  const unpublishWorkspace = useWorkspaceStore((s) => s.unpublishWorkspace);

  // Handle explicit unpublish action with confirmation
  const handleUnpublish = async () => {
    setShowUnpublishConfirm(false);
    dispatch({ type: "SET_IS_PUBLIC", payload: false });
    await save(false);

    try {
      await unpublishWorkspace(workspace.code);
      toast.success("Project unpublished", {
        description: "Your project is now private. You can republish anytime.",
      });
    } catch (error) {
      console.error("Failed to unpublish:", error);
      dispatch({ type: "SET_IS_PUBLIC", payload: true });
      toast.error("Failed to unpublish project");
    }
  };

  // Get public URL
  const publicUrl = workspace.isPublic
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${getPublicProjectUrl(workspace)}`
    : null;

  // Handle publish toggle
  const handlePublishToggle = async (checked: boolean) => {
    dispatch({ type: "SET_IS_PUBLIC", payload: checked });

    // Auto-save when toggling publish state
    await save(checked);

    if (checked) {
      try {
        await publishWorkspace(workspace.code);
        toast.success("Project published!", {
          description: "Your project is now visible in the community gallery",
        });
      } catch (error) {
        console.error("Failed to publish:", error);
        dispatch({ type: "SET_IS_PUBLIC", payload: false });
        toast.error("Failed to publish project");
      }
    } else {
      try {
        await unpublishWorkspace(workspace.code);
        toast.success("Project unpublished", {
          description: "Your project is now private",
        });
      } catch (error) {
        console.error("Failed to unpublish:", error);
        dispatch({ type: "SET_IS_PUBLIC", payload: true });
        toast.error("Failed to unpublish project");
      }
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    if (!publicUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Open public page
  const handleViewPublic = () => {
    if (!publicUrl) {
      return;
    }
    window.open(publicUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Publish Toggle */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {state.isPublic ? (
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Globe className="h-5 w-5 text-emerald-400" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">
                {state.isPublic ? "Published" : "Draft"}
              </p>
              <p className="text-xs text-muted-foreground">
                {!PUBLIC_PUBLISHING_ENABLED
                  ? "Public publishing coming soon"
                  : state.isPublic
                    ? "Visible in community gallery"
                    : "Only you can see this"}
              </p>
            </div>
          </div>

          {PUBLIC_PUBLISHING_ENABLED ? (
            <Switch
              checked={state.isPublic}
              onCheckedChange={(checked) => void handlePublishToggle(checked)}
              disabled={state.isSaving}
            />
          ) : (
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
              Coming Soon
            </span>
          )}
        </div>

        {/* Public URL (when published) */}
        {PUBLIC_PUBLISHING_ENABLED && state.isPublic && publicUrl && (
          <div className="space-y-2 pt-2 border-t border-white/5">
            <Label className="text-xs text-muted-foreground">
              Your public link
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-muted-foreground truncate font-mono">
                {publicUrl}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void handleCopyUrl()}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleViewPublic}
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button (for drafts) */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => void save()}
          disabled={state.isSaving || (!state.isDirty && !state.isPublic)}
          className={cn("flex-1", state.isDirty && "ring-2 ring-primary/50")}
        >
          {state.isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : state.isDirty ? (
            "Save Changes"
          ) : (
            "Saved"
          )}
        </Button>

        {/* Share button (when published) */}
        {PUBLIC_PUBLISHING_ENABLED && state.isPublic && (
          <Button
            variant="outline"
            onClick={() => void handleCopyUrl()}
            className="border-white/10 text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}

        {/* Explicit Unpublish button (when published) - more discoverable than toggle */}
        {PUBLIC_PUBLISHING_ENABLED && state.isPublic && (
          <Button
            variant="ghost"
            onClick={() => setShowUnpublishConfirm(true)}
            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            disabled={state.isSaving}
          >
            <Lock className="h-4 w-4 mr-2" />
            Unpublish
          </Button>
        )}
      </div>

      {/* Dirty indicator */}
      {state.isDirty && (
        <p className="text-xs text-amber-400 text-center">
          You have unsaved changes
        </p>
      )}

      {/* Unpublish Confirmation Dialog */}
      <Dialog
        open={showUnpublishConfirm}
        onOpenChange={setShowUnpublishConfirm}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make project private?</DialogTitle>
            <DialogDescription>
              This will remove your project from the community gallery. Your
              public link will no longer work, but you can republish anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowUnpublishConfirm(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleUnpublish()}
              className="w-full sm:w-auto"
            >
              Yes, make private
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
