import type { LucideIcon } from "lucide-react";

import {
  Lightbulb,
  Search,
  ClipboardList,
  Building,
  CheckCircle,
  Rocket,
  TrendingUp,
} from "@/icons";
import { STAGE_COLORS } from "@/tokens/semantic/components";
import type { ProjectStage } from "@/types";

/**
 * Stage Configuration
 * Single source of truth for all project stage information
 */

export interface StageConfig {
  /** Stage enum value */
  value: ProjectStage;

  /** Display label */
  label: string;

  /** Short description */
  description: string;

  /** Icon component */
  icon: LucideIcon;

  /** Color configuration from design tokens */
  colors: {
    background: string;
    text: string;
    border: string;
    className: string;
  };
}

/**
 * Project Stage Progression
 * Ordered array of all stages from idea to scaling
 */
export const STAGE_PROGRESSION: readonly StageConfig[] = [
  {
    value: "idea",
    label: "Idea",
    description: "Initial concept",
    icon: Lightbulb,
    colors: STAGE_COLORS.idea,
  },
  {
    value: "research",
    label: "Research",
    description: "Validating assumptions",
    icon: Search,
    colors: STAGE_COLORS.research,
  },
  {
    value: "planning",
    label: "Planning",
    description: "Defining scope",
    icon: ClipboardList,
    colors: STAGE_COLORS.planning,
  },
  {
    value: "building",
    label: "Building",
    description: "Active development",
    icon: Building,
    colors: STAGE_COLORS.building,
  },
  {
    value: "testing",
    label: "Testing",
    description: "User feedback",
    icon: CheckCircle,
    colors: STAGE_COLORS.testing,
  },
  {
    value: "launching",
    label: "Launching",
    description: "Going live",
    icon: Rocket,
    colors: STAGE_COLORS.launching,
  },
  {
    value: "scaling",
    label: "Scaling",
    description: "Growth phase",
    icon: TrendingUp,
    colors: STAGE_COLORS.scaling,
  },
] as const;

/**
 * Stage lookup map for O(1) access
 */
export const STAGE_MAP = Object.fromEntries(
  STAGE_PROGRESSION.map((stage) => [stage.value, stage]),
) as Record<ProjectStage, StageConfig>;

/**
 * Gets the configuration for a specific stage
 * @param stage - The project stage
 * @returns Stage configuration object
 */
export function getStageConfig(stage: ProjectStage): StageConfig {
  return STAGE_MAP[stage];
}

/**
 * Gets the index of a stage in the progression
 * @param stage - The project stage
 * @returns Zero-based index, or -1 if not found
 */
export function getStageIndex(stage: ProjectStage): number {
  return STAGE_PROGRESSION.findIndex((s) => s.value === stage);
}

/**
 * Gets the next stage in the progression
 * @param currentStage - The current stage
 * @returns Next stage, or undefined if at the end
 */
export function getNextStage(
  currentStage: ProjectStage,
): ProjectStage | undefined {
  const currentIndex = getStageIndex(currentStage);
  if (currentIndex === -1 || currentIndex === STAGE_PROGRESSION.length - 1) {
    return undefined;
  }
  return STAGE_PROGRESSION[currentIndex + 1]?.value;
}

/**
 * Gets the previous stage in the progression
 * @param currentStage - The current stage
 * @returns Previous stage, or undefined if at the beginning
 */
export function getPreviousStage(
  currentStage: ProjectStage,
): ProjectStage | undefined {
  const currentIndex = getStageIndex(currentStage);
  if (currentIndex <= 0) {
    return undefined;
  }
  return STAGE_PROGRESSION[currentIndex - 1]?.value;
}

/**
 * Checks if a stage comes before another in the progression
 * @param stage1 - First stage
 * @param stage2 - Second stage
 * @returns True if stage1 comes before stage2
 */
export function isStageBefore(
  stage1: ProjectStage,
  stage2: ProjectStage,
): boolean {
  return getStageIndex(stage1) < getStageIndex(stage2);
}

/**
 * Checks if a stage comes after another in the progression
 * @param stage1 - First stage
 * @param stage2 - Second stage
 * @returns True if stage1 comes after stage2
 */
export function isStageAfter(
  stage1: ProjectStage,
  stage2: ProjectStage,
): boolean {
  return getStageIndex(stage1) > getStageIndex(stage2);
}

/**
 * Gets all stages that come before a given stage
 * @param stage - The stage to compare against
 * @returns Array of previous stages
 */
export function getCompletedStages(
  stage: ProjectStage,
): readonly StageConfig[] {
  const index = getStageIndex(stage);
  return STAGE_PROGRESSION.slice(0, index);
}

/**
 * Gets all stages that come after a given stage
 * @param stage - The stage to compare against
 * @returns Array of remaining stages
 */
export function getRemainingStages(
  stage: ProjectStage,
): readonly StageConfig[] {
  const index = getStageIndex(stage);
  return STAGE_PROGRESSION.slice(index + 1);
}

/**
 * Calculates progress percentage based on current stage
 * @param stage - The current stage
 * @returns Progress percentage (0-100)
 */
export function getStageProgress(stage: ProjectStage): number {
  const index = getStageIndex(stage);
  if (index === -1) {return 0;}
  return Math.round(((index + 1) / STAGE_PROGRESSION.length) * 100);
}

/**
 * Default stage for new projects
 */
export const DEFAULT_STAGE: ProjectStage = "idea";

/**
 * All valid project stages as an array of values
 */
export const ALL_STAGES = STAGE_PROGRESSION.map((s) => s.value);
