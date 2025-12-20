import { nanoid } from "nanoid";

import type { CanvasState, Version } from "@/types";

export class VersionService {
  /**
   * Creates a version snapshot of the current canvas state
   * @param canvasData - The current state of the Business Model Canvas
   * @param projectDescription - Optional project description
   * @returns A Version object with snapshot metadata
   */
  createSnapshot(
    canvasData: CanvasState,
    projectDescription: string = "",
    note?: string,
  ): Version {
    return {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      bmcData: this.cloneCanvas(canvasData),
      projectDescription,
      snapshot: this.generateSnapshotDescription(canvasData),
      ...(note ? { note } : {}),
    };
  }

  /**
   * Generates a human-readable description of the canvas state
   * Focuses on key fields to give context about this version
   */
  generateSnapshotDescription(canvas: CanvasState): string {
    const filledFields = this.getFilledFields(canvas);

    if (filledFields.length === 0) {
      return "Empty canvas";
    }

    // Prioritize value proposition and customer segments for description
    const valueProps = canvas.valuePropositions?.trim();
    const customers = canvas.customerSegments?.trim();

    if (valueProps && customers) {
      return `${valueProps} for ${customers}`;
    } else if (valueProps) {
      return valueProps;
    } else if (customers) {
      return `Targeting ${customers}`;
    } else {
      // Fallback to first filled field
      const firstField = filledFields[0];
      if (!firstField) {
        return "Canvas snapshot";
      }
      const fieldValue: unknown = canvas[firstField];
      const snippet =
        typeof fieldValue === "string" ? fieldValue.substring(0, 100) : "";
      return snippet || "Canvas snapshot";
    }
  }

  /**
   * Deep clones canvas data to prevent mutations
   */
  private cloneCanvas(canvas: CanvasState): CanvasState {
    return {
      keyPartners: canvas.keyPartners,
      keyActivities: canvas.keyActivities,
      keyResources: canvas.keyResources,
      valuePropositions: canvas.valuePropositions,
      customerRelationships: canvas.customerRelationships,
      channels: canvas.channels,
      customerSegments: canvas.customerSegments,
      costStructure: canvas.costStructure,
      revenueStreams: canvas.revenueStreams,
    };
  }

  /**
   * Gets list of fields that have content
   */
  private getFilledFields(canvas: CanvasState): (keyof CanvasState)[] {
    const fields: (keyof CanvasState)[] = [
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

    return fields.filter((field) => {
      const value = canvas[field];
      return value.trim().length > 0;
    });
  }
}
