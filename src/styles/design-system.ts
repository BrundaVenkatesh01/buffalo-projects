// Buffalo Projects Design System
// Official UI/UX Guidelines and Design Tokens

export const designSystem = {
  // Vercel-inspired Colors
  colors: {
    // Background layers (dark theme)
    background: {
      primary: "#000000", // Pure black background
      secondary: "#0a0a0a", // Slightly elevated
      tertiary: "#111111", // Cards, modals
      elevated: "#1a1a1a", // Hover states
    },

    // Border colors
    border: {
      primary: "#262626", // Default borders
      secondary: "#404040", // Hover/focus states
      accent: "#525252", // Interactive elements
    },

    // Text colors
    text: {
      primary: "#ffffff", // Primary text
      secondary: "#a3a3a3", // Secondary text
      tertiary: "#737373", // Muted text
      inverse: "#000000", // Text on light backgrounds
    },

    // Accent colors
    accent: {
      blue: "#0070f3", // Vercel blue
      purple: "#7c3aed", // Purple accent
      green: "#00d924", // Success green
      orange: "#ff6b35", // Warning orange
      red: "#ee0a24", // Error red
      yellow: "#f5a623", // Caution yellow
    },

    // Interactive states
    interactive: {
      primary: "#0070f3",
      "primary-hover": "#0061d5",
      "primary-active": "#004fb7",
      secondary: "#262626",
      "secondary-hover": "#404040",
      "secondary-active": "#525252",
    },

    // Legacy neutral scale for compatibility
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },

    // Gray scale alias for compatibility
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },

    // Semantic colors
    semantic: {
      success: "#00d924",
      warning: "#ff6b35",
      error: "#ee0a24",
      info: "#0070f3",
    },

    // Environment colors
    environment: {
      sunrise: "#f5a623",
      sunset: "#ff6b35",
      ocean: "#0070f3",
      forest: "#00d924",
    },

    // Performance colors
    performance: {
      excellent: "#00d924",
      good: "#f5a623",
      poor: "#ff6b35",
      critical: "#ee0a24",
    },
  },

  // Performance budgets for Core Web Vitals
  performance: {
    metrics: {
      LCP: 2500, // Largest Contentful Paint (ms)
      FCP: 1800, // First Contentful Paint (ms)
      CLS: 0.1, // Cumulative Layout Shift
      FID: 100, // First Input Delay (ms)
      INP: 200, // Interaction to Next Paint (ms)
      TTI: 3800, // Time to Interactive (ms)
      TBT: 200, // Total Blocking Time (ms)
    },
    bundles: {
      main: 200, // KB
      vendor: 300, // KB
      initial: 150, // KB - initial bundle size budget
      total: 500, // KB - total bundle size budget
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ["Geist Sans", "system-ui", "sans-serif"],
      mono: ["Geist Mono", "Consolas", "monospace"],
      display: ["Geist Sans", "system-ui", "sans-serif"],
    },

    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },

    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },

  // Spacing Scale
  spacing: {
    px: "1px",
    0: "0",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },

  // Border Radius
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  // Shadows
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "0 0 #0000",
  },

  // Layout breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index scale
  zIndex: {
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    auto: "auto",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modalBackdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
    toast: "1080",
  },

  // Component specific tokens
  components: {
    // Performance metrics
    performance: {
      excellent: "#00d924",
      good: "#f5a623",
      needs_improvement: "#ff6b35",
      poor: "#ee0a24",
    },
    // Button variants
    button: {
      primary: {
        bg: "bg-gradient-to-r from-primary-600 to-primary-700",
        text: "text-white",
        hover: "hover:from-primary-700 hover:to-primary-800",
        focus: "focus:ring-4 focus:ring-primary-500/20",
        shadow: "shadow-lg shadow-primary-500/25",
      },
      secondary: {
        bg: "bg-neutral-100 border border-neutral-200",
        text: "text-neutral-700",
        hover: "hover:bg-neutral-200 hover:border-neutral-300",
        focus: "focus:ring-4 focus:ring-neutral-500/20",
        shadow: "shadow-sm",
      },
      outline: {
        bg: "bg-transparent border-2 border-primary-500",
        text: "text-primary-600",
        hover: "hover:bg-primary-50 hover:border-primary-600",
        focus: "focus:ring-4 focus:ring-primary-500/20",
        shadow: "shadow-sm",
      },
    },

    // Card variants
    card: {
      default: {
        bg: "bg-white",
        border: "border border-neutral-200",
        shadow: "shadow-sm",
        radius: "rounded-xl",
      },
      elevated: {
        bg: "bg-white",
        border: "border-0",
        shadow: "shadow-lg",
        radius: "rounded-xl",
      },
      glass: {
        bg: "bg-white/10 backdrop-blur-md",
        border: "border border-white/20",
        shadow: "shadow-xl",
        radius: "rounded-xl",
      },
    },

    // Input variants
    input: {
      default: {
        bg: "bg-white",
        border: "border border-neutral-300",
        text: "text-neutral-900",
        placeholder: "placeholder-neutral-500",
        focus:
          "focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20",
        radius: "rounded-lg",
      },
      dark: {
        bg: "bg-neutral-800",
        border: "border border-neutral-600",
        text: "text-white",
        placeholder: "placeholder-neutral-400",
        focus:
          "focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20",
        radius: "rounded-lg",
      },
    },
  },

  // Animation tokens
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      linear: "linear",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

// Utility functions
export const getColor = (colorPath: string): string => {
  const path = colorPath.split(".");
  let current: unknown = designSystem.colors;

  for (const key of path) {
    if (typeof current !== "object" || current === null) {
      return "#000000";
    }

    current = (current as Record<string, unknown>)[key];

    if (current === undefined) {
      return "#000000";
    }
  }

  return typeof current === "string" ? current : "#000000";
};

export const getSpacing = (size: keyof typeof designSystem.spacing) => {
  return designSystem.spacing[size];
};

// Export individual systems for convenience
export const {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  breakpoints,
  zIndex,
  components,
  animation,
} = designSystem;
