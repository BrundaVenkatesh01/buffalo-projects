// Buffalo Projects - Vercel-Inspired Dark Theme
// Sophisticated blues with elegant contrast

export const theme = {
  colors: {
    // Background layers - Vercel inspired hierarchy
    background: {
      primary: "#0a0a0a", // Deep black base
      secondary: "#111111", // Cards, elevated surfaces
      tertiary: "#1a1a1a", // Hover states, borders
      overlay: "#0a0a0a99", // Modal backgrounds
    },

    // Buffalo Blue System - Professional & Sophisticated
    buffalo: {
      50: "#eff6ff", // Light accents (rare use)
      100: "#dbeafe", // Subtle highlights
      200: "#bfdbfe", // Disabled states
      300: "#93c5fd", // Secondary elements
      400: "#60a5fa", // Interactive elements
      500: "#3b82f6", // Primary brand blue
      600: "#2563eb", // Primary hover
      700: "#1d4ed8", // Active states
      800: "#1e40af", // Deep blue accents
      900: "#1e3a8a", // Darkest blue
      950: "#172554", // Near-black blue
    },

    // Text hierarchy - Vercel's sophisticated contrast
    text: {
      primary: "#ffffff", // Headings, primary content
      secondary: "#a1a1aa", // Subheadings, descriptions
      tertiary: "#71717a", // Labels, meta information
      inverse: "#0a0a0a", // Text on light backgrounds
      accent: "#3b82f6", // Links, interactive text
    },

    // Borders & Dividers - Subtle but defined
    border: {
      primary: "#27272a", // Main borders
      secondary: "#18181b", // Subtle dividers
      accent: "#3b82f6", // Focus, active borders
      error: "#ef4444", // Error states
      success: "#22c55e", // Success states
    },

    // Status colors - Consistent with dark theme
    status: {
      success: {
        background: "#064e3b",
        border: "#059669",
        text: "#34d399",
      },
      warning: {
        background: "#92400e",
        border: "#d97706",
        text: "#fbbf24",
      },
      error: {
        background: "#7f1d1d",
        border: "#dc2626",
        text: "#fca5a5",
      },
      info: {
        background: "#1e3a8a",
        border: "#3b82f6",
        text: "#93c5fd",
      },
    },

    // Workspace-specific colors
    workspace: {
      canvas: "#111111", // BMC background
      block: "#1a1a1a", // Individual BMC blocks
      blockHover: "#262626", // BMC block hover
      accent: "#3b82f6", // Interactive elements
    },
  },

  // Typography - Vercel's refined scale
  typography: {
    fonts: {
      // Use Geist via CSS vars provided in app/layout.tsx
      // Falls back to system if variables are missing
      sans: [
        "var(--font-geist-sans)",
        "system-ui",
        "-apple-system",
        "sans-serif",
      ],
      mono: [
        "var(--font-geist-mono)",
        "Menlo",
        "Monaco",
        "Consolas",
        "monospace",
      ],
    },

    scale: {
      xs: "0.75rem", // 12px - small labels
      sm: "0.875rem", // 14px - body text
      base: "1rem", // 16px - default
      lg: "1.125rem", // 18px - large body
      xl: "1.25rem", // 20px - small headings
      "2xl": "1.5rem", // 24px - headings
      "3xl": "1.875rem", // 30px - large headings
      "4xl": "2.25rem", // 36px - display
      "5xl": "3rem", // 48px - hero
    },

    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Spacing - Vercel's 8pt grid system
  spacing: {
    px: "1px",
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },

  // Border radius - Modern, subtle curves
  radii: {
    none: "0",
    sm: "0.125rem", // 2px
    default: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px", // Perfect circles
  },

  // Shadows - Vercel's elegant depth
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.2)",
    default: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.2)",
    glow: "0 0 20px rgb(59 130 246 / 0.3)", // Buffalo blue glow
  },

  // Animation durations & easings
  animation: {
    durations: {
      fast: "150ms",
      normal: "250ms",
      slow: "350ms",
      slower: "500ms",
    },

    easings: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },

  // Breakpoints - Mobile-first responsive
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeTypography = typeof theme.typography;
