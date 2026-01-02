/**
 * Typography Design Tokens
 * Font scales, weights, and line heights for consistent text hierarchy
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT FAMILIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const fontFamily = {
  sans: ["Geist Sans", "system-ui", "-apple-system", "sans-serif"],
  mono: ["Geist Mono", "Menlo", "Monaco", "monospace"],
  display: ["Geist Sans", "system-ui", "-apple-system", "sans-serif"],
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT SIZES (With Line Heights and Letter Spacing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const fontSize = {
  xs: {
    size: "0.75rem", // 12px
    lineHeight: "1rem", // 16px
    letterSpacing: "0.02em",
  },
  sm: {
    size: "0.875rem", // 14px
    lineHeight: "1.25rem", // 20px
    letterSpacing: "0.01em",
  },
  base: {
    size: "1rem", // 16px
    lineHeight: "1.5rem", // 24px
    letterSpacing: "0",
  },
  lg: {
    size: "1.125rem", // 18px
    lineHeight: "1.75rem", // 28px
    letterSpacing: "-0.01em",
  },
  xl: {
    size: "1.25rem", // 20px
    lineHeight: "1.75rem", // 28px
    letterSpacing: "-0.01em",
  },
  "2xl": {
    size: "1.5rem", // 24px
    lineHeight: "2rem", // 32px
    letterSpacing: "-0.02em",
  },
  "3xl": {
    size: "1.875rem", // 30px
    lineHeight: "2.25rem", // 36px
    letterSpacing: "-0.02em",
  },
  "4xl": {
    size: "2.25rem", // 36px
    lineHeight: "2.5rem", // 40px
    letterSpacing: "-0.03em",
  },
  "5xl": {
    size: "3rem", // 48px
    lineHeight: "3rem", // 48px
    letterSpacing: "-0.03em",
  },
  "6xl": {
    size: "3.75rem", // 60px
    lineHeight: "1", // Tight
    letterSpacing: "-0.04em",
  },
  "7xl": {
    size: "4.5rem", // 72px
    lineHeight: "1", // Tight
    letterSpacing: "-0.04em",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT WEIGHTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEMANTIC TYPOGRAPHY (Component-Specific)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const semanticType = {
  // Display (Hero sections)
  displayLarge: {
    ...fontSize["7xl"],
    fontWeight: fontWeight.bold,
  },
  displayMedium: {
    ...fontSize["6xl"],
    fontWeight: fontWeight.bold,
  },
  displaySmall: {
    ...fontSize["5xl"],
    fontWeight: fontWeight.bold,
  },

  // Headings
  h1: {
    ...fontSize["4xl"],
    fontWeight: fontWeight.bold,
  },
  h2: {
    ...fontSize["3xl"],
    fontWeight: fontWeight.semibold,
  },
  h3: {
    ...fontSize["2xl"],
    fontWeight: fontWeight.semibold,
  },
  h4: {
    ...fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  h5: {
    ...fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  h6: {
    ...fontSize.base,
    fontWeight: fontWeight.semibold,
  },

  // Body text
  bodyLarge: {
    ...fontSize.lg,
    fontWeight: fontWeight.normal,
  },
  bodyBase: {
    ...fontSize.base,
    fontWeight: fontWeight.normal,
  },
  bodySmall: {
    ...fontSize.sm,
    fontWeight: fontWeight.normal,
  },

  // UI text
  caption: {
    ...fontSize.xs,
    fontWeight: fontWeight.medium,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  overline: {
    size: "0.625rem", // 10px
    lineHeight: "1.4",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    fontWeight: fontWeight.semibold,
  },

  // Code
  code: {
    ...fontSize.sm,
    fontFamily: fontFamily.mono.join(", "),
    fontWeight: fontWeight.medium,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Generate CSS font shorthand
 * @example
 * font('h1') // "700 2.25rem/2.5rem Inter, system-ui, sans-serif"
 */
export function font(variant: keyof typeof semanticType): string {
  const typeface = semanticType[variant];
  return `${typeface.fontWeight || fontWeight.normal} ${typeface.size}/${typeface.lineHeight} ${fontFamily.sans.join(", ")}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAILWIND CLASS PATTERNS (For direct use in components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const typographyClasses = {
  // Hero headlines (landing pages)
  hero: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]",

  // Page headlines
  h1: "text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]",
  h3: "text-2xl md:text-3xl font-semibold tracking-tight",
  h4: "text-xl md:text-2xl font-semibold",

  // Body text
  body: {
    xl: "text-xl md:text-2xl leading-relaxed", // Hero subheadlines
    lg: "text-lg md:text-xl leading-relaxed", // Large body
    md: "text-base leading-relaxed", // Standard body
    sm: "text-sm leading-normal", // Small body
    xs: "text-xs leading-normal", // Captions, labels
  },

  // Special styles
  gradient:
    "bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent",
  mono: "font-mono text-sm", // Code, technical text
} as const;

// Type exports
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type SemanticType = keyof typeof semanticType;
export type TypographyClass = keyof typeof typographyClasses;
