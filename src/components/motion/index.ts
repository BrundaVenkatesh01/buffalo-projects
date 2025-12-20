/**
 * Motion Components - Reusable animation components
 * Provides a consistent, platform-grade animation system across the app
 * Enhanced with comprehensive motion tokens and recipes
 * Optimized with LazyMotion for minimal bundle size (-86%)
 */

// Core motion components
export { LazyMotionProvider } from "./LazyMotionProvider";
export { MotionProvider } from "./MotionProvider";
export { AnimatedPage } from "./AnimatedPage";
export { FadeIn } from "./FadeIn";
export { StaggerContainer, StaggerItem } from "./StaggerContainer";
export { AnimatedCard } from "./AnimatedCard";
export { ScaleIn } from "./ScaleIn";
export { SlideIn } from "./SlideIn";

// Enhanced components
export { ProgressRing, ProgressRingMini } from "./ProgressRing";
export { MorphIcon, IconTransition, CheckmarkMorph } from "./MorphIcon";
export { PulseGlow, PulseBorder, PulseScale, PulseOpacity } from "./PulseGlow";

// OpenAI/Vercel-inspired components
export { PageTransition, SubPageTransition } from "./PageTransition";
export { MagneticButton } from "./MagneticButton";
export { GradientBlur, HeroGradients } from "./GradientBlur";
export { RevealText, RevealHeading } from "./RevealText";
export {
  ScrollReveal,
  ScrollRevealList,
  ScrollRevealItem,
} from "./ScrollReveal";
export { FloatingCard, FloatingElement } from "./FloatingCard";
export { ScrollIndicator } from "./ScrollIndicator";
