"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CanvasIntroModal } from "@/components/onboarding";
import { WorkspaceEditor } from "@/components/workspace/layout";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";

interface UnifiedProjectEditorProps {
  workspaceCode: string;
}

/**
 * UnifiedProjectEditor Component
 *
 * Unified editor for all projects. All projects have access to the same features:
 * - Basic project details and links
 * - Business Model Canvas (marked as Beta)
 * - Evidence management and document upload
 * - Version history and pivot tracking
 *
 * No more distinction between "showcase" and "workspace" project types.
 */
export function UnifiedProjectEditor({
  workspaceCode,
}: UnifiedProjectEditorProps) {
  const router = useRouter();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const loadWorkspace = useWorkspaceStore((state) => state.loadWorkspace);
  const loading = useWorkspaceStore((state) => state.loading);

  // Load workspace on mount
  useEffect(() => {
    void loadWorkspace(workspaceCode);
  }, [workspaceCode, loadWorkspace]);

  // Update local workspace when store updates
  useEffect(() => {
    if (currentWorkspace?.code === workspaceCode) {
      setWorkspace(currentWorkspace);
    }
  }, [currentWorkspace, workspaceCode]);

  // Handle "new" workspace - redirect to unified creation
  useEffect(() => {
    if (workspaceCode === "new" && !loading) {
      router.replace("/workspace/new");
    }
  }, [workspaceCode, loading, router]);

  // Show loading state while workspace loads
  if (!workspace) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-white/10 rounded" />
            <div className="h-6 w-1/2 bg-white/5 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-white/5 rounded" />
              <div className="h-8 w-32 bg-white/5 rounded" />
            </div>
          </div>
          {/* Stats grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg" />
            ))}
          </div>
          {/* Canvas grid skeleton */}
          <div className="h-96 bg-white/10 rounded-lg" />
        </div>
      </div>
    );
  }

  // Render unified editor for all projects
  return (
    <>
      {/* Canvas intro modal for first-time users */}
      <CanvasIntroModal />
      <WorkspaceEditor workspaceId={workspaceCode} />
    </>
  );
}
