/**
 * Wedge Components
 *
 * UI components that differentiate Buffalo Projects from generic canvas tools.
 * These enable validation, reflection, peer intelligence, and narrative export.
 *
 * @module wedge
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type {
  // Shared types
  WedgeTheme,
  WedgePriority,
  WedgeBaseProps,
  // Reflection types
  ReflectionSource,
  ReflectionPromptProps,
  ReflectionTimelineProps,
  GeneratedReflection,
  // Evidence types
  EvidenceStatus,
  EvidenceGapIndicatorProps,
  EvidenceGapSummaryProps,
  EvidenceGapAnalysis,
  GapRecommendation,
  // Peer types
  PeerInsightType,
  PeerProjectReference,
  PeerInsightCardProps,
  PeerComparisonBadgeProps,
  PeerInsight,
  PeerStatistics,
  // Narrative types
  NarrativeFormat,
  ExportFormat,
  NarrativeSections,
  NarrativePreviewProps,
  NarrativeExportButtonProps,
  // Store types
  DismissedPrompt,
  WedgePreferences,
  // Card types
  WedgeCardProps,
} from "./types";

export { DEFAULT_WEDGE_PREFERENCES } from "./types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  // Components
  DismissButton,
  WedgeCard,
  WedgeCardTitle,
  WedgeCardDescription,
  WedgeCardActions,
  WedgeCardMeta,
  // Motion
  WEDGE_EASING,
  wedgeCardVariants,
  wedgeCardHover,
  wedgePulseVariants,
  wedgeBadgeVariants,
  wedgeListVariants,
  wedgeListItemVariants,
  wedgeIconVariants,
  wedgeProgressVariants,
  wedgeTransition,
  wedgeTransitionFast,
  wedgeTransitionSlow,
} from "./shared";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REFLECTION COMPONENTS (Phase 2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// TODO: Phase 2 - Uncomment when implemented
// export { ReflectionPrompt } from "./reflection/ReflectionPrompt";
// export { ReflectionTimeline } from "./reflection/ReflectionTimeline";
// export { generateReflections } from "./reflection/ReflectionTriggers";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVIDENCE COMPONENTS (Phase 3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// TODO: Phase 3 - Uncomment when implemented
// export { EvidenceGapIndicator } from "./evidence/EvidenceGapIndicator";
// export { EvidenceGapSummary } from "./evidence/EvidenceGapSummary";
// export { analyzeEvidenceGaps } from "./evidence/EvidenceAnalyzer";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PEER COMPONENTS (Phase 4)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// TODO: Phase 4 - Uncomment when implemented
// export { PeerInsightCard } from "./peer/PeerInsightCard";
// export { PeerComparisonBadge } from "./peer/PeerComparisonBadge";
// export { detectPeerPatterns } from "./peer/PeerPatternService";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NARRATIVE COMPONENTS (Phase 5)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// TODO: Phase 5 - Uncomment when implemented
// export { NarrativePreview } from "./narrative/NarrativePreview";
// export { NarrativeExportButton } from "./narrative/NarrativeExportButton";
// export { generateNarrative } from "./narrative/NarrativeGenerator";
