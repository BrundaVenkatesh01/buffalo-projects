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
          <DialogTitle className="text-xl font-bold">Create Your Business Page</DialogTitle>
          <DialogDescription>
            Your page stays private until you're ready to share it. No technical skills needed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-sm font-medium">
                Business or Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="e.g., Joe's Pizza, My Consulting Firm"
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
                  Creating Your Page...
                </>
              ) : (
                "Create My Page"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You'll add your details, photos, and contact info on the next screen.
            </p>
          </m.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                Already have content?
              </span>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            {onOpenFileImport && (
              <button
                onClick={() => {
                  handleClose();
                  onOpenFileImport();
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">Import from File</span>
                <span className="text-muted-foreground ml-2">
                  Upload a PDF, document, or presentation
                </span>
              </button>
            )}

            <button
              onClick={() => {
                handleClose();
                onOpenURLImport();
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <span className="font-medium">Import from Website</span>
              <span className="text-muted-foreground ml-2">
                Your website URL or GitHub repository
              </span>
            </button>

            <button
              onClick={() => {
                handleClose();
                onOpenBatchImport();
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm opacity-75"
            >
              <span className="font-medium">Import Multiple</span>
              <span className="text-muted-foreground ml-2">
                Advanced: Import several pages at once
              </span>
            </button>
          </m.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}