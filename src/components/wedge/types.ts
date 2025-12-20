/**
 * Wedge Components - Type Definitions
 *
 * Types for validation, reflection, peer intelligence, and narrative components
 * that differentiate Buffalo Projects from generic canvas tools.
 */

import type { ReactNode } from "react";

import type {
  Workspace,
  Version,
  Pivot,
  CanvasBlockId,
  ProjectDocument,
  ProjectCategory,
  ProjectStage,
} from "@/types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Visual theme for wedge cards */
export type WedgeTheme = "reflection" | "evidence" | "peer" | "narrative";

/** Priority level affects visual prominence */
export type WedgePriority = "low" | "medium" | "high";

/** Base props shared by all wedge components */
export interface WedgeBaseProps {
  /** Unique identifier for tracking/dismissal */
  id: string;
  /** Whether the component can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REFLECTION LAYER TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Source of reflection prompt - what triggered it */
export type ReflectionSource =
  | { type: "pivot"; pivotId: string; magnitude: "minor" | "major" | "complete" }
  | { type: "version"; versionId: string; daysSince: number }
  | { type: "stagnation"; daysSinceUpdate: number }
  | { type: "milestone"; milestone: string }
  | { type: "evidence-gap"; blockId: CanvasBlockId; blockName: string }
  | { type: "stage-mismatch"; currentStage: ProjectStage; expectedProgress: string };

/** Props for ReflectionPrompt component */
export interface ReflectionPromptProps extends WedgeBaseProps {
  /** The reflection question to ask */
  question: string;
  /** Optional supporting context derived from user data */
  context?: string;
  /** Source of the reflection (what data triggered this) */
  source: ReflectionSource;
  /** Visual urgency level */
  priority?: WedgePriority;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Props for ReflectionTimeline component */
export interface ReflectionTimelineProps {
  /** Version history to display */
  versions: Version[];
  /** Pivot history */
  pivots: Pivot[];
  /** Currently selected version for comparison */
  selectedVersionId?: string;
  /** Callback when version selected */
  onVersionSelect?: (versionId: string) => void;
  /** Maximum items to show */
  maxItems?: number;
  /** Compact mode for sidebar */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Generated reflection prompt from workspace data */
export interface GeneratedReflection {
  id: string;
  question: string;
  context?: string;
  source: ReflectionSource;
  priority: WedgePriority;
  generatedAt: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVIDENCE GAP FINDER TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Status of evidence for a canvas block */
export type EvidenceStatus = "empty" | "claimed" | "partial" | "supported";

/** Props for EvidenceGapIndicator component */
export interface EvidenceGapIndicatorProps {
  /** Canvas block being analyzed */
  blockId: CanvasBlockId;
  /** Current content in the block */
  content: string;
  /** Documents linked to this block */
  linkedDocuments: ProjectDocument[];
  /** Display variant */
  variant?: "badge" | "inline" | "tooltip" | "card";
  /** Show actionable CTA */
  showAction?: boolean;
  /** Callback to add evidence */
  onAddEvidence?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/** Props for EvidenceGapSummary component */
export interface EvidenceGapSummaryProps {
  /** Full workspace data */
  workspace: Workspace;
  /** Display mode */
  variant?: "compact" | "detailed" | "chart";
  /** Highlight blocks with gaps */
  highlightGaps?: boolean;
  /** Callback when block clicked */
  onBlockClick?: (blockId: CanvasBlockId) => void;
  /** Additional CSS classes */
  className?: string;
}

/** Analysis result for evidence gaps */
export interface EvidenceGapAnalysis {
  /** Total number of canvas blocks (9) */
  totalBlocks: number;
  /** Number of blocks with content */
  filledBlocks: number;
  /** Number of blocks with linked evidence */
  evidencedBlocks: number;
  /** Block IDs that have content but no evidence */
  gapBlocks: CanvasBlockId[];
  /** Overall validation score (0-100) */
  overallScore: number;
  /** Specific recommendations for gaps */
  recommendations: GapRecommendation[];
}

/** Recommendation for fixing an evidence gap */
export interface GapRecommendation {
  blockId: CanvasBlockId;
  blockName: string;
  suggestion: string;
  priority: WedgePriority;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PEER INTELLIGENCE TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Type of peer insight being shown */
export type PeerInsightType =
  | "common-pivot"
  | "evidence-pattern"
  | "stage-milestone"
  | "give-ask-match"
  | "similar-journey";

/** Reference to a peer project (may be anonymized) */
export interface PeerProjectReference {
  /** Anonymized or public project name */
  displayName: string;
  /** Category for context */
  category: ProjectCategory;
  /** Stage when pattern occurred */
  stage: ProjectStage;
  /** Link if public project */
  slug?: string;
}

/** Props for PeerInsightCard component */
export interface PeerInsightCardProps extends WedgeBaseProps {
  /** Type of insight being shown */
  insightType: PeerInsightType;
  /** The insight content */
  insight: string;
  /** Number of projects this pattern appears in */
  projectCount: number;
  /** Sample project references */
  sampleProjects?: PeerProjectReference[];
  /** Whether insight is actionable */
  actionable?: boolean;
  /** Primary action */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Props for PeerComparisonBadge component */
export interface PeerComparisonBadgeProps {
  /** What metric is being compared */
  metric: "canvas-completion" | "evidence-count" | "pivot-count" | "journal-entries";
  /** User's current value */
  userValue: number;
  /** Peer average for similar projects */
  peerAverage: number;
  /** Number of peers in comparison set */
  peerCount: number;
  /** Display variant */
  variant?: "badge" | "tooltip" | "inline";
  /** Additional CSS classes */
  className?: string;
}

/** Stored peer insight data */
export interface PeerInsight {
  id: string;
  type: PeerInsightType;
  insight: string;
  projectCount: number;
  relevanceScore: number;
  createdAt: string;
}

/** Peer statistics computed from gallery data */
export interface PeerStatistics {
  averageCanvasCompletion: number;
  averageEvidenceCount: number;
  averagePivotCount: number;
  averageJournalEntries: number;
  sampleSize: number;
  computedAt: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NARRATIVE EXPORTER TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Narrative template format */
export type NarrativeFormat = "pitch" | "case-study" | "journey" | "technical";

/** Export format for narrative */
export type ExportFormat = "pdf" | "markdown" | "notion" | "clipboard";

/** Sections of a narrative story */
export interface NarrativeSections {
  title: string;
  origin: string;
  problem: string;
  evolution: string;
  evidence: string;
  currentState: string;
  nextSteps: string;
}

/** Props for NarrativePreview component */
export interface NarrativePreviewProps {
  /** Workspace to generate narrative from */
  workspace: Workspace;
  /** Narrative template/format */
  format: NarrativeFormat;
  /** Preview mode */
  previewMode?: "summary" | "full" | "timeline";
  /** Editable sections */
  editable?: boolean;
  /** Custom narrative overrides */
  customSections?: Partial<NarrativeSections>;
  /** Export actions */
  onExport?: (format: ExportFormat) => void;
  /** Additional CSS classes */
  className?: string;
}

/** Props for NarrativeExportButton component */
export interface NarrativeExportButtonProps {
  /** Workspace to export */
  workspace: Workspace;
  /** Available export formats */
  formats?: ExportFormat[];
  /** Button variant */
  variant?: "default" | "primary" | "ghost" | "outline";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Show dropdown or single action */
  showDropdown?: boolean;
  /** Callback on successful export */
  onExportComplete?: (format: ExportFormat) => void;
  /** Additional CSS classes */
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEDGE CARD (SHARED BASE) TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Props for the base WedgeCard component */
export interface WedgeCardProps {
  /** Unique identifier for tracking */
  id: string;
  /** Visual theme */
  theme: WedgeTheme;
  /** Priority affects visual prominence */
  priority?: WedgePriority;
  /** Whether card can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Whether card is currently dismissed */
  isDismissed?: boolean;
  /** Left accent icon */
  icon?: ReactNode;
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STORE TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Record of a dismissed prompt */
export interface DismissedPrompt {
  id: string;
  dismissedAt: string;
  /** null = global dismissal */
  workspaceCode?: string;
  /** null = permanent dismissal */
  expiresAt?: string;
}

/** User preferences for wedge features */
export interface WedgePreferences {
  showReflectionPrompts: boolean;
  showEvidenceGaps: boolean;
  showPeerInsights: boolean;
  reflectionFrequency: "always" | "daily" | "weekly";
}

/** Default wedge preferences */
export const DEFAULT_WEDGE_PREFERENCES: WedgePreferences = {
  showReflectionPrompts: true,
  showEvidenceGaps: true,
  showPeerInsights: true,
  reflectionFrequency: "always",
};
