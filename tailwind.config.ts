import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "border-hover": "hsl(var(--border-hover))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Elevation colors - Vercel-style layering
        "elevation-1": "hsl(var(--elevation-1))",
        "elevation-2": "hsl(var(--elevation-2))",
        "elevation-3": "hsl(var(--elevation-3))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Vercel-style subtle shadows
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        DEFAULT: "0 2px 8px 0 rgba(0, 0, 0, 0.25)",
        md: "0 4px 12px 0 rgba(0, 0, 0, 0.25)",
        lg: "0 8px 24px 0 rgba(0, 0, 0, 0.3)",
        xl: "0 16px 48px 0 rgba(0, 0, 0, 0.35)",
        // Legacy support
        glow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        soft: "0 4px 12px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
        // Semantic radius (NEW - component-specific)
        button: "var(--radius-button)",
        card: "var(--radius-card)",
        input: "var(--radius-input)",
        badge: "var(--radius-badge)",
        dialog: "var(--radius-dialog)",
        sheet: "var(--radius-sheet)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(31,95,255,0.35), transparent 60%), radial-gradient(circle at center, rgba(31,95,255,0.15), transparent 55%)",
        frost:
          "linear-gradient(135deg, rgba(20,28,40,0.9), rgba(13,16,23,0.7))",
        "gradient-radial":
          "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;
