/**
 * Primitive Motion Tokens
 *
 * Animation durations, easing functions, and timing
 * Vercel/OpenAI inspired - subtle, purposeful motion
 *
 * @see semantic/interactions.ts for component-specific motion mappings
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DURATION = {
  instant: "0ms",
  fastest: "75ms",
  faster: "100ms",
  fast: "150ms",
  DEFAULT: "200ms",
  normal: "250ms",
  slow: "300ms",
  slower: "400ms",
  slowest: "500ms",
  // Named durations for specific use cases
  tooltip: "100ms",
  dropdown: "150ms",
  modal: "200ms",
  page: "300ms",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EASING = {
  // Standard easings
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",

  // Enhanced easings (more personality)
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",

  // Vercel-style easings (subtle, refined)
  vercel: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",

  // Bounce/spring effects
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",

  // Special effects
  anticipate: "cubic-bezier(0.36, 0, 0.66, -0.56)",
  overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSITION PRESETS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Complete transition definitions
 * Format: "property duration easing"
 */
export const TRANSITION = {
  // All properties
  all: {
    fast: `all ${DURATION.fast} ${EASING.out}`,
    DEFAULT: `all ${DURATION.DEFAULT} ${EASING.out}`,
    slow: `all ${DURATION.slow} ${EASING.out}`,
  },

  // Colors
  colors: {
    fast: `color ${DURATION.fast} ${EASING.out}, background-color ${DURATION.fast} ${EASING.out}, border-color ${DURATION.fast} ${EASING.out}`,
    DEFAULT: `color ${DURATION.DEFAULT} ${EASING.out}, background-color ${DURATION.DEFAULT} ${EASING.out}, border-color ${DURATION.DEFAULT} ${EASING.out}`,
    slow: `color ${DURATION.slow} ${EASING.out}, background-color ${DURATION.slow} ${EASING.out}, border-color ${DURATION.slow} ${EASING.out}`,
  },

  // Opacity
  opacity: {
    fast: `opacity ${DURATION.fast} ${EASING.out}`,
    DEFAULT: `opacity ${DURATION.DEFAULT} ${EASING.out}`,
    slow: `opacity ${DURATION.slow} ${EASING.out}`,
  },

  // Transform
  transform: {
    fast: `transform ${DURATION.fast} ${EASING.out}`,
    DEFAULT: `transform ${DURATION.DEFAULT} ${EASING.out}`,
    slow: `transform ${DURATION.slow} ${EASING.out}`,
    bounce: `transform ${DURATION.DEFAULT} ${EASING.bounce}`,
  },

  // Shadow
  shadow: {
    fast: `box-shadow ${DURATION.fast} ${EASING.out}`,
    DEFAULT: `box-shadow ${DURATION.DEFAULT} ${EASING.out}`,
    slow: `box-shadow ${DURATION.slow} ${EASING.out}`,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATION DELAYS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DELAY = {
  0: "0ms",
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1000: "1000ms",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KEYFRAME DEFINITIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Named keyframe animations
 * Use these with CSS @keyframes
 */
export const KEYFRAMES = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Slide animations
  slideInUp: {
    from: { transform: "translateY(8px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  slideInDown: {
    from: { transform: "translateY(-8px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  slideInLeft: {
    from: { transform: "translateX(-8px)", opacity: 0 },
    to: { transform: "translateX(0)", opacity: 1 },
  },
  slideInRight: {
    from: { transform: "translateX(8px)", opacity: 0 },
    to: { transform: "translateX(0)", opacity: 1 },
  },

  // Scale animations
  scaleIn: {
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
  scaleOut: {
    from: { transform: "scale(1)", opacity: 1 },
    to: { transform: "scale(0.95)", opacity: 0 },
  },

  // Accordion
  accordionDown: {
    from: { height: 0 },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  accordionUp: {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: 0 },
  },

  // Spin
  spin: {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },

  // Pulse
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },

  // Bounce
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
    },
    "50%": {
      transform: "translateY(0)",
      animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type Duration = keyof typeof DURATION;
export type Easing = keyof typeof EASING;
export type TransitionSpeed = "fast" | "DEFAULT" | "slow";
export type Delay = keyof typeof DELAY;
export type KeyframeName = keyof typeof KEYFRAMES;
