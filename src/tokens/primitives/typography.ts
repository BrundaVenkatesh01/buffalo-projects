/**
 * Primitive Typography Tokens
 *
 * Font families, sizes, weights, line heights, and letter spacing
 * DO NOT use directly in components - use semantic tokens instead
 *
 * @see semantic/typography.ts for component-specific typography mappings
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT FAMILIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FONT_FAMILIES = {
  sans: [
    "var(--font-geist-sans)",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  mono: [
    "var(--font-geist-mono)",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
  display: [
    "var(--font-geist-sans)",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT SIZES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FONT_SIZES = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px - base size
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
  "8xl": "6rem", // 96px
  "9xl": "8rem", // 128px
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT WEIGHTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FONT_WEIGHTS = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LINE HEIGHTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LINE_HEIGHTS = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
  // Numbered variants (matching Tailwind)
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LETTER SPACING (Tracking)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LETTER_SPACING = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
  // Special case for labels
  label: "0.24em", // Extra wide for uppercase labels
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT SIZE + LINE HEIGHT COMBINATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Pre-configured font size and line height pairs
 * Following Tailwind's convention: [fontSize, { lineHeight }]
 */
export const FONT_SIZE_PAIRS = {
  xs: ["0.75rem", { lineHeight: "1rem" }], // 12px/16px
  sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px/20px
  base: ["1rem", { lineHeight: "1.5rem" }], // 16px/24px
  lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px/28px
  xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px/28px
  "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px/32px
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px/36px
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px/40px
  "5xl": ["3rem", { lineHeight: "1" }], // 48px/48px
  "6xl": ["3.75rem", { lineHeight: "1" }], // 60px/60px
  "7xl": ["4.5rem", { lineHeight: "1" }], // 72px/72px
  "8xl": ["6rem", { lineHeight: "1" }], // 96px/96px
  "9xl": ["8rem", { lineHeight: "1" }], // 128px/128px
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type FontFamily = keyof typeof FONT_FAMILIES;
export type FontSize = keyof typeof FONT_SIZES;
export type FontWeight = keyof typeof FONT_WEIGHTS;
export type LineHeight = keyof typeof LINE_HEIGHTS;
export type LetterSpacing = keyof typeof LETTER_SPACING;
export type FontSizePair = keyof typeof FONT_SIZE_PAIRS;
