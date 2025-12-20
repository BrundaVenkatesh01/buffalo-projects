/**
 * GSAP Utilities
 * Shared configurations, easing presets, and helper functions for GSAP animations
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animation duration presets (in seconds)
 * Based on design system timing standards
 */
export const DURATIONS = {
  fast: 0.2, // Hover states, quick interactions
  medium: 0.4, // Standard reveals and transitions
  slow: 0.6, // Complex sequences
  ambient: 3, // Background loops (glows, gradients)
} as const;

/**
 * Easing presets
 * Consistent easing functions across all animations
 */
export const EASINGS = {
  default: "power2.out",
  smooth: "power1.inOut",
  bounce: "back.out(1.2)",
  elastic: "elastic.out(1, 0.5)",
  linear: "linear",
  sine: "sine.inOut",
} as const;

/**
 * Check if user prefers reduced motion
 * Returns true if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Create a GSAP context that respects reduced motion
 * If reduced motion is preferred, sets elements to final state without animation
 */
export function createReducedMotionContext(
  scope: gsap.DOMTarget,
  animations: (ctx: gsap.Context) => void,
): gsap.Context | null {
  if (prefersReducedMotion()) {
    // Set all elements to final state immediately
    gsap.set(scope, { clearProps: "all" });
    return null;
  }

  // Guard against null scope to satisfy typings
  return scope ? gsap.context(animations, scope) : gsap.context(animations);
}

/**
 * Fade in animation preset
 */
export function fadeIn(
  target: gsap.DOMTarget,
  options: {
    duration?: number;
    delay?: number;
    y?: number;
    stagger?: number;
    ease?: string;
  } = {},
) {
  const {
    duration = DURATIONS.medium,
    delay = 0,
    y = 20,
    stagger = 0,
    ease = EASINGS.default,
  } = options;

  return gsap.from(target, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease,
  });
}

/**
 * Scale in animation preset
 */
export function scaleIn(
  target: gsap.DOMTarget,
  options: {
    duration?: number;
    delay?: number;
    scale?: number;
    stagger?: number;
    ease?: string;
  } = {},
) {
  const {
    duration = DURATIONS.medium,
    delay = 0,
    scale = 0.9,
    stagger = 0,
    ease = EASINGS.default,
  } = options;

  return gsap.from(target, {
    opacity: 0,
    scale,
    duration,
    delay,
    stagger,
    ease,
  });
}

/**
 * Pulsing glow animation
 * Creates infinite loop of opacity and scale changes
 */
export function pulseGlow(
  target: gsap.DOMTarget,
  options: {
    duration?: number;
    opacityRange?: [number, number];
    scaleRange?: [number, number];
    ease?: string;
  } = {},
) {
  const {
    duration = DURATIONS.ambient,
    opacityRange = [0.2, 0.4],
    scaleRange = [1, 1.1],
    ease = EASINGS.sine,
  } = options;

  return gsap.to(target, {
    opacity: opacityRange[1],
    scale: scaleRange[1],
    duration,
    ease,
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Animated gradient background
 * Shifts background position to create flowing effect
 */
export function flowingGradient(
  target: gsap.DOMTarget,
  options: {
    duration?: number;
    direction?: "horizontal" | "vertical";
  } = {},
) {
  const { duration = 8, direction = "horizontal" } = options;

  const position = direction === "horizontal" ? "200% 0%" : "0% 200%";

  return gsap.to(target, {
    backgroundPosition: position,
    duration,
    ease: EASINGS.linear,
    repeat: -1,
  });
}

/**
 * Magnetic hover effect
 * Element follows cursor with spring physics
 */
export function createMagneticHover(
  element: HTMLElement,
  options: {
    strength?: number;
    speed?: number;
    rotation?: number;
  } = {},
) {
  const { strength = 0.15, speed = 0.4, rotation = 0.03 } = options;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;

    gsap.to(element, {
      x,
      y,
      rotation: x * rotation,
      duration: speed,
      ease: EASINGS.default,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: speed * 1.5,
      ease: EASINGS.smooth,
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}

/**
 * Count-up animation for numbers
 * Animates textContent from 0 to target value
 */
export function countUp(
  target: gsap.DOMTarget,
  options: {
    from?: number;
    to: number;
    duration?: number;
    ease?: string;
    suffix?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  },
) {
  const {
    from = 0,
    to,
    duration = 2,
    ease = EASINGS.smooth,
    suffix = "",
    scrollTrigger,
  } = options;

  const config: gsap.TweenVars = {
    textContent: to,
    duration,
    ease,
    snap: { textContent: 1 },
    onUpdate: () => {
      const elements = gsap.utils.toArray(target);
      const element = elements[0] as HTMLElement | undefined;
      if (!element) {
        return;
      }
      const value = Math.round(parseFloat(element.textContent || "0"));
      element.textContent = value + suffix;
    },
  };

  if (scrollTrigger) {
    config.scrollTrigger = scrollTrigger;
  }

  return gsap.fromTo(target, { textContent: from }, config);
}

/**
 * Create scroll-triggered animation
 * Simplified wrapper for ScrollTrigger
 */
export function scrollTriggerAnimation(
  target: gsap.DOMTarget,
  animation: gsap.TweenVars,
  scrollOptions: Partial<ScrollTrigger.Vars> = {},
) {
  const defaultScrollOptions: ScrollTrigger.Vars = {
    trigger: target,
    start: "top 80%",
    toggleActions: "play none none none",
    ...scrollOptions,
  };

  return gsap.from(target, {
    ...animation,
    scrollTrigger: defaultScrollOptions,
  });
}

/**
 * Staggered reveal animation
 * Animates children in sequence
 */
export function staggerReveal(
  parent: gsap.DOMTarget,
  childrenSelector: string,
  options: {
    duration?: number;
    stagger?: number;
    y?: number;
    ease?: string;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {},
) {
  const {
    duration = DURATIONS.medium,
    stagger = 0.1,
    y = 30,
    ease = EASINGS.default,
    scrollTrigger,
  } = options;

  const config: gsap.TweenVars = {
    opacity: 0,
    y,
  };

  const animConfig: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
  };

  if (scrollTrigger) {
    animConfig.scrollTrigger = {
      trigger: parent,
      start: "top 80%",
      ...scrollTrigger,
    };
  }

  const children =
    typeof parent === "string"
      ? document.querySelectorAll(`${parent} ${childrenSelector}`)
      : (parent as Element).querySelectorAll(childrenSelector);

  return gsap.fromTo(children, config, animConfig);
}

/**
 * Cleanup all ScrollTriggers and kill all GSAP animations
 * Call this in component cleanup/unmount
 */
export function cleanupGSAP() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.globalTimeline.clear();
}
