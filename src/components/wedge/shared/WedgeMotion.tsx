/**
 * Wedge Motion - Shared animation variants for wedge components
 *
 * Provides consistent enter/exit/hover animations across all wedge UI.
 */

import type { Variants } from "framer-motion";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING CURVES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const WEDGE_EASING = {
  /** Standard ease-out for enter animations */
  out: [0.4, 0, 0.2, 1],
  /** Standard ease-in for exit animations */
  in: [0.4, 0, 1, 1],
  /** Spring-like bounce for emphasis */
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD VARIANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Base card animation variants */
export const wedgeCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: WEDGE_EASING.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: WEDGE_EASING.in,
    },
  },
};

/** Hover animation for cards */
export const wedgeCardHover = {
  y: -2,
  transition: {
    duration: 0.15,
    ease: WEDGE_EASING.out,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PULSE VARIANTS (for high priority)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Pulsing border animation for high-priority prompts */
export const wedgePulseVariants: Variants = {
  idle: {
    boxShadow: "0 0 0 0 rgba(0, 112, 243, 0)",
  },
  pulse: {
    boxShadow: [
      "0 0 0 0 rgba(0, 112, 243, 0.4)",
      "0 0 0 8px rgba(0, 112, 243, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BADGE/INDICATOR VARIANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Badge pop-in animation */
export const wedgeBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: WEDGE_EASING.bounce,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
      ease: WEDGE_EASING.in,
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIST/STAGGER VARIANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Container for staggered children */
export const wedgeListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Individual item in a staggered list */
export const wedgeListItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: WEDGE_EASING.out,
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON VARIANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Subtle icon rotation for attention */
export const wedgeIconVariants: Variants = {
  idle: { rotate: 0 },
  attention: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROGRESS VARIANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Progress bar fill animation */
export const wedgeProgressVariants: Variants = {
  hidden: { width: 0 },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: WEDGE_EASING.out,
    },
  }),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSITION PRESETS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Standard transition for most animations */
export const wedgeTransition = {
  duration: 0.3,
  ease: WEDGE_EASING.out,
};

/** Fast transition for micro-interactions */
export const wedgeTransitionFast = {
  duration: 0.15,
  ease: WEDGE_EASING.out,
};

/** Slow transition for emphasis */
export const wedgeTransitionSlow = {
  duration: 0.5,
  ease: WEDGE_EASING.out,
};
