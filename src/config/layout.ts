/**
 * Layout System - Universal spacing, alignment, and responsive utilities
 * Ensures consistent spacing and alignment across all platforms and screen sizes
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPACING SCALE (8px base unit - matches design-system.ts)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SPACING = {
  // Micro spacing (components)
  0: "0",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px - Base unit
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px

  // Macro spacing (layouts)
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEMANTIC SPACING (Use these names for consistency)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SEMANTIC = {
  // Component internal spacing
  componentPaddingXs: SPACING[2], // 8px - Button, Badge
  componentPaddingSm: SPACING[3], // 12px - Input, Card padding
  componentPaddingMd: SPACING[4], // 16px - Card, Dialog
  componentPaddingLg: SPACING[6], // 24px - Modal, Panel
  componentPaddingXl: SPACING[8], // 32px - Hero sections

  // Gap between elements
  gapXs: SPACING[1], // 4px - Icon + text
  gapSm: SPACING[2], // 8px - Button group, chips
  gapMd: SPACING[4], // 16px - Form fields, cards in list
  gapLg: SPACING[6], // 24px - Sections within page
  gapXl: SPACING[8], // 32px - Major page sections

  // Vertical rhythm
  stackXs: SPACING[2], // 8px - Tight vertical spacing
  stackSm: SPACING[4], // 16px - Form fields
  stackMd: SPACING[6], // 24px - Content blocks
  stackLg: SPACING[8], // 32px - Page sections
  stackXl: SPACING[12], // 48px - Major sections

  // Container padding (responsive)
  containerPaddingMobile: SPACING[4], // 16px
  containerPaddingTablet: SPACING[6], // 24px
  containerPaddingDesktop: SPACING[8], // 32px
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BREAKPOINTS (Mobile-first approach)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const BREAKPOINTS = {
  xs: 0, // 0px - Mobile (base)
  sm: 640, // 640px - Large mobile
  md: 768, // 768px - Tablet
  lg: 1024, // 1024px - Desktop
  xl: 1280, // 1280px - Large desktop
  "2xl": 1536, // 1536px - Extra large desktop
} as const;

export const BREAKPOINT_QUERIES = {
  xs: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `@media (min-width: ${BREAKPOINTS["2xl"]}px)`,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTAINER WIDTHS (Max width for content)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const CONTAINER = {
  xs: "100%", // Full width on mobile
  sm: "640px", // Small container
  md: "768px", // Medium container
  lg: "1024px", // Large container
  xl: "1280px", // Extra large container
  "2xl": "1400px", // Maximum width (readable content)
  full: "100%", // Full width
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GRID SYSTEM (12-column grid)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const GRID = {
  columns: 12,
  gutter: SPACING[6], // 24px default gutter
  gutterMobile: SPACING[4], // 16px on mobile
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ALIGNMENT UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const FLEX = {
  // Flex direction
  row: { flexDirection: "row" as const },
  rowReverse: { flexDirection: "row-reverse" as const },
  col: { flexDirection: "column" as const },
  colReverse: { flexDirection: "column-reverse" as const },

  // Justify content (main axis)
  justifyStart: { justifyContent: "flex-start" as const },
  justifyEnd: { justifyContent: "flex-end" as const },
  justifyCenter: { justifyContent: "center" as const },
  justifyBetween: { justifyContent: "space-between" as const },
  justifyAround: { justifyContent: "space-around" as const },
  justifyEvenly: { justifyContent: "space-evenly" as const },

  // Align items (cross axis)
  itemsStart: { alignItems: "flex-start" as const },
  itemsEnd: { alignItems: "flex-end" as const },
  itemsCenter: { alignItems: "center" as const },
  itemsBaseline: { alignItems: "baseline" as const },
  itemsStretch: { alignItems: "stretch" as const },

  // Align content (multi-line)
  contentStart: { alignContent: "flex-start" as const },
  contentEnd: { alignContent: "flex-end" as const },
  contentCenter: { alignContent: "center" as const },
  contentBetween: { alignContent: "space-between" as const },
  contentAround: { alignContent: "space-around" as const },
  contentStretch: { alignContent: "stretch" as const },

  // Wrapping
  wrap: { flexWrap: "wrap" as const },
  wrapReverse: { flexWrap: "wrap-reverse" as const },
  nowrap: { flexWrap: "nowrap" as const },

  // Common combinations
  center: {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  centerCol: {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  between: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  betweenStart: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STACK UTILITIES (Vertical spacing between children)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const STACK = {
  xs: `> * + * { margin-top: ${SEMANTIC.stackXs}; }`,
  sm: `> * + * { margin-top: ${SEMANTIC.stackSm}; }`,
  md: `> * + * { margin-top: ${SEMANTIC.stackMd}; }`,
  lg: `> * + * { margin-top: ${SEMANTIC.stackLg}; }`,
  xl: `> * + * { margin-top: ${SEMANTIC.stackXl}; }`,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESPONSIVE PADDING UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function responsivePadding(
  mobile: keyof typeof SPACING,
  tablet?: keyof typeof SPACING,
  desktop?: keyof typeof SPACING,
) {
  return {
    padding: SPACING[mobile],
    ...(tablet && {
      [BREAKPOINT_QUERIES.md]: {
        padding: SPACING[tablet],
      },
    }),
    ...(desktop && {
      [BREAKPOINT_QUERIES.lg]: {
        padding: SPACING[desktop],
      },
    }),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SAFE AREA UTILITIES (For mobile notches, iOS, etc.)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SAFE_AREA = {
  top: "env(safe-area-inset-top)",
  right: "env(safe-area-inset-right)",
  bottom: "env(safe-area-inset-bottom)",
  left: "env(safe-area-inset-left)",
} as const;

import type { CSSProperties } from "react";

export function safeAreaPadding(
  fallback: keyof typeof SPACING = 4,
): CSSProperties {
  return {
    paddingTop: `max(${SPACING[fallback]}, ${SAFE_AREA.top})`,
    paddingRight: `max(${SPACING[fallback]}, ${SAFE_AREA.right})`,
    paddingBottom: `max(${SPACING[fallback]}, ${SAFE_AREA.bottom})`,
    paddingLeft: `max(${SPACING[fallback]}, ${SAFE_AREA.left})`,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAILWIND CLASS GENERATORS (For className usage)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const cn = {
  // Container classes
  container: "mx-auto w-full",
  containerSm: "mx-auto w-full max-w-2xl",
  containerMd: "mx-auto w-full max-w-3xl",
  containerLg: "mx-auto w-full max-w-6xl",
  containerXl: "mx-auto w-full max-w-7xl",

  // Padding classes (responsive)
  containerPadding: "px-4 sm:px-6 lg:px-8",
  sectionPadding: "py-12 sm:py-16 lg:py-20",

  // Stack classes
  stackXs: "space-y-2",
  stackSm: "space-y-4",
  stackMd: "space-y-6",
  stackLg: "space-y-8",
  stackXl: "space-y-12",

  // Flex utilities
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",
  flexEnd: "flex items-center justify-end",
  flexCol: "flex flex-col",
  flexColCenter: "flex flex-col items-center justify-center",

  // Grid classes
  gridCols2: "grid grid-cols-1 md:grid-cols-2",
  gridCols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gridCols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",

  // Gap classes
  gapXs: "gap-1",
  gapSm: "gap-2",
  gapMd: "gap-4",
  gapLg: "gap-6",
  gapXl: "gap-8",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIEWPORT UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const VIEWPORT = {
  minHeight: {
    screen: "100vh",
    screenSafe:
      "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
    dvh: "100dvh", // Dynamic viewport height (mobile address bars)
  },
  height: {
    header: "64px",
    headerMobile: "56px",
    footer: "80px",
    footerMobile: "64px",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT COMBINED LAYOUT CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const LAYOUT = {
  spacing: SPACING,
  semantic: SEMANTIC,
  breakpoints: BREAKPOINTS,
  queries: BREAKPOINT_QUERIES,
  container: CONTAINER,
  grid: GRID,
  flex: FLEX,
  stack: STACK,
  safeArea: SAFE_AREA,
  viewport: VIEWPORT,
  cn,
  responsivePadding,
  safeAreaPadding,
} as const;

export default LAYOUT;
