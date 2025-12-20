"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */

import { m } from "framer-motion";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/unified";
import { Info, Lock, Globe, Calendar } from "@/icons";
import type { Workspace } from "@/types";

interface TwentySixPublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace | null;
  onConfirm: (workspaceId: string, options: PublishOptions) => Promise<void>;
}

export interface PublishOptions {
  isForTwentySix: boolean;
  agreedToTerms: boolean;
  canPrivatizeLater: boolean;
}

export function TwentySixPublishDialog({
  open,
  onOpenChange,
  workspace,
  onConfirm,
}: TwentySixPublishDialogProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!workspace) {
    return null;
  }

  const handlePublish = async () => {
    if (!agreedToTerms) {
      return;
    }

    setIsPublishing(true);
    try {
      await onConfirm(workspace.id, {
        isForTwentySix: true,
        agreedToTerms: true,
        canPrivatizeLater: true,
      });
      onOpenChange(false);
      setAgreedToTerms(false);
      setShowDetails(false);
    } catch (error) {
      console.error("Failed to publish for '26:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#f59e0b20",
                border: "2px solid #f59e0b40",
              }}
            >
              <Calendar className="h-6 w-6" style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Publish for{" "}
                <span style={{ color: "#f59e0b" }}>26 under 26</span>
              </DialogTitle>
              <DialogDescription>
                Showcase your project to the Buffalo community
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Info */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="font-semibold mb-2">{workspace.projectName}</h3>
            <code className="text-xs text-muted-foreground font-mono">
              {workspace.code}
            </code>
            {workspace.oneLiner && (
              <p className="text-sm text-muted-foreground mt-2">
                {workspace.oneLiner}
              </p>
            )}
          </div>

          {/* What Publishing Means */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              What happens when you publish:
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <Globe className="h-4 w-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Your project becomes public</p>
                  <p className="text-muted-foreground text-xs">
                    Visible at /p/{workspace.code?.toLowerCase()} and in the
                    public gallery
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Lock className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Your workspace stays private</p>
                  <p className="text-muted-foreground text-xs">
                    Only you can edit. Business Model Canvas, documents, and
                    versions remain private.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Calendar
                  className="h-4 w-4 mt-0.5"
                  style={{ color: "#f59e0b" }}
                />
                <div>
                  <p className="font-medium">Entry for 26 under 26</p>
                  <p className="text-muted-foreground text-xs">
                    Your project will be considered for Buffalo&apos;s 26 under
                    26 showcase
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Lock className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">You can privatize anytime</p>
                  <p className="text-muted-foreground text-xs">
                    Change your mind? Unpublish before or after January 1st
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learn More Section */}
          {!showDetails ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="w-full justify-center gap-2"
            >
              <Info className="h-4 w-4" />
              Learn More About Privacy & Terms
            </Button>
          ) : (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg border bg-blue-500/5 p-4 space-y-3"
            >
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                Privacy & Terms Details
              </h4>

              <div className="text-sm space-y-2 text-muted-foreground">
                <p className="font-medium text-foreground">
                  What&apos;s Public:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Project name, description, and stage</li>
                  <li>Public links (website, GitHub, demo)</li>
                  <li>Project timeline and completion status</li>
                  <li>Any content you choose to share in the public view</li>
                </ul>

                <p className="font-medium text-foreground mt-3">
                  What Stays Private:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your entire workspace (Canvas, Documents, Versions)</li>
                  <li>All uploaded documents and evidence</li>
                  <li>Your business model canvas details</li>
                  <li>Version history and pivot analysis</li>
                  <li>AI suggestions and internal notes</li>
                </ul>

                <p className="font-medium text-foreground mt-3">
                  26 under 26 Program:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Showcases top 26 student projects from Buffalo</li>
                  <li>Selection based on innovation, impact, and execution</li>
                  <li>Deadline: December 31st for January 1st announcement</li>
                  <li>
                    Publishing doesn&apos;t guarantee selection, but is required
                  </li>
                </ul>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="w-full"
              >
                Close Details
              </Button>
            </m.div>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="agree-terms" className="text-sm cursor-pointer">
              <span className="font-medium">I understand and agree</span>
              <p className="text-muted-foreground mt-1">
                I agree to publish my project for the 26 under 26 program. I
                understand that my project will be publicly visible, but my
                workspace remains private. I can unpublish at any time.
              </p>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              setAgreedToTerms(false);
              setShowDetails(false);
            }}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!agreedToTerms || isPublishing}
            className="gap-2"
            style={{
              backgroundColor: agreedToTerms ? "#f59e0b" : undefined,
              borderColor: agreedToTerms ? "#f59e0b" : undefined,
            }}
          >
            {isPublishing ? (
              <>Publishing...</>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Publish for &apos;26
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
