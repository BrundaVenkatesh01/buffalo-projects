/**
 * Buffalo Projects Design Tokens
 *
 * Official design token system for Buffalo Projects brand identity.
 * Features Buffalo blue (#0070f3) as the primary brand color.
 *
 * A comprehensive design token system following industry best practices.
 *
 * ## Architecture
 *
 * This token system follows a two-tier architecture:
 *
 * 1. **Primitive Tokens** (tokens/primitives/*)
 *    - Raw values (colors, spacing, typography)
 *    - DO NOT use these directly in components
 *    - Foundation for semantic tokens
 *
 * 2. **Semantic Tokens** (tokens/semantic/*)
 *    - Context-aware mappings of primitives
 *    - USE THESE in your components
 *    - Maps primitives to specific use cases (buttons, cards, text, etc.)
 *
 * ## Usage
 *
 * @example
 * // ✅ CORRECT - Use semantic tokens
 * import { BACKGROUND, TEXT, BUTTON } from '@/tokens';
 *
 * function MyComponent() {
 *   return (
 *     <div style={{ backgroundColor: BACKGROUND.surface.base }}>
 *       <p style={{ color: TEXT.primary }}>Hello</p>
 *       <button style={{ backgroundColor: BUTTON.primary.background.default }}>
 *         Click me
 *       </button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // ❌ WRONG - Don't use primitives directly
 * import { COLOR_PRIMITIVES } from '@/tokens/primitives';
 *
 * function BadComponent() {
 *   return <div style={{ color: COLOR_PRIMITIVES.blue[600] }}>Bad</div>;
 * }
 *
 * ## With Tailwind/CSS-in-JS
 *
 * For Tailwind CSS, tokens are automatically mapped to CSS variables in globals.css.
 * For CSS-in-JS solutions, import tokens and use them directly.
 *
 * ## Benefits
 *
 * - **Consistency**: Reusable values across the entire application
 * - **Maintainability**: Change once, update everywhere
 * - **Theming**: Easy to create variants and themes
 * - **Type Safety**: Full TypeScript support
 * - **Accessibility**: Designed with WCAG guidelines in mind
 *
 * @see https://style-dictionary.web.app/ for design token standards
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUFFALO BRAND TOKENS (Quick brand access)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  BUFFALO_BRAND,
  BUFFALO_BLUE,
  BUFFALO_DARK,
  BUFFALO_TEXT,
  BRAND_GUIDELINES,
  type BuffaloBrand,
  type BuffaloBlue,
  type BuffaloDark,
  type BuffaloText,
  type BuffaloBorder,
  type BuffaloStatus,
} from "./brand";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEMANTIC TOKENS (USE THESE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  // Colors
  BACKGROUND,
  TEXT,
  BORDER,
  ICON,
  OVERLAY,
  type BackgroundColor,
  type TextColor,
  type BorderColor,
  type IconColor,
  type OverlayColor,

  // Typography
  FONT_FAMILY,
  DISPLAY,
  HEADING,
  BODY,
  LABEL,
  CODE,
  UTILITY,
  type DisplaySize,
  type HeadingSize,
  type BodySize,
  type LabelSize,
  type CodeSize,

  // Components
  BUTTON,
  CARD,
  INPUT,
  BADGE,
  DIALOG,
  TOOLTIP,
  type ButtonVariant,
  type ButtonSize,
  type CardVariant,
  type InputSize,
  type BadgeVariant,
} from "./semantic";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRIMITIVES (Advanced use only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  // Colors
  COLOR_PRIMITIVES,

  // Spacing
  SPACING_PRIMITIVES,
  SPACING_SCALE,

  // Typography
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACING,
  FONT_SIZE_PAIRS,

  // Effects
  BORDER_RADIUS,
  BOX_SHADOW,
  OPACITY,
  BLUR,
  BORDER_WIDTH,
  Z_INDEX,
  BACKDROP_BLUR,

  // Motion
  DURATION,
  EASING,
  TRANSITION,
  DELAY,
  KEYFRAMES,
} from "./primitives";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Get a token value by path
 * Useful for dynamic token access
 *
 * @example
 * getToken(BACKGROUND, 'surface.base') // Returns '#0a0a0a'
 */
export function getToken<TResult = unknown>(
  tokenObject: Record<string, unknown>,
  path: string,
): TResult | undefined {
  return path.split(".").reduce<unknown>((obj, key) => {
    if (!isRecord(obj)) {
      return undefined;
    }
    return obj[key];
  }, tokenObject) as TResult | undefined;
}

/**
 * Create CSS variables from token object
 * Useful for generating CSS custom properties
 *
 * @example
 * toCSSVariables(BACKGROUND, 'bg') // Returns { '--bg-canvas': '#000000', ... }
 */
export function toCSSVariables(
  tokenObject: Record<string, unknown>,
  prefix: string = "",
): Record<string, string> {
  const result: Record<string, string> = {};

  function traverse(obj: Record<string, unknown>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];

      if (isRecord(value)) {
        traverse(value, currentPath);
      } else {
        const varName = `--${prefix}${prefix ? "-" : ""}${currentPath.join("-")}`;
        result[varName] = String(value);
      }
    }
  }

  traverse(tokenObject);
  return result;
}
