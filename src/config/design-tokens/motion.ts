/**
 * Motion Design Tokens
 * Animation durations, easing curves, and transition presets
 * Based on Vercel's smooth, purposeful motion design
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DURATION (Based on Distance Traveled)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const duration = {
  instant: "0ms", // Instant feedback (no animation)
  fast: "150ms", // Micro-interactions (hover, focus)
  base: "250ms", // Default transitions (most UI changes)
  slow: "400ms", // Complex animations (modals, drawers)
  slower: "600ms", // Page transitions
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING (Natural Motion Curves)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const easing = {
  // Elements entering the screen (accelerate out)
  out: "cubic-bezier(0, 0, 0.2, 1)", // ease-out

  // Elements exiting the screen (decelerate in)
  in: "cubic-bezier(0.4, 0, 1, 1)", // ease-in

  // Elements moving on screen (smooth both ways)
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out

  // Playful interactions (slight overshoot)
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",

  // Precise movements (Material Design)
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSITION PRESETS (Common Animation Patterns)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const transitions = {
  // Fade in/out
  fade: {
    duration: duration.fast,
    easing: easing.out,
    properties: "opacity",
  },

  // Scale (buttons, cards)
  scale: {
    duration: "200ms",
    easing: easing.spring,
    properties: "transform",
  },

  // Slide (modals, drawers)
  slide: {
    duration: duration.base,
    easing: easing.inOut,
    properties: "transform",
  },

  // Color changes (theme, hover states)
  color: {
    duration: duration.fast,
    easing: easing.out,
    properties: "background-color, border-color, color",
  },

  // All properties (default)
  all: {
    duration: duration.base,
    easing: easing.out,
    properties: "all",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FRAMER MOTION VARIANTS (For React Components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const variants = {
  // Fade in with slight upward movement
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
  },

  // Scale in (buttons, cards)
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
  },

  // Slide up (modals, dialogs)
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },

  // Slide in from right (sheets, sidebars)
  slideInRight: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  // Stagger children (lists)
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },

  // Stagger child item
  staggerItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRING CONFIGURATIONS (Framer Motion Springs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const spring = {
  // Gentle spring (default)
  default: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },

  // Bouncy spring (playful)
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 20,
  },

  // Stiff spring (precise)
  stiff: {
    type: "spring",
    stiffness: 500,
    damping: 40,
  },

  // Slow spring (smooth)
  slow: {
    type: "spring",
    stiffness: 200,
    damping: 25,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Generate a CSS transition string
 * @example
 * transition('opacity', 'fast', 'out') // "opacity 150ms cubic-bezier(0, 0, 0.2, 1)"
 */
export function transition(
  property: string | string[],
  speed: keyof typeof duration = "base",
  curve: keyof typeof easing = "out",
): string {
  const props = Array.isArray(property) ? property.join(", ") : property;
  return `${props} ${duration[speed]} ${easing[curve]}`;
}

/**
 * Generate multiple transitions
 * @example
 * transitions(['opacity', 'transform']) // "opacity 250ms ease-out, transform 250ms ease-out"
 */
export function multipleTransitions(
  properties: string[],
  speed: keyof typeof duration = "base",
  curve: keyof typeof easing = "out",
): string {
  return properties
    .map((prop) => `${prop} ${duration[speed]} ${easing[curve]}`)
    .join(", ");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAILWIND EFFECT CLASSES (For direct use in components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const effects = {
  // Shadow utilities
  shadow: {
    sm: "shadow-sm",
    default: "shadow-lg shadow-black/50",
    lg: "shadow-xl shadow-black/50",
    xl: "shadow-2xl shadow-black/50",
    glow: {
      blue: "shadow-lg shadow-primary/25",
      purple: "shadow-lg shadow-accent/25",
      green: "shadow-lg shadow-success/25",
    },
  },

  // Blur utilities
  blur: {
    backdrop: "backdrop-blur-xl",
    subtle: "backdrop-blur-sm",
  },

  // Hover effects
  hover: {
    lift: "hover:-translate-y-1",
    scale: "hover:scale-105 active:scale-95",
    glow: "hover:shadow-xl",
  },

  // Transition utilities
  transition: {
    default: "transition-all duration-200 ease-out",
    slow: "transition-all duration-300 ease-out",
    bounce: "transition-all duration-200",
  },
} as const;

// Type exports
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type TransitionPreset = keyof typeof transitions;
export type MotionVariant = keyof typeof variants;
export type SpringConfig = keyof typeof spring;
