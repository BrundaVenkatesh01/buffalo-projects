/**
 * Workspace Privacy Panel
 *
 * Central privacy controls: export, delete, encryption status.
 * No decorative elements - purely functional privacy management.
 */

"use client";

import { useState } from "react";
import { toast } from "sonner";

import { WorkspaceDeleteDialog } from "./WorkspaceDeleteDialog";

import { Button, Card } from "@/components/unified";
import {
  Download,
  Trash2,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
} from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";
import {
  downloadWorkspaceExport,
  getExportSummary,
} from "@/utils/workspaceExport";

interface WorkspacePrivacyPanelProps {
  workspace: Workspace;
}

export function WorkspacePrivacyPanel({
  workspace,
}: WorkspacePrivacyPanelProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showEncryptionForm, setShowEncryptionForm] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [encryptionLoading, setEncryptionLoading] = useState(false);

  const { enableEncryption, disableEncryption, encryptionEnabled } =
    useWorkspaceStore();

  const exportSummary = getExportSummary(workspace);
  const isEncrypted = workspace.isEncrypted || encryptionEnabled;

  const handleEnableEncryption = async () => {
    if (encryptionPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (encryptionPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setEncryptionLoading(true);
    try {
      await enableEncryption(encryptionPassword);
      toast.success("Encryption enabled", {
        description: "Your workspace data is now encrypted end-to-end",
      });
      setShowEncryptionForm(false);
      setEncryptionPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to enable encryption");
    } finally {
      setEncryptionLoading(false);
    }
  };

  const handleDisableEncryption = async () => {
    setEncryptionLoading(true);
    try {
      await disableEncryption();
      toast.success("Encryption disabled", {
        description: "Your workspace data is no longer encrypted",
      });
    } catch {
      toast.error("Failed to disable encryption");
    } finally {
      setEncryptionLoading(false);
    }
  };

  const handleExport = () => {
    setExporting(true);
    try {
      downloadWorkspaceExport(workspace);
      toast.success("Workspace data exported", {
        description: `Downloaded ${exportSummary.totalSize} JSON file`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export workspace data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Privacy & Data Control
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Export, delete, and manage your data autonomy
        </p>
      </div>

      {/* Export Data */}
      <Card className="border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Export Your Data
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download all your project data in open JSON format. No limits, no
              paywalls.
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• {exportSummary.canvasFields} canvas fields</p>
              <p>• {exportSummary.documents} documents</p>
              <p>• {exportSummary.versions} version snapshots</p>
              <p>• Estimated size: {exportSummary.totalSize}</p>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="outline"
            size="lg"
          >
            {exporting ? "Exporting..." : "Download Data"}
          </Button>
        </div>
      </Card>

      {/* End-to-End Encryption */}
      <Card
        className={`p-6 ${isEncrypted ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isEncrypted ? (
                <Lock className="h-5 w-5 text-emerald-400" />
              ) : (
                <Unlock className="h-5 w-5 text-muted-foreground" />
              )}
              <h3 className="text-lg font-semibold text-foreground">
                End-to-End Encryption
              </h3>
            </div>

            {isEncrypted ? (
              <div>
                <p className="text-sm text-emerald-200/80 mb-3">
                  Your canvas, documents, and notes are encrypted with your
                  password. Only you can decrypt this data.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-300/70">
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    AES-256-CBC • PBKDF2 key derivation • 100k iterations
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security by encrypting your workspace
                  with a password. Your data will be unreadable without it.
                </p>
                {!showEncryptionForm ? (
                  <Button
                    onClick={() => setShowEncryptionForm(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Enable Encryption
                  </Button>
                ) : (
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Encryption Password (min 8 characters)
                      </label>
                      <input
                        type="password"
                        value={encryptionPassword}
                        onChange={(e) => setEncryptionPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-white/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Confirm password"
                      />
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200/80">
                        <strong>Warning:</strong> If you lose this password,
                        your data cannot be recovered. We cannot reset it for
                        you.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => void handleEnableEncryption()}
                        disabled={
                          encryptionLoading || encryptionPassword.length < 8
                        }
                        size="sm"
                      >
                        {encryptionLoading
                          ? "Encrypting..."
                          : "Encrypt Workspace"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowEncryptionForm(false);
                          setEncryptionPassword("");
                          setConfirmPassword("");
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEncrypted && (
            <Button
              onClick={() => void handleDisableEncryption()}
              disabled={encryptionLoading}
              variant="outline"
              size="sm"
              className="text-amber-400 border-amber-400/30 hover:bg-amber-400/10"
            >
              {encryptionLoading ? "Disabling..." : "Disable"}
            </Button>
          )}
        </div>
      </Card>

      {/* Delete Project */}
      <Card className="border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive-foreground">
                Delete Project
              </h3>
            </div>
            <p className="text-sm text-destructive-foreground/80 mb-3">
              Permanently delete this project and all associated data.
            </p>
            <ul className="space-y-1 text-xs text-destructive-foreground/70">
              <li>• Removed from servers within 24 hours</li>
              <li>• Purged from backups within 30 days</li>
              <li>• Unpublished from gallery immediately</li>
              <li>• Cannot be undone</li>
            </ul>
          </div>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            size="lg"
          >
            Delete Forever
          </Button>
        </div>
      </Card>

      {/* Privacy Charter Link */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Your privacy rights:</strong> View
          our complete{" "}
          <a
            href="https://github.com/yourusername/buffalo-projects/blob/main/PRIVACY_CHARTER.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Privacy Charter
          </a>{" "}
          for detailed commitments on data ownership, access control, and
          transparency.
        </p>
      </div>

      {/* Delete Dialog */}
      <WorkspaceDeleteDialog
        workspace={workspace}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
