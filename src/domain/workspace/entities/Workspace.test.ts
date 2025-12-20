import { describe, it, expect, beforeEach } from "vitest";

import type { CanvasState } from "../../../types";
import { ProjectCode } from "../../shared/value-objects/ProjectCode";

import { Workspace } from "./Workspace";

describe("Workspace Entity", () => {
  let code: ProjectCode;

  beforeEach(() => {
    code = ProjectCode.fromString("BUF-TEST");
  });

  describe("creation", () => {
    it("should create a new workspace with required fields", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test Project",
        description: "Test Description",
      });

      expect(workspace.code.equals(code)).toBe(true);
      expect(workspace.projectName).toBe("Test Project");
      expect(workspace.description).toBe("Test Description");
      expect(workspace.isPublic).toBe(false);
      expect(workspace.versions).toHaveLength(0);
      expect(workspace.pivots).toHaveLength(0);
    });

    it("should validate project name is not empty", () => {
      expect(() =>
        Workspace.create({
          code,
          projectName: "",
          description: "Test",
        }),
      ).toThrow("Project name cannot be empty");
    });

    it("should create with optional class code", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Class Project",
        description: "For ENT-101",
        classCode: "BUF-CLASS-SPRING24",
      });

      expect(workspace.classCode).toBe("BUF-CLASS-SPRING24");
    });
  });

  describe("canvas updates", () => {
    it("should update canvas state", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test",
        description: "Test",
      });

      const updatedCanvas: Partial<CanvasState> = {
        valuePropositions: "Solving real problems",
        customerSegments: "Startups in Buffalo",
      };

      workspace.updateCanvas(updatedCanvas);

      expect(workspace.bmcData.valuePropositions).toBe("Solving real problems");
      expect(workspace.bmcData.customerSegments).toBe("Startups in Buffalo");
    });

    it("should create a version when canvas is significantly updated", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test",
        description: "Initial description",
      });

      const majorUpdate: Partial<CanvasState> = {
        valuePropositions: "New value prop",
        customerSegments: "New segments",
        channels: "New channels",
      };

      workspace.updateCanvas(majorUpdate, true);

      expect(workspace.versions).toHaveLength(1);
      expect(workspace.versions[0]!.bmcData.valuePropositions).toBe(
        "New value prop",
      );
    });
  });

  describe("journal entries", () => {
    it("should add journal entry", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test",
        description: "Test",
      });

      workspace.addJournalEntry("First insight about the market");

      expect(workspace.journal).toHaveLength(1);
      expect(workspace.journal[0]!.content).toBe(
        "First insight about the market",
      );
    });

    it("should link journal entry to version", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test",
        description: "Test",
      });

      workspace.updateCanvas({ valuePropositions: "Test" }, true);
      const versionId = workspace.versions[0]!.id;

      workspace.addJournalEntry("Linked to version", versionId);

      expect(workspace.journal[0]!.linkedVersion).toBe(versionId);
    });
  });

  describe("public/private", () => {
    it("should toggle public status", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test",
        description: "Test",
      });

      expect(workspace.isPublic).toBe(false);

      workspace.makePublic("https://example.com/project");

      expect(workspace.isPublic).toBe(true);
      expect(workspace.publicLink).toBe("https://example.com/project");
    });

    it("should make private", () => {
      const workspace = Workspace.create({
        code,
        projectName: "Test",
        description: "Test",
      });

      workspace.makePublic("https://example.com/project");
      workspace.makePrivate();

      expect(workspace.isPublic).toBe(false);
      expect(workspace.publicLink).toBeUndefined();
    });
  });
});
