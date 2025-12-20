import { beforeEach, describe, expect, it } from "vitest";

import { localWorkspaceService } from "./localWorkspaceService";

describe("LocalWorkspaceService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates and retrieves a workspace locally", () => {
    const workspace = localWorkspaceService.createWorkspace({
      projectName: "Test Workspace",
      description: "Local only",
    });

    expect(workspace.code).toMatch(/^BUF-[A-Z0-9]{4}$/);

    const stored = localWorkspaceService.getWorkspace(workspace.code);
    expect(stored).not.toBeNull();
    expect(stored?.projectName).toBe("Test Workspace");
  });

  it("returns all workspaces sorted by lastModified", () => {
    const first = localWorkspaceService.createWorkspace({
      projectName: "First",
    });
    const second = localWorkspaceService.createWorkspace({
      projectName: "Second",
    });

    // Update first to have newer timestamp
    first.lastModified = new Date(Date.now() + 1000).toISOString();
    localWorkspaceService.saveWorkspace(first);

    const workspaces = localWorkspaceService.getWorkspaces();
    expect(workspaces).toHaveLength(2);
    expect(workspaces[0]?.code).toBe(first.code);
    expect(workspaces[1]?.code).toBe(second.code);
  });

  it("tracks pending sync state", () => {
    const workspace = localWorkspaceService.createWorkspace({
      projectName: "Sync Me",
    });

    expect(localWorkspaceService.getPendingSyncCodes()).toContain(
      workspace.code,
    );

    localWorkspaceService.saveWorkspace(
      { ...workspace, projectName: "Updated Name" },
      { markForSync: false },
    );

    expect(localWorkspaceService.getPendingSyncCodes()).not.toContain(
      workspace.code,
    );
  });
});
