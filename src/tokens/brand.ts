/**
 * Buffalo Projects Brand Tokens
 *
 * Official Buffalo Projects brand colors and identity tokens.
 * Use these for brand-consistent marketing materials, presentations, and documentation.
 *
 * @example
 * import { BUFFALO_BRAND } from '@/tokens/brand';
 *
 * // Use Buffalo blue for primary brand elements
 * <button style={{ backgroundColor: BUFFALO_BRAND.blue.primary }}>
 *   Buffalo Projects CTA
 * </button>
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUFFALO PROJECTS BRAND COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BUFFALO_BRAND = {
  /**
   * Buffalo Blue - Primary Brand Color
   * Use this for all primary brand touchpoints, CTAs, and interactive elements
   */
  blue: {
    primary: "#0070f3", // Main Buffalo blue
    hover: "#0061d5", // Hover state
    active: "#004fb7", // Active/pressed state
    light: "#4096ff", // Light variant for accents
    dark: "#003d99", // Dark variant for depth
    subtle: "rgba(0, 112, 243, 0.1)", // Subtle background tint
  },

  /**
   * Buffalo Dark - Background System
   * Professional dark theme for all Buffalo Projects interfaces
   */
  dark: {
    canvas: "#000000", // Pure black - page background
    surface: "#0a0a0a", // Elevated surfaces, cards
    elevated: "#111111", // Raised elements
    hover: "#1a1a1a", // Interactive hover states
  },

  /**
   * Buffalo Text - Typography Colors
   * Hierarchy for all text content
   */
  text: {
    primary: "#ffffff", // Main headlines and content
    secondary: "#a3a3a3", // Supporting text
    tertiary: "#737373", // De-emphasized content
    inverse: "#000000", // Text on light backgrounds
  },

  /**
   * Buffalo Borders - Separation & Structure
   * Subtle borders for professional aesthetic
   */
  border: {
    default: "rgba(255, 255, 255, 0.08)", // Subtle separation
    hover: "rgba(255, 255, 255, 0.12)", // Interactive hover
    strong: "rgba(255, 255, 255, 0.2)", // Emphasized borders
    blue: "#0070f3", // Buffalo blue accent borders
  },

  /**
   * Buffalo Status - Semantic Colors
   * Consistent messaging across the platform
   */
  status: {
    success: "#22c55e", // Success states
    warning: "#f59e0b", // Warning states
    error: "#ef4444", // Error states
    info: "#3b82f6", // Info states
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BRAND USAGE GUIDELINES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Buffalo Projects Brand Guidelines
 *
 * PRIMARY BRAND COLOR:
 * - Buffalo Blue (#0070f3) is our signature color
 * - Use for all primary CTAs, links, and interactive elements
 * - Maintain sufficient contrast (minimum 4.5:1 ratio)
 *
 * DARK THEME:
 * - Always use pure black (#000000) as the canvas
 * - Layer elevated surfaces (#0a0a0a, #111111) for depth
 * - Keep borders subtle (8% white opacity)
 *
 * TEXT HIERARCHY:
 * - Primary text: #ffffff (100% white)
 * - Secondary text: #a3a3a3 (64% opacity)
 * - Tertiary text: #737373 (45% opacity)
 *
 * ACCESSIBILITY:
 * - All text meets WCAG AA standards (4.5:1 contrast)
 * - Focus states always use Buffalo blue (#0070f3)
 * - Interactive elements minimum 44px touch target
 *
 * DO NOT:
 * - Mix Buffalo blue with other brand blues
 * - Use light backgrounds (maintain dark theme consistency)
 * - Override focus states with non-brand colors
 */
export const BRAND_GUIDELINES = {
  name: "Buffalo Projects",
  primaryColor: BUFFALO_BRAND.blue.primary,
  theme: "dark",
  typography: "Geist Sans",
  contrast: "WCAG AA minimum (4.5:1)",
  accessibility: "WCAG 2.1 Level AA compliant",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONVENIENCE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Quick access to Buffalo blue
 * @example
 * <button style={{ backgroundColor: BUFFALO_BLUE }}>Click</button>
 */
export const BUFFALO_BLUE = BUFFALO_BRAND.blue.primary;

/**
 * Quick access to Buffalo dark canvas
 * @example
 * <div style={{ backgroundColor: BUFFALO_DARK }}>Content</div>
 */
export const BUFFALO_DARK = BUFFALO_BRAND.dark.canvas;

/**
 * Quick access to Buffalo text colors
 */
export const BUFFALO_TEXT = BUFFALO_BRAND.text;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type BuffaloBrand = typeof BUFFALO_BRAND;
export type BuffaloBlue = keyof typeof BUFFALO_BRAND.blue;
export type BuffaloDark = keyof typeof BUFFALO_BRAND.dark;
export type BuffaloText = keyof typeof BUFFALO_BRAND.text;
export type BuffaloBorder = keyof typeof BUFFALO_BRAND.border;
export type BuffaloStatus = keyof typeof BUFFALO_BRAND.status;
