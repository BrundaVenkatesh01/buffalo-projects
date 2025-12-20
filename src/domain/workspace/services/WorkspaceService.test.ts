import { describe, it, expect, beforeEach } from "vitest";

import type { CanvasState } from "../../../types";
import type { ProjectCode } from "../../shared/value-objects/ProjectCode";
import type { Workspace } from "../entities/Workspace";
import type { IWorkspaceRepository } from "../repositories/IWorkspaceRepository";

import { WorkspaceService } from "./WorkspaceService";

// Mock repository
class MockWorkspaceRepository implements IWorkspaceRepository {
  private workspaces: Map<string, Workspace> = new Map();

  findByCode(code: ProjectCode): Promise<Workspace | null> {
    return Promise.resolve(this.workspaces.get(code.value) || null);
  }

  save(workspace: Workspace): Promise<void> {
    this.workspaces.set(workspace.code.value, workspace);
    return Promise.resolve();
  }

  delete(code: ProjectCode): Promise<void> {
    this.workspaces.delete(code.value);
    return Promise.resolve();
  }

  findAllByUser(): Promise<Workspace[]> {
    return Promise.resolve(Array.from(this.workspaces.values()));
  }

  findPublic(limit?: number): Promise<Workspace[]> {
    const publicWorkspaces = Array.from(this.workspaces.values()).filter(
      (w) => w.isPublic,
    );
    return Promise.resolve(
      limit ? publicWorkspaces.slice(0, limit) : publicWorkspaces,
    );
  }

  findByClassCode(classCode: string): Promise<Workspace[]> {
    return Promise.resolve(
      Array.from(this.workspaces.values()).filter(
        (w) => w.classCode === classCode,
      ),
    );
  }

  exists(code: ProjectCode): Promise<boolean> {
    return Promise.resolve(this.workspaces.has(code.value));
  }
}

describe("WorkspaceService", () => {
  let service: WorkspaceService;
  let repository: MockWorkspaceRepository;

  beforeEach(() => {
    repository = new MockWorkspaceRepository();
    service = new WorkspaceService(repository);
  });

  describe("createWorkspace", () => {
    it("should create and save a new workspace", async () => {
      const workspace = await service.createWorkspace({
        projectName: "Test Project",
        description: "Test Description",
      });

      expect(workspace.projectName).toBe("Test Project");
      expect(workspace.description).toBe("Test Description");

      const found = await repository.findByCode(workspace.code);
      expect(found).toBeTruthy();
    });

    it("should generate unique codes", async () => {
      const ws1 = await service.createWorkspace({
        projectName: "Project 1",
        description: "Desc 1",
      });

      const ws2 = await service.createWorkspace({
        projectName: "Project 2",
        description: "Desc 2",
      });

      expect(ws1.code.equals(ws2.code)).toBe(false);
    });
  });

  describe("updateWorkspace", () => {
    it("should update workspace canvas", async () => {
      const workspace = await service.createWorkspace({
        projectName: "Test",
        description: "Test",
      });

      const updates: Partial<CanvasState> = {
        valuePropositions: "New value prop",
        customerSegments: "New segments",
      };

      await service.updateWorkspace(workspace.code, updates);

      const updated = await repository.findByCode(workspace.code);
      expect(updated?.bmcData.valuePropositions).toBe("New value prop");
      expect(updated?.bmcData.customerSegments).toBe("New segments");
    });
  });

  describe("detectPivot", () => {
    it("should detect major pivot when multiple fields change significantly", async () => {
      const workspace = await service.createWorkspace({
        projectName: "Test",
        description: "Test",
      });

      // Initial state - update with createVersion flag
      await service.updateWorkspace(
        workspace.code,
        {
          valuePropositions: "Original value prop",
          customerSegments: "Original segments",
          channels: "Original channels",
        },
        true,
      ); // Create first version

      // Major change - create another version with different content
      await service.updateWorkspace(
        workspace.code,
        {
          valuePropositions:
            "Completely different value proposition that has changed",
          customerSegments: "Totally new customer segments and markets",
          channels: "New distribution channels and partnerships",
        },
        true,
      ); // Create second version

      const updated = await repository.findByCode(workspace.code);
      const hasPivot = service.detectPivot(updated!);

      expect(hasPivot).toBe(true);
    });

    it("should not detect pivot for minor changes", async () => {
      const workspace = await service.createWorkspace({
        projectName: "Test",
        description: "Test",
      });

      await service.updateWorkspace(workspace.code, {
        valuePropositions: "Original",
      });

      const ws = await repository.findByCode(workspace.code);
      ws?.createVersion();
      await repository.save(ws!);

      await service.updateWorkspace(workspace.code, {
        costStructure: "Some costs",
      });

      const updated = await repository.findByCode(workspace.code);
      const hasPivot = service.detectPivot(updated!);

      expect(hasPivot).toBe(false);
    });
  });

  describe("deleteWorkspace", () => {
    it("should delete workspace", async () => {
      const workspace = await service.createWorkspace({
        projectName: "Test",
        description: "Test",
      });

      await service.deleteWorkspace(workspace.code);

      const found = await repository.findByCode(workspace.code);
      expect(found).toBeNull();
    });
  });
});
