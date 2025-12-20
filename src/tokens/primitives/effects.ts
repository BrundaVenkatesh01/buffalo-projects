/**
 * Primitive Effect Tokens
 *
 * Shadows, border radius, opacity, and other visual effects
 * DO NOT use directly - reference through semantic tokens
 *
 * @see semantic/surfaces.ts for component-specific effect mappings
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER RADIUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px", // Perfect circles
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOX SHADOWS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BOX_SHADOW = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
  DEFAULT: "0 2px 8px 0 rgba(0, 0, 0, 0.25)",
  md: "0 4px 12px 0 rgba(0, 0, 0, 0.25)",
  lg: "0 8px 24px 0 rgba(0, 0, 0, 0.3)",
  xl: "0 16px 48px 0 rgba(0, 0, 0, 0.35)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
  // Special shadows
  glow: "0 8px 24px rgba(0, 0, 0, 0.3)",
  soft: "0 4px 12px rgba(0, 0, 0, 0.25)",
  // Colored shadows (for Vercel-style effects)
  "glow-blue": "0 8px 24px rgba(37, 99, 235, 0.3)",
  "glow-purple": "0 8px 24px rgba(124, 58, 237, 0.3)",
  "glow-green": "0 8px 24px rgba(34, 197, 94, 0.3)",
  "glow-red": "0 8px 24px rgba(239, 68, 68, 0.3)",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OPACITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const OPACITY = {
  0: "0",
  5: "0.05",
  10: "0.1",
  15: "0.15",
  20: "0.2",
  25: "0.25",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  75: "0.75",
  80: "0.8",
  90: "0.9",
  95: "0.95",
  100: "1",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLUR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BLUR = {
  none: "0",
  sm: "4px",
  DEFAULT: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "40px",
  "3xl": "64px",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER WIDTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BORDER_WIDTH = {
  0: "0",
  DEFAULT: "1px",
  2: "2px",
  4: "4px",
  8: "8px",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Z-INDEX SCALE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const Z_INDEX = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: "auto",
  // Named layers
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  "modal-backdrop": 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BACKDROP BLUR (for glass effects)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BACKDROP_BLUR = {
  none: "blur(0)",
  sm: "blur(4px)",
  DEFAULT: "blur(8px)",
  md: "blur(12px)",
  lg: "blur(16px)",
  xl: "blur(24px)",
  "2xl": "blur(40px)",
  "3xl": "blur(64px)",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type BorderRadius = keyof typeof BORDER_RADIUS;
export type BoxShadow = keyof typeof BOX_SHADOW;
export type Opacity = keyof typeof OPACITY;
export type Blur = keyof typeof BLUR;
export type BorderWidth = keyof typeof BORDER_WIDTH;
export type ZIndex = keyof typeof Z_INDEX;
export type BackdropBlur = keyof typeof BACKDROP_BLUR;
