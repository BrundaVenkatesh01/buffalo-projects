/**
 * Component Design Tokens
 * Tailwind class patterns for common components
 * Based on OpenAI/Vercel aesthetic patterns
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUTTON TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const button = {
  // Base button styles (shared across all variants)
  base: [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg font-semibold",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),

  // Size variants
  size: {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-base",
    xl: "h-16 px-10 text-lg",
  },

  // Style variants
  variant: {
    primary: [
      "bg-primary text-primary-foreground",
      "shadow-lg shadow-primary/25",
      "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
    ].join(" "),
    secondary: [
      "bg-white/10 text-white",
      "border border-white/10",
      "hover:bg-white/15 hover:border-white/20",
    ].join(" "),
    ghost: [
      "text-muted-foreground",
      "hover:text-foreground hover:bg-muted",
    ].join(" "),
    outline: [
      "border border-border text-foreground",
      "hover:bg-muted hover:border-border",
    ].join(" "),
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const card = {
  // Base card styles
  base: [
    "relative overflow-hidden",
    "rounded-xl border border-border",
    "bg-card backdrop-blur-xl",
    "transition-all",
  ].join(" "),

  // Hover state
  hover: [
    "hover:-translate-y-1",
    "hover:shadow-xl hover:shadow-primary/10",
  ].join(" "),

  // Interactive (clickable) state
  interactive: "cursor-pointer",

  // Gradient overlay effect
  gradient: [
    "before:absolute before:inset-0",
    "before:bg-gradient-to-br before:from-primary/10 before:via-transparent before:to-accent/5",
    "before:opacity-0 hover:before:opacity-100",
    "before:transition-opacity",
  ].join(" "),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const input = {
  // Base input styles
  base: [
    "w-full rounded-lg",
    "border border-input bg-background",
    "px-4 text-base text-foreground",
    "placeholder:text-muted-foreground",
    "backdrop-blur-xl transition-all",
    "focus:bg-background focus:border-primary/50",
    "focus:ring-2 focus:ring-primary/10 focus:outline-none",
    "disabled:opacity-50",
  ].join(" "),

  // Size variants
  size: {
    sm: "h-10 text-sm",
    md: "h-12",
    lg: "h-14",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type ButtonSize = keyof typeof button.size;
export type ButtonVariant = keyof typeof button.variant;
export type InputSize = keyof typeof input.size;
