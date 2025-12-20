/**
 * Color Design Tokens
 * Typed references to CSS variables for autocomplete support
 *
 * Usage:
 *   import { colors } from '@/config/design-tokens/colors';
 *   const bg = colors.background.elevated; // 'hsl(var(--elevation-3))'
 */

export const colors = {
  background: {
    primary: "hsl(var(--background))",
    secondary: "hsl(var(--elevation-1))",
    tertiary: "hsl(var(--elevation-2))",
    elevated: "hsl(var(--elevation-3))",
    card: "hsl(var(--card))",
    popover: "hsl(var(--popover))",
    muted: "hsl(var(--muted))",
  },

  foreground: {
    primary: "hsl(var(--foreground))",
    secondary: "hsl(var(--muted-foreground))",
    muted: "hsl(var(--muted-foreground))",
    card: "hsl(var(--card-foreground))",
    popover: "hsl(var(--popover-foreground))",
  },

  border: {
    default: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
  },

  accent: {
    primary: "hsl(var(--primary))",
    primaryForeground: "hsl(var(--primary-foreground))",
    secondary: "hsl(var(--accent))",
    secondaryForeground: "hsl(var(--accent-foreground))",
    success: "hsl(var(--success))",
    successForeground: "hsl(var(--success-foreground))",
    warning: "hsl(var(--warning))",
    warningForeground: "hsl(var(--warning-foreground))",
    destructive: "hsl(var(--destructive))",
    destructiveForeground: "hsl(var(--destructive-foreground))",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GRADIENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const gradients = {
  primary:
    "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
  blue: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
  purple: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)",
  subtle:
    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
} as const;

export type ColorToken = typeof colors;
export type Gradient = keyof typeof gradients;
