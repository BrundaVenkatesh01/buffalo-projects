/**
 * Design Tokens - Central Export
 * Complete design system tokens for Buffalo Projects
 *
 * Usage:
 *   import { colors, motion, spacing, typography } from '@/config/design-tokens';
 *   import { transition } from '@/config/design-tokens';
 *   import { button, card, input } from '@/config/design-tokens';
 */

export * from "./colors";
export * from "./motion";
export * from "./spacing";
export * from "./typography";
export * from "./components";

// Re-export for convenience
export { colors, gradients } from "./colors";
export {
  duration,
  easing,
  transitions,
  variants,
  spring,
  effects,
  transition,
  multipleTransitions,
} from "./motion";
export {
  spacing,
  radius,
  container,
  zIndex,
  component as spacingComponent,
  componentRadius,
} from "./spacing";
export {
  fontFamily,
  fontSize,
  fontWeight,
  semanticType,
  typographyClasses,
  font,
} from "./typography";
export { button, card, input } from "./components";

/**
 * Common token combinations for quick access
 */
export const tokens = {
  // Quick access to frequently used values
  colors: {
    bg: {
      primary: "hsl(var(--background))",
      elevated: "hsl(var(--elevation-3))",
    },
    text: {
      primary: "hsl(var(--foreground))",
      muted: "hsl(var(--muted-foreground))",
    },
    brand: {
      primary: "hsl(var(--primary))",
      hover: "hsl(var(--primary-hover))",
    },
  },

  // Common transitions
  transition: {
    fast: "all 150ms cubic-bezier(0, 0, 0.2, 1)",
    base: "all 250ms cubic-bezier(0, 0, 0.2, 1)",
    slow: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Common shadows
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
    base: "0 2px 8px 0 rgba(0, 0, 0, 0.25)",
    lg: "0 8px 24px 0 rgba(0, 0, 0, 0.3)",
  },
} as const;

export default tokens;
