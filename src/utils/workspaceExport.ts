/**
 * Workspace Data Export Utilities
 *
 * Implements Privacy Charter commitment: "Download your entire workspace as JSON"
 * Format is open (not proprietary) for portability.
 */

import type { Workspace } from "@/types";

interface WorkspaceExportData {
  exportVersion: string;
  exportedAt: string;
  workspace: {
    code: string;
    projectName: string;
    projectDescription: string;
    oneLiner?: string;
    category?: string;
    stage?: string;
    tags: string[];
    isPublic: boolean;
    slug?: string;
    createdAt: string;
    lastModified: string;
    publishedAt?: string;
  };
  canvas: Workspace["bmcData"];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    linkedFields?: string[];
    extractedText?: string;
  }>;
  versions: Workspace["versions"];
  pivots: Workspace["pivots"];
  embeds: Workspace["embeds"];
  socialLinks: Workspace["socialLinks"];
  metadata: {
    views?: number;
    appreciations?: number;
    commentCount?: number;
  };
}

/**
 * Export workspace data to JSON
 * Follows Privacy Charter: Open format, no limits, no paywalls
 */
export function exportWorkspaceData(workspace: Workspace): WorkspaceExportData {
  return {
    exportVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    workspace: {
      code: workspace.code,
      projectName: workspace.projectName || "Untitled",
      projectDescription: workspace.projectDescription || "",
      oneLiner: workspace.oneLiner,
      category: workspace.category,
      stage: workspace.stage,
      tags: workspace.tags || [],
      isPublic: workspace.isPublic || false,
      slug: workspace.slug,
      createdAt: workspace.createdAt || new Date().toISOString(),
      lastModified: workspace.lastModified || new Date().toISOString(),
      publishedAt: workspace.publishedAt
        ? new Date(workspace.publishedAt).toISOString()
        : undefined,
    },
    canvas: workspace.bmcData || {},
    documents: (workspace.documents || []).map((doc) => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: doc.size,
      uploadedAt: doc.uploadedAt || new Date().toISOString(),
      linkedFields: doc.linkedFields,
      extractedText: doc.extractedText,
    })),
    versions: workspace.versions || [],
    pivots: workspace.pivots || [],
    embeds: workspace.embeds,
    socialLinks: workspace.socialLinks,
    metadata: {
      views: workspace.views,
      appreciations: workspace.appreciations,
      commentCount: workspace.commentCount,
    },
  };
}

/**
 * Download workspace data as JSON file
 */
export function downloadWorkspaceExport(workspace: Workspace): void {
  const exportData = exportWorkspaceData(workspace);
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `buffalo-${workspace.code}-${Date.now()}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Get human-readable summary of export contents
 */
export function getExportSummary(workspace: Workspace): {
  canvasFields: number;
  documents: number;
  versions: number;
  totalSize: string;
} {
  const canvasFields = Object.values(workspace.bmcData || {}).filter(
    (value) => value && String(value).trim().length > 0,
  ).length;

  const documents = workspace.documents?.length || 0;
  const versions = workspace.versions?.length || 0;

  // Estimate size (rough calculation)
  const jsonSize = JSON.stringify(exportWorkspaceData(workspace)).length;
  const sizeKB = Math.round(jsonSize / 1024);
  const totalSize =
    sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

  return {
    canvasFields,
    documents,
    versions,
    totalSize,
  };
}
