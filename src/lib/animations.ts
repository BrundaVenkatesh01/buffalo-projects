/**
 * Buttery Smooth Animations - OpenAI/Vercel Level Polish
 * Spring physics, easing curves, and micro-interactions
 */

import type { Transition, Variants } from "framer-motion";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRING PHYSICS - Buttery smooth, natural motion
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SPRING = {
  // Ultra smooth - OpenAI's signature feel
  butter: {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  },

  // Snappy but smooth - Vercel feel
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 1,
  },

  // Gentle bounce - Success states
  bounce: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },

  // Quick response - Interactive elements
  quick: {
    type: "spring" as const,
    stiffness: 500,
    damping: 50,
    mass: 1,
  },

  // Slow drift - Background elements
  slow: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING CURVES - Custom bezier curves for silky transitions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EASE = {
  // OpenAI's signature ease
  butter: [0.16, 1, 0.3, 1] as const,

  // Smooth entrance
  in: [0.32, 0, 0.67, 0] as const,

  // Smooth exit
  out: [0.33, 1, 0.68, 1] as const,

  // Balanced in-out
  inOut: [0.65, 0, 0.35, 1] as const,

  // Anticipation (pull back then forward)
  anticipate: [0.68, -0.55, 0.265, 1.55] as const,

  // Overshoot (goes past then settles)
  overshoot: [0.34, 1.56, 0.64, 1] as const,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATION VARIANTS - Reusable motion patterns
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Fade In - Buttery smooth opacity transition
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide Up - OpenAI-style entrance
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

/**
 * Slide Down - Dropdown menus
 */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

/**
 * Scale In - Modals and popovers
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

/**
 * Blur In - Hero sections
 */
export const blurIn: Variants = {
  initial: { opacity: 0, filter: "blur(8px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(8px)" },
};

/**
 * Stagger Children - List animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSITIONS - Pre-configured transition objects
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Buttery smooth transition (OpenAI signature)
 */
export const butterTransition: Transition = {
  ...SPRING.butter,
};

/**
 * Quick and responsive
 */
export const snapTransition: Transition = {
  ...SPRING.snappy,
};

/**
 * Standard duration-based transition
 */
export const smoothTransition: Transition = {
  duration: 0.3,
  ease: EASE.butter,
};

/**
 * Fast interaction feedback
 */
export const quickTransition: Transition = {
  duration: 0.15,
  ease: EASE.out,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOVER ANIMATIONS - Interactive micro-interactions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Lift on hover - Cards, buttons
 */
export const liftHover = {
  whileHover: { y: -2, transition: quickTransition },
  whileTap: { y: 0, scale: 0.98, transition: quickTransition },
};

/**
 * Scale on hover - Icons, small elements
 */
export const scaleHover = {
  whileHover: { scale: 1.05, transition: quickTransition },
  whileTap: { scale: 0.95, transition: quickTransition },
};

/**
 * Glow on hover - CTAs, important actions
 */
export const glowHover = {
  whileHover: {
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    transition: smoothTransition,
  },
};

/**
 * Magnetic hover - Buttons that follow cursor
 */
export const magneticHover = {
  whileHover: { scale: 1.02, transition: SPRING.quick },
  whileTap: { scale: 0.98, transition: SPRING.quick },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOADING ANIMATIONS - Skeleton loaders, spinners
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Pulse - Loading indicator
 */
export const pulse: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Shimmer - Skeleton loader
 */
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Spin - Loading spinner
 */
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS ANIMATIONS - Celebratory micro-interactions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Bounce in - Success checkmark
 */
export const bounceIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: SPRING.bounce,
  },
};

/**
 * Pop - Quick feedback
 */
export const pop: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: SPRING.snappy,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get stagger delay for list items
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05) => ({
  transition: {
    delay: index * baseDelay,
    ...butterTransition,
  },
});

/**
 * Create custom spring with parameters
 */
export const createSpring = (
  stiffness: number,
  damping: number,
  mass = 1,
): Transition => ({
  type: "spring",
  stiffness,
  damping,
  mass,
});

/**
 * Create custom ease transition
 */
export const createEase = (
  duration: number,
  ease: readonly number[],
): Transition => ({
  duration,
  ease: ease as unknown as Transition["ease"],
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRESETS - Common animation combinations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * OpenAI-style page entrance
 */
export const pageEntrance = {
  variants: blurIn,
  transition: butterTransition,
  initial: "initial",
  animate: "animate",
};

/**
 * Card entrance animation
 */
export const cardEntrance = {
  variants: slideUp,
  transition: butterTransition,
  initial: "initial",
  animate: "animate",
  whileInView: "animate",
  viewport: { once: true, margin: "-100px" },
};

/**
 * Button interaction
 */
export const buttonInteraction = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: quickTransition,
};

/**
 * Modal entrance
 */
export const modalEntrance = {
  variants: scaleIn,
  transition: butterTransition,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

/**
 * Dropdown entrance
 */
export const dropdownEntrance = {
  variants: slideDown,
  transition: snapTransition,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT ALL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ANIMATIONS = {
  // Springs
  spring: SPRING,

  // Easings
  ease: EASE,

  // Variants
  variants: {
    fadeIn,
    slideUp,
    slideDown,
    scaleIn,
    blurIn,
    staggerContainer,
    staggerItem,
    pulse,
    shimmer,
    spin,
    bounceIn,
    pop,
  },

  // Transitions
  transition: {
    butter: butterTransition,
    snap: snapTransition,
    smooth: smoothTransition,
    quick: quickTransition,
  },

  // Hover effects
  hover: {
    lift: liftHover,
    scale: scaleHover,
    glow: glowHover,
    magnetic: magneticHover,
  },

  // Presets
  presets: {
    page: pageEntrance,
    card: cardEntrance,
    button: buttonInteraction,
    modal: modalEntrance,
    dropdown: dropdownEntrance,
  },

  // Utils
  utils: {
    getStaggerDelay,
    createSpring,
    createEase,
  },
} as const;
