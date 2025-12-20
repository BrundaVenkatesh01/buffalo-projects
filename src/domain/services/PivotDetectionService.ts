import { nanoid } from "nanoid";

import type { CanvasState, Pivot } from "@/types";

export class PivotDetectionService {
  /**
   * Detects pivots by comparing two canvas states
   * @param previousCanvas - The previous version of the canvas
   * @param currentCanvas - The current version of the canvas
   * @param fromVersion - Version identifier for the previous state
   * @param toVersion - Version identifier for the current state
   * @returns A Pivot object if changes detected, null otherwise
   */
  detectPivot(
    previousCanvas: CanvasState,
    currentCanvas: CanvasState,
    fromVersion: string,
    toVersion: string,
  ): Pivot | null {
    const changedFields = this.getChangedFields(previousCanvas, currentCanvas);

    // No pivot if nothing changed
    if (changedFields.length === 0) {
      return null;
    }

    const magnitude = this.determineMagnitude(changedFields.length);

    return {
      id: nanoid(),
      date: new Date().toISOString(),
      fromVersion,
      toVersion,
      fields: changedFields,
      magnitude,
    };
  }

  /**
   * Identifies which fields have changed between two canvas states
   */
  private getChangedFields(
    previous: CanvasState,
    current: CanvasState,
  ): string[] {
    const canvasFields: (keyof CanvasState)[] = [
      "keyPartners",
      "keyActivities",
      "keyResources",
      "valuePropositions",
      "customerRelationships",
      "channels",
      "customerSegments",
      "costStructure",
      "revenueStreams",
    ];

    return canvasFields.filter((field) => {
      const previousValue = (previous[field] || "").trim();
      const currentValue = (current[field] || "").trim();
      return previousValue !== currentValue;
    });
  }

  /**
   * Determines pivot magnitude based on number of changed fields
   * Business rule:
   * - 1-2 fields: minor pivot
   * - 3-5 fields: major pivot
   * - 6+ fields: complete pivot
   */
  private determineMagnitude(
    changedFieldCount: number,
  ): "minor" | "major" | "complete" {
    if (changedFieldCount <= 2) {
      return "minor";
    } else if (changedFieldCount <= 5) {
      return "major";
    } else {
      return "complete";
    }
  }
}
