/**
 * Semantic Typography Tokens
 *
 * Maps primitive typography to specific text styles and use cases.
 * USE THESE in components for consistent typography.
 *
 * @see primitives/typography.ts for raw typography values
 */

import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACING,
} from "../primitives/typography";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT FAMILY SEMANTIC MAPPING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FONT_FAMILY = {
  body: FONT_FAMILIES.sans.join(", "),
  heading: FONT_FAMILIES.display.join(", "),
  code: FONT_FAMILIES.mono.join(", "),
  ui: FONT_FAMILIES.sans.join(", "),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DISPLAY TEXT (Hero sections, major headings)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DISPLAY = {
  "2xl": {
    fontSize: FONT_SIZES["6xl"],
    lineHeight: LINE_HEIGHTS.none,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.tighter,
  },
  xl: {
    fontSize: FONT_SIZES["5xl"],
    lineHeight: LINE_HEIGHTS.none,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.tighter,
  },
  lg: {
    fontSize: FONT_SIZES["4xl"],
    lineHeight: LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.tight,
  },
  md: {
    fontSize: FONT_SIZES["3xl"],
    lineHeight: LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.tight,
  },
  sm: {
    fontSize: FONT_SIZES["2xl"],
    lineHeight: LINE_HEIGHTS.snug,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.tight,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HEADINGS (Section titles, subsections)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const HEADING = {
  "2xl": {
    fontSize: FONT_SIZES["2xl"],
    lineHeight: LINE_HEIGHTS[8],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.tight,
  },
  xl: {
    fontSize: FONT_SIZES.xl,
    lineHeight: LINE_HEIGHTS[7],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.tight,
  },
  lg: {
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS[7],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.normal,
  },
  md: {
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS[6],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.normal,
  },
  sm: {
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS[5],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.normal,
  },
  xs: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[4],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.normal,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BODY TEXT (Main content)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BODY = {
  xl: {
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS[7],
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  lg: {
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS[7],
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  md: {
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS[6],
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  sm: {
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS[6],
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  xs: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[5],
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LABELS (Form labels, metadata)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LABEL = {
  lg: {
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS[5],
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.normal,
  },
  md: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[4],
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.normal,
  },
  sm: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[3],
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.wide,
  },
  uppercase: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[4],
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.label,
    textTransform: "uppercase" as const,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CODE (Inline code, code blocks)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CODE = {
  lg: {
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS[6],
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: FONT_FAMILY.code,
  },
  md: {
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS[5],
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: FONT_FAMILY.code,
  },
  sm: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[4],
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: FONT_FAMILY.code,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const UTILITY = {
  // Numbers (for metrics, counts)
  number: {
    fontSize: FONT_SIZES["4xl"],
    lineHeight: LINE_HEIGHTS.none,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.tight,
  },

  // Captions (image captions, footnotes)
  caption: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[4],
    fontWeight: FONT_WEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Overline (small labels above content)
  overline: {
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS[4],
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: LETTER_SPACING.wider,
    textTransform: "uppercase" as const,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DisplaySize = keyof typeof DISPLAY;
export type HeadingSize = keyof typeof HEADING;
export type BodySize = keyof typeof BODY;
export type LabelSize = keyof typeof LABEL;
export type CodeSize = keyof typeof CODE;
