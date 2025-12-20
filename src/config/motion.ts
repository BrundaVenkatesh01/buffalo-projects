/**
 * Motion System - Comprehensive animation tokens and configurations
 * Provides consistent, purposeful motion across Buffalo Projects
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DURATION TOKENS (in milliseconds)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const DURATION = {
  instant: 0,
  fast: 150, // Quick feedback (hover, press)
  base: 250, // Standard transitions (opacity, color)
  slow: 350, // Deliberate movements (slides, scales)
  slower: 500, // Content transitions (tab switches)
  slowest: 700, // Page transitions, complex animations
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING FUNCTIONS (cubic-bezier values)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const EASING = {
  // Standard CSS easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom easings for specific effects
  spring: [0.34, 1.56, 0.64, 1], // Bouncy spring (buttons, success states)
  anticipate: [0.68, -0.55, 0.265, 1.55], // Pull back before forward (dramatic reveals)
  smooth: [0.45, 0, 0.55, 1], // Smooth acceleration/deceleration (content transitions)
  sharp: [0.4, 0, 0.6, 1], // Quick ease (dropdown menus, tooltips)

  // Platform-specific
  ios: [0.4, 0, 0.2, 1], // iOS-style smooth ease
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRING PHYSICS PRESETS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SPRING = {
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 0.5,
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STAGGER DELAYS (for sequential animations)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const STAGGER = {
  fast: 0.05, // 50ms between items (quick lists)
  base: 0.1, // 100ms between items (standard lists)
  slow: 0.15, // 150ms between items (dramatic reveals)
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DISTANCE VALUES (for slides, translates)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const DISTANCE = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMMON MOTION RECIPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const RECIPES = {
  // Button interactions
  buttonPress: {
    whileTap: { scale: 0.95 },
    transition: { duration: DURATION.fast / 1000 },
  },

  buttonHover: {
    whileHover: { scale: 1.02 },
    transition: { duration: DURATION.fast / 1000 },
  },

  // Card interactions
  cardHover: {
    whileHover: {
      y: -4,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    },
    transition: { duration: DURATION.base / 1000, ease: EASING.easeOut },
  },

  // Content transitions
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.base / 1000 },
  },

  slideUp: {
    initial: { opacity: 0, y: DISTANCE.lg },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -DISTANCE.lg },
    transition: {
      duration: DURATION.slow / 1000,
      ease: EASING.smooth,
    },
  },

  slideDown: {
    initial: { opacity: 0, y: -DISTANCE.lg },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: DISTANCE.lg },
    transition: {
      duration: DURATION.slow / 1000,
      ease: EASING.smooth,
    },
  },

  slideLeft: {
    initial: { opacity: 0, x: DISTANCE.xl },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -DISTANCE.xl },
    transition: {
      duration: DURATION.slow / 1000,
      ease: EASING.smooth,
    },
  },

  slideRight: {
    initial: { opacity: 0, x: -DISTANCE.xl },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: DISTANCE.xl },
    transition: {
      duration: DURATION.slow / 1000,
      ease: EASING.smooth,
    },
  },

  // Scale transitions
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      duration: DURATION.base / 1000,
      ease: EASING.smooth,
    },
  },

  scaleSpring: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: SPRING.bouncy,
  },

  // Modal/Dialog
  modalEntrance: {
    initial: { opacity: 0, scale: 0.95, y: DISTANCE.lg },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: DISTANCE.lg },
    transition: {
      duration: DURATION.slow / 1000,
      ease: EASING.smooth,
    },
  },

  // Dropdown/Popover
  dropdownMenu: {
    initial: { opacity: 0, y: -DISTANCE.md, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -DISTANCE.md, scale: 0.95 },
    transition: {
      duration: DURATION.fast / 1000,
      ease: EASING.sharp,
    },
  },

  // Toast notification
  toastNotification: {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: DURATION.base / 1000 },
    },
    transition: SPRING.bouncy,
  },

  // Success states
  completionCheck: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: SPRING.bouncy,
  },

  // Tab switching
  tabSwitch: {
    initial: { opacity: 0, x: -DISTANCE.md },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: DISTANCE.md },
    transition: {
      duration: DURATION.base / 1000,
      ease: EASING.smooth,
    },
  },

  // Loading states
  loadingSpinner: {
    animate: { rotate: 360 },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },

  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACCESSIBILITY HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get transition with reduced motion fallback
 */
import type { Transition, Variants } from "framer-motion";

export function getTransition(
  defaultTransition: Transition,
  reducedMotion: Transition = { duration: 0 },
): Transition {
  return prefersReducedMotion() ? reducedMotion : defaultTransition;
}

/**
 * Conditional animation variants based on reduced motion preference
 */
export function getVariants(
  animated: Variants,
  instant: Variants = {
    initial: {},
    animate: {},
    exit: {},
  },
): Variants {
  return prefersReducedMotion() ? instant : animated;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT COMBINED CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const MOTION = {
  duration: DURATION,
  easing: EASING,
  spring: SPRING,
  stagger: STAGGER,
  distance: DISTANCE,
  recipes: RECIPES,
  prefersReducedMotion,
  getTransition,
  getVariants,
} as const;
