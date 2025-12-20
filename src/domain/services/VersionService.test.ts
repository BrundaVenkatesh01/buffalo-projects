import { describe, it, expect } from "vitest";

import { VersionService } from "./VersionService";

import type { CanvasState } from "@/types";

describe("VersionService", () => {
  const service = new VersionService();

  const sampleCanvas: CanvasState = {
    keyPartners: "Technology providers",
    keyActivities: "Platform development",
    keyResources: "Engineering team",
    valuePropositions: "AI-powered task management",
    customerRelationships: "Self-service support",
    channels: "Web and mobile app",
    customerSegments: "Busy professionals",
    costStructure: "Development and hosting",
    revenueStreams: "Subscription $10/month",
  };

  describe("createSnapshot", () => {
    it("should create a version snapshot with unique ID", () => {
      const version = service.createSnapshot(sampleCanvas);

      expect(version.id).toBeDefined();
      expect(typeof version.id).toBe("string");
      expect(version.id.length).toBeGreaterThan(0);
    });

    it("should include timestamp", () => {
      const version = service.createSnapshot(sampleCanvas);

      expect(version.timestamp).toBeDefined();
      expect(new Date(version.timestamp).toString()).not.toBe("Invalid Date");
    });

    it("should clone the canvas data", () => {
      const version = service.createSnapshot(sampleCanvas);

      expect(version.bmcData).toEqual(sampleCanvas);
      expect(version.bmcData).not.toBe(sampleCanvas); // Different reference
    });

    it("should generate a snapshot description", () => {
      const version = service.createSnapshot(sampleCanvas);

      expect(version.snapshot).toBeDefined();
      expect(typeof (version.snapshot || "")).toBe("string");
      expect((version.snapshot || "").length).toBeGreaterThan(0);
    });

    it("should handle empty canvas", () => {
      const emptyCanvas: CanvasState = {
        keyPartners: "",
        keyActivities: "",
        keyResources: "",
        valuePropositions: "",
        customerRelationships: "",
        channels: "",
        customerSegments: "",
        costStructure: "",
        revenueStreams: "",
      };

      const version = service.createSnapshot(emptyCanvas);

      expect(version.id).toBeDefined();
      expect(version.snapshot || "").toBe("Empty canvas");
    });
  });

  describe("generateSnapshotDescription", () => {
    it("should summarize filled fields", () => {
      const description = service.generateSnapshotDescription(sampleCanvas);

      expect(description).toContain("AI-powered task management");
      expect(description).toContain("Busy professionals");
    });

    it("should handle partially filled canvas", () => {
      const partialCanvas: CanvasState = {
        ...sampleCanvas,
        keyPartners: "",
        keyActivities: "",
        keyResources: "",
      };

      const description = service.generateSnapshotDescription(partialCanvas);

      expect(description).toBeDefined();
      expect(description.length).toBeGreaterThan(0);
    });
  });
});
