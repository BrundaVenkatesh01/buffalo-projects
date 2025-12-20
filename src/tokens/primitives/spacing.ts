/**
 * Primitive Spacing Tokens
 *
 * Based on an 8px grid system (4px base unit)
 * Use these for consistent spacing throughout the application
 *
 * @see semantic/layout.ts for component-specific spacing mappings
 */

export const SPACING_PRIMITIVES = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PIXEL VALUES (for rare cases requiring exact values)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  px: {
    1: "1px",
    2: "2px",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REM SCALE (8px grid: 0.25rem base unit = 4px)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  rem: {
    0: "0rem", // 0px
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px - base unit
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px - 1x grid
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px - 2x grid
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px - 3x grid
    7: "1.75rem", // 28px
    8: "2rem", // 32px - 4x grid
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px - 5x grid
    11: "2.75rem", // 44px
    12: "3rem", // 48px - 6x grid
    14: "3.5rem", // 56px - 7x grid
    16: "4rem", // 64px - 8x grid
    20: "5rem", // 80px - 10x grid
    24: "6rem", // 96px - 12x grid
    28: "7rem", // 112px - 14x grid
    32: "8rem", // 128px - 16x grid
    36: "9rem", // 144px - 18x grid
    40: "10rem", // 160px - 20x grid
    44: "11rem", // 176px - 22x grid
    48: "12rem", // 192px - 24x grid
    52: "13rem", // 208px - 26x grid
    56: "14rem", // 224px - 28x grid
    60: "15rem", // 240px - 30x grid
    64: "16rem", // 256px - 32x grid
    72: "18rem", // 288px - 36x grid
    80: "20rem", // 320px - 40x grid
    96: "24rem", // 384px - 48x grid
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPACING CONSTANTS (numeric scale for Tailwind)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Numeric spacing scale aligned with Tailwind
 * Maps to the rem scale above
 */
export const SPACING_SCALE = {
  0: 0, // 0px
  0.5: 0.5, // 2px
  1: 1, // 4px
  1.5: 1.5, // 6px
  2: 2, // 8px
  2.5: 2.5, // 10px
  3: 3, // 12px
  3.5: 3.5, // 14px
  4: 4, // 16px
  5: 5, // 20px
  6: 6, // 24px
  7: 7, // 28px
  8: 8, // 32px
  9: 9, // 36px
  10: 10, // 40px
  11: 11, // 44px
  12: 12, // 48px
  14: 14, // 56px
  16: 16, // 64px
  20: 20, // 80px
  24: 24, // 96px
  28: 28, // 112px
  32: 32, // 128px
  36: 36, // 144px
  40: 40, // 160px
  44: 44, // 176px
  48: 48, // 192px
  52: 52, // 208px
  56: 56, // 224px
  60: 60, // 240px
  64: 64, // 256px
  72: 72, // 288px
  80: 80, // 320px
  96: 96, // 384px
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SpacingPrimitives = typeof SPACING_PRIMITIVES;
export type SpacingScale = keyof typeof SPACING_SCALE;
export type SpacingValue = (typeof SPACING_PRIMITIVES.rem)[SpacingScale];
