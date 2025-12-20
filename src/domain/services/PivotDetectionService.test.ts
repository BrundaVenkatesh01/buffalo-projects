import { describe, it, expect } from "vitest";

import { PivotDetectionService } from "./PivotDetectionService";

import type { CanvasState } from "@/types";

describe("PivotDetectionService", () => {
  const service = new PivotDetectionService();

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

  const initialCanvas: CanvasState = {
    ...emptyCanvas,
    valuePropositions: "AI-powered task management",
    customerSegments: "Busy professionals",
    revenueStreams: "Subscription $10/month",
  };

  describe("detectPivot", () => {
    it("should detect no pivot when canvases are identical", () => {
      const pivot = service.detectPivot(
        initialCanvas,
        initialCanvas,
        "v1",
        "v2",
      );
      expect(pivot).toBeNull();
    });

    it("should detect minor pivot when 1-2 fields change", () => {
      const newCanvas = {
        ...initialCanvas,
        revenueStreams: "Subscription $15/month", // Price change
      };

      const pivot = service.detectPivot(initialCanvas, newCanvas, "v1", "v2");
      expect(pivot).not.toBeNull();
      expect(pivot?.magnitude).toBe("minor");
      expect(pivot?.fields).toEqual(["revenueStreams"]);
    });

    it("should detect major pivot when 3-5 fields change", () => {
      const newCanvas = {
        ...initialCanvas,
        valuePropositions: "Team collaboration platform", // Different value prop
        customerSegments: "Remote teams", // Different segment
        channels: "Direct sales, partnerships", // New channel
        revenueStreams: "Tiered pricing $20-100/month", // New pricing
      };

      const pivot = service.detectPivot(initialCanvas, newCanvas, "v1", "v2");
      expect(pivot).not.toBeNull();
      expect(pivot?.magnitude).toBe("major");
      expect(pivot?.fields).toHaveLength(4);
    });

    it("should detect complete pivot when 6+ fields change", () => {
      const newCanvas: CanvasState = {
        keyPartners: "Technology providers",
        keyActivities: "Platform development",
        keyResources: "Engineering team",
        valuePropositions: "Completely different product",
        customerRelationships: "Self-service",
        channels: "Online marketplace",
        customerSegments: "Entirely new market",
        costStructure: "Different cost model",
        revenueStreams: "Different revenue model",
      };

      const pivot = service.detectPivot(initialCanvas, newCanvas, "v1", "v2");
      expect(pivot).not.toBeNull();
      expect(pivot?.magnitude).toBe("complete");
      expect(pivot?.fields.length).toBeGreaterThanOrEqual(6);
    });

    it("should include version references", () => {
      const newCanvas = { ...initialCanvas, revenueStreams: "New pricing" };
      const pivot = service.detectPivot(initialCanvas, newCanvas, "v1", "v2");

      expect(pivot?.fromVersion).toBe("v1");
      expect(pivot?.toVersion).toBe("v2");
    });

    it("should generate unique pivot ID", () => {
      const newCanvas = { ...initialCanvas, revenueStreams: "New pricing" };
      const pivot1 = service.detectPivot(initialCanvas, newCanvas, "v1", "v2");
      const pivot2 = service.detectPivot(initialCanvas, newCanvas, "v1", "v2");

      expect(pivot1?.id).toBeDefined();
      expect(pivot2?.id).toBeDefined();
      expect(pivot1?.id).not.toBe(pivot2?.id);
    });
  });
});
