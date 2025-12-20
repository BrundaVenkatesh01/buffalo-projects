"use client";

import { m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Label } from "@/components/unified";
import { Loader2 } from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenURLImport: () => void;
  onOpenBatchImport: () => void;
  onOpenFileImport?: () => void;
}

export function ProjectCreationModal({
  isOpen,
  onClose,
  onOpenURLImport,
  onOpenBatchImport,
  onOpenFileImport,
}: ProjectCreationModalProps) {
  const router = useRouter();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const name =
        projectName.trim() ||
        `Project ${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;

      const workspace = await createWorkspace({
        projectName: name,
        stage: "idea",
        buffaloAffiliated: true,
      });

      onClose();
      router.push(`/edit/${workspace.code}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setProjectName("");
    setIsCreating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Project</DialogTitle>
          <DialogDescription>
            Your project stays private until you choose to share it.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Quick Start - Name and Create */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="My Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreating) {
                    void handleCreateProject();
                  }
                }}
                autoFocus
                className="text-base"
              />
            </div>

            <Button
              onClick={() => void handleCreateProject()}
              className="w-full"
              size="lg"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You can add details, links, and canvas data in the editor.
            </p>
          </m.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                Or import existing work
              </span>
            </div>
          </div>

          {/* Import Options - Simple text links */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <button
              onClick={() => {
                handleClose();
                onOpenURLImport();
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <span className="font-medium">Import from URL</span>
              <span className="text-muted-foreground ml-2">
                GitHub, website, or any link
              </span>
            </button>

            {onOpenFileImport && (
              <button
                onClick={() => {
                  handleClose();
                  onOpenFileImport();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">Upload file</span>
                <span className="text-muted-foreground ml-2">
                  PDF, pitch deck, or docs
                </span>
              </button>
            )}

            <button
              onClick={() => {
                handleClose();
                onOpenBatchImport();
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <span className="font-medium">Batch import</span>
              <span className="text-muted-foreground ml-2">
                Multiple URLs at once
              </span>
            </button>
          </m.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
