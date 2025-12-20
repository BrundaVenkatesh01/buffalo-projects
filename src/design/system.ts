/**
 * Buffalo Projects - Flawless Design System
 * A modern, scalable design system built for perfection
 */

export const design = {
  // ============= COLOR PALETTE =============
  colors: {
    // Primary - Deep Blue Gradient
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    // Accent - Electric Purple
    accent: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7", // Main
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },

    // Neutral - True Grays
    neutral: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b",
      1000: "#000000",
    },

    // Semantic
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // ============= TYPOGRAPHY =============
  font: {
    family: {
      sans: "Inter, system-ui, -apple-system, sans-serif",
      mono: "JetBrains Mono, Menlo, monospace",
      display: "Inter, system-ui, sans-serif",
    },
    size: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
    },
    weight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    leading: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    tracking: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // ============= SPACING =============
  space: {
    px: "1px",
    0: "0",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  // ============= BORDER RADIUS =============
  radius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // ============= SHADOWS =============
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    glow: "0 0 20px rgba(59, 130, 246, 0.5)",
  },

  // ============= TRANSITIONS =============
  transition: {
    none: "none",
    all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors:
      "background-color, border-color, color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // ============= ANIMATIONS =============
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite",
    fadeIn: "fadeIn 0.5s ease-out",
    fadeOut: "fadeOut 0.5s ease-out",
    slideUp: "slideUp 0.3s ease-out",
    slideDown: "slideDown 0.3s ease-out",
    scaleIn: "scaleIn 0.2s ease-out",
    scaleOut: "scaleOut 0.2s ease-out",
  },

  // ============= BREAKPOINTS =============
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // ============= Z-INDEX =============
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: "auto",
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// ============= COMPONENT CLASSES =============
export const components = {
  // Buttons
  button: {
    base: "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",

    variant: {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-500",
      secondary:
        "bg-neutral-800 text-white hover:bg-neutral-700 active:bg-neutral-900 focus:ring-neutral-500",
      outline:
        "border-2 border-neutral-700 text-white hover:bg-neutral-900 active:bg-neutral-800 focus:ring-neutral-500",
      ghost:
        "text-neutral-400 hover:text-white hover:bg-neutral-900 active:bg-neutral-800 focus:ring-neutral-500",
      danger:
        "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500",
    },

    size: {
      xs: "px-2.5 py-1.5 text-xs",
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
      xl: "px-6 py-3.5 text-xl",
    },
  },

  // Cards
  card: {
    base: "rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden",
    hover:
      "transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50",
    glow: "transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/20",
  },

  // Inputs
  input: {
    base: "block w-full rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",

    size: {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
    },
  },

  // Containers
  container: {
    base: "w-full mx-auto px-4 sm:px-6 lg:px-8",
    max: "max-w-7xl",
    narrow: "max-w-4xl",
    wide: "max-w-screen-2xl",
  },

  // Glass Effect
  glass: {
    light: "bg-white/5 backdrop-blur-md border border-white/10",
    medium: "bg-white/10 backdrop-blur-lg border border-white/20",
    heavy: "bg-white/20 backdrop-blur-xl border border-white/30",
    dark: "bg-black/20 backdrop-blur-md border border-black/10",
  },

  // Gradients
  gradient: {
    primary: "bg-gradient-to-r from-primary-500 to-accent-500",
    dark: "bg-gradient-to-b from-neutral-900 to-black",
    radial:
      "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent",
    mesh: "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-accent-500/10 to-transparent",
  },
};

// ============= UTILITY FUNCTIONS =============
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getColor = (path: string): string => {
  const keys = path.split(".");
  let result: unknown = design.colors;

  for (const key of keys) {
    if (typeof result !== "object" || result === null) {
      return "#000000";
    }

    result = (result as Record<string, unknown>)[key];

    if (result === undefined) {
      return "#000000";
    }
  }

  return typeof result === "string" ? result : "#000000";
};

// ============= ANIMATIONS KEYFRAMES =============
export const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

export default design;
