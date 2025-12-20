/**
 * Design Tokens - Buffalo Projects Design System
 *
 * Centralized design tokens for consistent spacing, typography, and visual hierarchy
 * across the application. Use these instead of arbitrary values.
 *
 * @example
 * import { SPACING, TYPOGRAPHY } from '@/lib/tokens';
 *
 * <div className={SPACING.section}>
 *   <h1 className={TYPOGRAPHY.display.xl}>Title</h1>
 * </div>
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPACING TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Spacing scale for consistent layout rhythm
 * Use these for gaps, padding, and margins throughout the app
 */
export const SPACING = {
  /** Extra tight spacing (0.5rem / 8px) - for inline elements */
  xs: "gap-2",
  /** Tight spacing (0.75rem / 12px) - for closely related items */
  sm: "gap-3",
  /** Default spacing (1rem / 16px) - for standard item spacing */
  md: "gap-4",
  /** Comfortable spacing (1.5rem / 24px) - for group separation */
  lg: "gap-6",
  /** Section spacing (2rem / 32px) - for major section separation */
  xl: "gap-8",
  /** Large section spacing (3rem / 48px) - for major content blocks */
  "2xl": "gap-12",
  /** Extra large spacing (4rem / 64px) - for page-level separation */
  "3xl": "gap-16",
} as const;

/**
 * Padding scale for container/component internal spacing
 */
export const PADDING = {
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
  "3xl": "p-16",
} as const;

/**
 * Padding variants for specific use cases
 */
export const PADDING_X = {
  xs: "px-2",
  sm: "px-3",
  md: "px-4",
  lg: "px-6",
  xl: "px-8",
} as const;

export const PADDING_Y = {
  xs: "py-2",
  sm: "py-3",
  md: "py-4",
  lg: "py-6",
  xl: "py-8",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPOGRAPHY TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Typography scale for consistent text hierarchy
 */
export const TYPOGRAPHY = {
  /** Display text - for hero sections and major headings */
  display: {
    xl: "font-display text-4xl sm:text-5xl text-foreground",
    lg: "font-display text-3xl sm:text-4xl text-foreground",
    md: "font-display text-2xl sm:text-3xl text-foreground",
    sm: "font-display text-xl sm:text-2xl text-foreground",
  },
  /** Headings - for section and subsection titles */
  heading: {
    xl: "text-2xl font-semibold text-foreground",
    lg: "text-xl font-semibold text-foreground",
    md: "text-lg font-semibold text-foreground",
    sm: "text-base font-semibold text-foreground",
    xs: "text-sm font-semibold text-foreground",
  },
  /** Body text - for content */
  body: {
    lg: "text-base leading-7 text-foreground",
    md: "text-sm leading-6 text-foreground",
    sm: "text-xs leading-5 text-foreground",
  },
  /** Muted text - for secondary information */
  muted: {
    lg: "text-base leading-7 text-muted-foreground",
    md: "text-sm leading-6 text-muted-foreground",
    sm: "text-xs leading-5 text-muted-foreground",
  },
  /** Labels - for form labels and metadata */
  label: {
    default: "text-xs uppercase tracking-[0.24em] text-muted-foreground/70",
    emphasized: "text-xs uppercase tracking-[0.24em] text-foreground",
  },
  /** Code - for technical content */
  code: {
    inline: "font-mono text-sm bg-white/10 px-1.5 py-0.5 rounded",
    block: "font-mono text-sm bg-white/5 p-4 rounded-lg",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER RADIUS TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Border radius scale for consistent roundedness
 */
export const RADIUS = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  full: "rounded-full",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHADOW TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Shadow scale for elevation hierarchy
 */
export const SHADOW = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  soft: "shadow-soft",
  glow: "shadow-glow",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Border styles for consistent visual separation
 */
export const BORDER = {
  default: "border border-white/10",
  emphasized: "border border-white/20",
  subtle: "border border-white/5",
  primary: "border border-primary/40",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BACKGROUND TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Background styles for cards and surfaces
 */
export const BACKGROUND = {
  base: "bg-[#0b0d0f]",
  elevated: "bg-white/5",
  interactive: "bg-white/3 hover:bg-white/5",
  primary: "bg-primary/15",
  gradient: "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSITION TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Transition presets for consistent animations
 */
export const TRANSITION = {
  fast: "transition-all duration-150 ease-out",
  default: "transition-all duration-200 ease-out",
  slow: "transition-all duration-300 ease-out",
  colors: "transition-colors duration-200",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAYOUT TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Layout widths and constraints
 */
export const LAYOUT = {
  sidebar: {
    expanded: "w-72",
    collapsed: "w-16",
  },
  container: {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
  },
  panel: {
    context: "w-72 lg:w-80",
    main: "flex-1 min-w-0",
    aside: "w-80 lg:w-96",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Commonly used combinations for specific patterns
 */
export const PATTERNS = {
  /** Standard card pattern */
  card: `${RADIUS.lg} ${BORDER.default} ${BACKGROUND.elevated} ${PADDING.lg}`,
  /** Interactive card pattern */
  cardInteractive: `${RADIUS.lg} ${BORDER.default} ${BACKGROUND.interactive} ${PADDING.lg} ${TRANSITION.default} cursor-pointer`,
  /** Glass effect pattern */
  glass: `${RADIUS.lg} ${BORDER.default} bg-white/5 backdrop-blur-xl`,
  /** Section container pattern */
  section: `${SPACING.xl}`,
} as const;

/**
 * Type exports for TypeScript support
 */
export type SpacingToken = keyof typeof SPACING;
export type PaddingToken = keyof typeof PADDING;
export type TypographyToken =
  | keyof typeof TYPOGRAPHY.display
  | keyof typeof TYPOGRAPHY.heading
  | keyof typeof TYPOGRAPHY.body;
export type RadiusToken = keyof typeof RADIUS;
export type ShadowToken = keyof typeof SHADOW;
