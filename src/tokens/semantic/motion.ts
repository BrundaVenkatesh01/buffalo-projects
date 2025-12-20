/**
 * Semantic Motion Tokens
 *
 * Component-specific motion mappings
 * Use these for consistent, purposeful animations
 */

import { DELAY, DURATION, EASING, KEYFRAMES, TRANSITION } from "../primitives/motion";

// Re-export primitives for convenience
export { DELAY, DURATION, EASING, KEYFRAMES, TRANSITION };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT-SPECIFIC MOTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Button animations
 */
export const BUTTON_MOTION = {
  hover: {
    transition: TRANSITION.all.fast,
    transform: "translateY(-1px)",
  },
  active: {
    transition: TRANSITION.transform.fast,
    transform: "translateY(0) scale(0.98)",
  },
  loading: {
    spin: `spin ${DURATION.slowest} linear infinite`,
  },
} as const;

/**
 * Card animations
 */
export const CARD_MOTION = {
  hover: {
    transition: TRANSITION.all.DEFAULT,
    transform: "translateY(-2px)",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  enter: {
    animation: `slideInUp ${DURATION.normal} ${EASING.out}`,
  },
} as const;

/**
 * Modal/Dialog animations
 */
export const MODAL_MOTION = {
  backdrop: {
    enter: `fadeIn ${DURATION.modal} ${EASING.out}`,
    exit: `fadeOut ${DURATION.fast} ${EASING.in}`,
  },
  content: {
    enter: `scaleIn ${DURATION.modal} ${EASING.out}`,
    exit: `scaleOut ${DURATION.fast} ${EASING.in}`,
  },
} as const;

/**
 * Dropdown/Menu animations
 */
export const DROPDOWN_MOTION = {
  enter: {
    animation: `slideInUp ${DURATION.dropdown} ${EASING.out}`,
  },
  exit: {
    animation: `fadeOut ${DURATION.faster} ${EASING.in}`,
  },
} as const;

/**
 * Tooltip animations
 */
export const TOOLTIP_MOTION = {
  enter: {
    animation: `fadeIn ${DURATION.tooltip} ${EASING.out}`,
  },
  exit: {
    animation: `fadeOut ${DURATION.fastest} ${EASING.in}`,
  },
} as const;

/**
 * Sidebar/Panel animations
 */
export const SIDEBAR_MOTION = {
  enter: {
    transition: TRANSITION.all.slow,
    transform: "translateX(0)",
  },
  exit: {
    transition: TRANSITION.all.DEFAULT,
    transform: "translateX(-100%)",
  },
} as const;

/**
 * Toast/Notification animations
 */
export const TOAST_MOTION = {
  enter: {
    animation: `slideInRight ${DURATION.normal} ${EASING.out}`,
  },
  exit: {
    animation: `slideInRight ${DURATION.fast} ${EASING.in} reverse`,
  },
} as const;

/**
 * Page transition animations
 */
export const PAGE_MOTION = {
  enter: {
    animation: `fadeIn ${DURATION.page} ${EASING.out}`,
  },
  exit: {
    animation: `fadeOut ${DURATION.fast} ${EASING.in}`,
  },
} as const;

/**
 * Skeleton loading animation
 */
export const SKELETON_MOTION = {
  pulse: `pulse ${DURATION.slowest} ${EASING.inOut} infinite`,
} as const;

/**
 * Stagger delays for list items
 */
export const STAGGER_DELAYS = {
  fast: [0, 50, 100, 150, 200],
  normal: [0, 75, 150, 225, 300],
  slow: [0, 100, 200, 300, 400],
} as const;

/**
 * Get stagger delay for an item index
 */
export function getStaggerDelay(
  index: number,
  speed: "fast" | "normal" | "slow" = "normal",
): number {
  const delays = STAGGER_DELAYS[speed];
  return delays[Math.min(index, delays.length - 1)] ?? 0;
}
