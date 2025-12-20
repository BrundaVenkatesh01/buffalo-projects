/**
 * Motion System Configuration
 * Vercel-inspired animation patterns for premium UI feel
 */

// ============================================
// TIMING FUNCTIONS
// ============================================
export const easings = {
  // Base easings - Vercel style
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.6, 0, 0.84, 0],
  easeInOut: [0.45, 0, 0.55, 1],

  // Premium easings
  smooth: [0.43, 0.13, 0.23, 0.96],
  snappy: [0.68, -0.6, 0.32, 1.6],
  elastic: [0.68, -0.55, 0.265, 1.55],

  // Spring configurations
  springGentle: { type: "spring", stiffness: 100, damping: 15 },
  springMedium: { type: "spring", stiffness: 300, damping: 20 },
  springSnappy: { type: "spring", stiffness: 400, damping: 25 },
  springBouncy: { type: "spring", stiffness: 500, damping: 15 },
} as const;

// ============================================
// DURATION SCALE
// ============================================
export const durations = {
  instant: 0.1,
  fast: 0.15,
  quick: 0.2,
  normal: 0.3,
  smooth: 0.4,
  slow: 0.5,
  deliberate: 0.6,
  dramatic: 0.8,
} as const;

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.quick,
      ease: easings.easeIn,
    },
  },
};

// ============================================
// STAGGER ANIMATIONS
// ============================================
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

// ============================================
// CARD ANIMATIONS
// ============================================
export const cardVariants = {
  rest: {
    scale: 1,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: durations.quick,
      ease: easings.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
    transition: {
      duration: durations.instant,
    },
  },
};

// ============================================
// BUTTON ANIMATIONS
// ============================================
export const buttonVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: easings.springMedium,
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: durations.instant,
    },
  },
};

export const magneticButton = {
  rest: { x: 0, y: 0 },
  hover: {
    x: 0,
    y: 0,
    transition: easings.springGentle,
  },
};

// ============================================
// FADE ANIMATIONS
// ============================================
export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

export const fadeInDown = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

// ============================================
// SCALE ANIMATIONS
// ============================================
export const scaleIn = {
  initial: {
    scale: 0.9,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: durations.smooth,
      ease: easings.elastic,
    },
  },
};

export const popIn = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: easings.springBouncy,
  },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================
export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

// ============================================
// REVEAL ANIMATIONS
// ============================================
export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  },
};

// ============================================
// MODAL/OVERLAY ANIMATIONS
// ============================================
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.quick,
    },
  },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: durations.quick,
      ease: easings.easeIn,
    },
  },
};

// ============================================
// HOVER EFFECTS
// ============================================
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: durations.quick,
    ease: easings.easeOut,
  },
};

export const hoverGlow = {
  boxShadow: "0 0 30px rgba(0, 112, 243, 0.3)",
  transition: {
    duration: durations.normal,
  },
};

// ============================================
// TEXT ANIMATIONS
// ============================================
export const textReveal = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: durations.smooth,
      ease: easings.easeOut,
    },
  }),
};

export const typewriter = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 2,
      ease: "linear",
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create custom transition with defaults
 */
export const createTransition = (
  duration = durations.normal,
  ease = easings.easeOut,
  delay = 0,
) => ({
  duration,
  ease,
  delay,
});

/**
 * Create stagger children animation
 */
export const createStagger = (staggerChildren = 0.05, delayChildren = 0) => ({
  staggerChildren,
  delayChildren,
});

/**
 * Viewport detection for scroll animations
 */
export const viewportOptions = {
  once: true,
  margin: "-100px",
  amount: 0.3,
};

// ============================================
// GESTURE ANIMATIONS
// ============================================
export const dragConstraints = {
  top: -10,
  left: -10,
  right: 10,
  bottom: 10,
};

export const dragTransition = {
  bounceStiffness: 600,
  bounceDamping: 20,
};

// ============================================
// REDUCED MOTION
// ============================================
export const reducedMotion = {
  initial: false,
  animate: true,
  transition: { duration: 0 },
};

// Helper to check for reduced motion preference
export const shouldReduceMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
