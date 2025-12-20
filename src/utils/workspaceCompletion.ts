/**
 * Workspace Completion Calculator
 *
 * Calculates workspace completion percentage based on:
 * - Business Model Canvas field completion
 * - Project metadata (name, description, stage)
 * - Journal entries
 * - Documents/evidence
 */

import type { Workspace } from "@/types";

export interface CompletionBreakdown {
  overall: number;
  canvas: number;
  metadata: number;
  journal: number;
  documents: number;
}

const BMC_FIELDS = [
  "customerSegments",
  "valuePropositions",
  "channels",
  "customerRelationships",
  "revenueStreams",
  "keyResources",
  "keyActivities",
  "keyPartners",
  "costStructure",
] as const;

/**
 * Check if a text field has meaningful content
 */
function hasContent(value: string | undefined | null): boolean {
  if (!value) {
    return false;
  }
  const trimmed = value.trim();
  // Require at least 10 characters to count as "completed"
  return trimmed.length >= 10;
}

/**
 * Calculate Business Model Canvas completion (0-100)
 */
export function calculateCanvasCompletion(workspace: Workspace | null): number {
  if (!workspace?.bmcData) {
    return 0;
  }

  const completedFields = BMC_FIELDS.filter((field) =>
    hasContent(workspace.bmcData[field]),
  ).length;

  return Math.round((completedFields / BMC_FIELDS.length) * 100);
}

/**
 * Calculate metadata completion (0-100)
 */
export function calculateMetadataCompletion(
  workspace: Workspace | null,
): number {
  if (!workspace) {
    return 0;
  }

  let completed = 0;
  const total = 4; // projectName, description, stage, tags

  // Project name (required)
  if (hasContent(workspace.projectName)) {
    completed++;
  }

  // Description
  if (hasContent(workspace.projectDescription)) {
    completed++;
  }

  // Stage
  if (workspace.stage) {
    completed++;
  }

  // Tags (at least 1)
  if (workspace.tags && workspace.tags.length > 0) {
    completed++;
  }

  return Math.round((completed / total) * 100);
}

/**
 * Calculate journal completion (0-100)
 */
export function calculateJournalCompletion(
  workspace: Workspace | null,
): number {
  if (!workspace?.journal) {
    return 0;
  }

  // At least 3 journal entries = 100%
  const entries = workspace.journal.length;
  if (entries >= 3) {
    return 100;
  }

  return Math.round((entries / 3) * 100);
}

/**
 * Calculate documents/evidence completion (0-100)
 */
export function calculateDocumentsCompletion(
  workspace: Workspace | null,
): number {
  if (!workspace?.documents) {
    return 0;
  }

  // At least 2 documents = 100%
  const docs = workspace.documents.length;
  if (docs >= 2) {
    return 100;
  }

  return Math.round((docs / 2) * 100);
}

/**
 * Calculate overall workspace completion with weighted scores
 */
export function calculateWorkspaceCompletion(
  workspace: Workspace | null,
): CompletionBreakdown {
  const canvas = calculateCanvasCompletion(workspace);
  const metadata = calculateMetadataCompletion(workspace);
  const journal = calculateJournalCompletion(workspace);
  const documents = calculateDocumentsCompletion(workspace);

  // Weighted average:
  // - Canvas: 50% (most important)
  // - Metadata: 30%
  // - Journal: 10%
  // - Documents: 10%
  const overall = Math.round(
    canvas * 0.5 + metadata * 0.3 + journal * 0.1 + documents * 0.1,
  );

  return {
    overall,
    canvas,
    metadata,
    journal,
    documents,
  };
}

/**
 * Get completion status label
 */
export function getCompletionLabel(percentage: number): string {
  if (percentage === 0) {
    return "Just started";
  }
  if (percentage < 25) {
    return "Getting started";
  }
  if (percentage < 50) {
    return "Making progress";
  }
  if (percentage < 75) {
    return "Taking shape";
  }
  if (percentage < 100) {
    return "Almost done";
  }
  return "Complete";
}

/**
 * Get next recommended action based on completion
 */
export function getNextAction(workspace: Workspace | null): string {
  if (!workspace) {
    return "Start building your project";
  }

  const completion = calculateWorkspaceCompletion(workspace);

  // Check what's least complete
  if (completion.canvas < 30) {
    return "Fill out more Business Model Canvas fields";
  }

  if (completion.metadata < 50) {
    return "Add project details (stage, tags, description)";
  }

  if (completion.journal === 0) {
    return "Document your first journal entry";
  }

  if (completion.documents === 0) {
    return "Upload supporting documents or evidence";
  }

  if (completion.overall < 100) {
    return "Complete remaining canvas fields";
  }

  return "Consider publishing your project";
}
