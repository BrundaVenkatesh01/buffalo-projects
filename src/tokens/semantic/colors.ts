/**
 * Buffalo Projects - Semantic Color Tokens
 *
 * Maps primitive colors to specific use cases and contexts.
 * USE THESE in components, not the primitives.
 *
 * Brand Identity: Professional dark theme with Buffalo blue (#0070f3) as primary accent
 *
 * @see primitives/colors.ts for raw color values
 */

import { COLOR_PRIMITIVES } from "../primitives/colors";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BACKGROUND COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BACKGROUND = {
  // Canvas - app background
  canvas: COLOR_PRIMITIVES.neutral[0],

  // Surface layers (elevation hierarchy)
  surface: {
    base: COLOR_PRIMITIVES.neutral[50],
    elevated: COLOR_PRIMITIVES.neutral[100],
    raised: COLOR_PRIMITIVES.neutral[150],
  },

  // Interactive backgrounds
  interactive: {
    default: "rgba(255, 255, 255, 0.03)",
    hover: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.08)",
  },

  // Semantic backgrounds (Buffalo branded)
  primary: {
    default: COLOR_PRIMITIVES.buffalo[500], // Buffalo Projects blue
    hover: COLOR_PRIMITIVES.buffalo[600], // Buffalo blue hover
    active: COLOR_PRIMITIVES.buffalo[700], // Buffalo blue active
    subtle: "rgba(0, 112, 243, 0.1)", // Subtle Buffalo blue
  },

  success: {
    default: COLOR_PRIMITIVES.green[600],
    hover: COLOR_PRIMITIVES.green[700],
    subtle: "rgba(34, 197, 94, 0.1)",
  },

  warning: {
    default: COLOR_PRIMITIVES.amber[500],
    hover: COLOR_PRIMITIVES.amber[600],
    subtle: "rgba(245, 158, 11, 0.1)",
  },

  error: {
    default: COLOR_PRIMITIVES.red[600],
    hover: COLOR_PRIMITIVES.red[700],
    subtle: "rgba(239, 68, 68, 0.1)",
  },

  info: {
    default: COLOR_PRIMITIVES.blue[600],
    hover: COLOR_PRIMITIVES.blue[700],
    subtle: "rgba(37, 99, 235, 0.1)",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TEXT COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TEXT = {
  // Default text hierarchy
  primary: COLOR_PRIMITIVES.neutral[1000],
  secondary: COLOR_PRIMITIVES.neutral[600],
  tertiary: COLOR_PRIMITIVES.neutral[500],
  quaternary: COLOR_PRIMITIVES.neutral[400],
  disabled: COLOR_PRIMITIVES.neutral[400],

  // Inverse text (on dark backgrounds when in light mode, vice versa)
  inverse: COLOR_PRIMITIVES.neutral[0],

  // Semantic text colors
  success: COLOR_PRIMITIVES.green[400],
  warning: COLOR_PRIMITIVES.amber[400],
  error: COLOR_PRIMITIVES.red[400],
  info: COLOR_PRIMITIVES.blue[400],

  // Interactive text (Buffalo branded)
  link: {
    default: COLOR_PRIMITIVES.buffalo[500], // Buffalo blue links
    hover: COLOR_PRIMITIVES.buffalo[600], // Buffalo blue hover
    active: COLOR_PRIMITIVES.buffalo[700], // Buffalo blue active
    visited: COLOR_PRIMITIVES.purple[600], // Visited links
  },

  // On colored backgrounds
  onPrimary: COLOR_PRIMITIVES.neutral[1000],
  onSuccess: COLOR_PRIMITIVES.neutral[1000],
  onWarning: COLOR_PRIMITIVES.neutral[0],
  onError: COLOR_PRIMITIVES.neutral[1000],
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BORDER = {
  // Default borders
  default: COLOR_PRIMITIVES.neutral[200],
  subtle: "rgba(255, 255, 255, 0.08)",
  strong: COLOR_PRIMITIVES.neutral[300],

  // Interactive borders
  interactive: {
    default: COLOR_PRIMITIVES.neutral[200],
    hover: COLOR_PRIMITIVES.neutral[300],
    focus: COLOR_PRIMITIVES.buffalo[500], // Buffalo blue focus
    active: COLOR_PRIMITIVES.buffalo[600], // Buffalo blue active
  },

  // Semantic borders (Buffalo branded)
  primary: COLOR_PRIMITIVES.buffalo[500], // Buffalo blue borders
  success: COLOR_PRIMITIVES.green[600],
  warning: COLOR_PRIMITIVES.amber[500],
  error: COLOR_PRIMITIVES.red[600],
  info: COLOR_PRIMITIVES.blue[600],
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICON = {
  primary: COLOR_PRIMITIVES.neutral[1000],
  secondary: COLOR_PRIMITIVES.neutral[600],
  tertiary: COLOR_PRIMITIVES.neutral[500],
  disabled: COLOR_PRIMITIVES.neutral[400],
  inverse: COLOR_PRIMITIVES.neutral[0],

  // Semantic icons
  success: COLOR_PRIMITIVES.green[500],
  warning: COLOR_PRIMITIVES.amber[500],
  error: COLOR_PRIMITIVES.red[500],
  info: COLOR_PRIMITIVES.blue[500],
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OVERLAY COLORS (for modals, tooltips, etc.)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const OVERLAY = {
  backdrop: "rgba(0, 0, 0, 0.6)",
  light: "rgba(0, 0, 0, 0.4)",
  medium: "rgba(0, 0, 0, 0.6)",
  heavy: "rgba(0, 0, 0, 0.8)",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type BackgroundColor = typeof BACKGROUND;
export type TextColor = typeof TEXT;
export type BorderColor = typeof BORDER;
export type IconColor = typeof ICON;
export type OverlayColor = typeof OVERLAY;
