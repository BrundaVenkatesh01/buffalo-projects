"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */

import { deleteUser } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/unified";
import { AlertTriangle, Key, Trash2 } from "@/icons";
import { auth } from "@/services/firebase";
import { authService } from "@/services/firebaseAuth";
import { firebaseDatabase } from "@/services/firebaseDatabase";

interface ProfileAccountDangerProps {
  userId: string;
  userEmail: string;
}

export function ProfileAccountDanger({
  userId,
  userEmail,
}: ProfileAccountDangerProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handlePasswordReset = async () => {
    if (!userEmail) {
      toast.error("No email address associated with this account");
      return;
    }

    try {
      setIsSendingReset(true);
      await authService.resetPassword(userEmail);
      toast.success(`Password reset email sent to ${userEmail}`);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    try {
      setIsDeleting(true);

      // 1. Delete all user workspaces
      const userWorkspaces = await firebaseDatabase.getUserWorkspaces(userId);
      for (const workspace of userWorkspaces) {
        try {
          await firebaseDatabase.deleteWorkspace(workspace.code);
        } catch (error) {
          console.error(`Failed to delete workspace ${workspace.code}:`, error);
        }
      }

      // 2. Delete user profile data from Firestore
      try {
        await firebaseDatabase.deleteUserData(userId);
      } catch (error) {
        console.error("Failed to delete user profile data:", error);
        // Continue with account deletion even if profile deletion fails
      }

      // 3. Delete Firebase Auth account
      const currentUser = auth?.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      toast.success("Account deleted successfully");

      // Redirect to home page after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Account deletion error:", error);

      if (error instanceof Error) {
        if (error.message.includes("requires-recent-login")) {
          toast.error(
            "Please sign out and sign in again before deleting your account",
          );
        } else {
          toast.error("Failed to delete account: " + error.message);
        }
      } else {
        toast.error("Failed to delete account");
      }

      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    }
  };

  return (
    <>
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle>Account Management</CardTitle>
          </div>
          <CardDescription>
            Manage your account security and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Password Reset */}
          <div className="group flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-200 group-hover:scale-110">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold">Password Reset</div>
                <p className="text-xs text-muted-foreground leading-tight">
                  Send a password reset link to {userEmail}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasswordReset}
              disabled={isSendingReset || !userEmail}
              className="shrink-0"
            >
              {isSendingReset ? "Sending..." : "Reset Password"}
            </Button>
          </div>

          {/* Account Deletion */}
          <div className="group flex flex-col gap-3 rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4 transition-all duration-200 hover:border-destructive/50 hover:bg-destructive/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 transition-transform duration-200 group-hover:scale-110">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-destructive">
                  Danger Zone
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="shrink-0"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border-2 border-red-500/30 bg-red-950/10 p-4">
              <h4 className="font-medium text-red-500 mb-2">
                This will permanently:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Delete all your projects and workspaces</li>
                <li>Remove all your uploaded documents and evidence</li>
                <li>Erase your version history and snapshots</li>
                <li>Delete your profile and preferences</li>
                <li>Remove you from any groups or collaborations</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="delete-confirmation"
                className="text-sm font-medium"
              >
                Type <span className="font-mono text-red-500">DELETE</span> to
                confirm:
              </label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE here"
                className="font-mono"
                autoComplete="off"
              />
            </div>

            {deleteConfirmation && deleteConfirmation !== "DELETE" && (
              <p className="text-xs text-red-500">
                Please type exactly &quot;DELETE&quot; (case-sensitive)
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmation("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
