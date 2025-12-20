import { cva, type VariantProps } from "class-variance-authority";

/**
 * Vercel/OpenAI-inspired button system
 * Clean, minimal, precise interactions
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium tracking-[-0.01em]",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    // Enhanced icon handling - ensures icons stay inline and properly sized
    "[&_svg]:pointer-events-none",
    "[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:shrink-0",
    "[&_svg]:inline-flex",
    "[&_svg]:items-center",
    "[&_svg]:justify-center",
    "relative",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary - Vercel's signature blue
        primary: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover hover:shadow-[0_4px_12px_rgba(0,123,255,0.3)]",
          "active:opacity-90",
        ].join(" "),

        // Secondary - Subtle borders like Vercel
        secondary: [
          "border border-white/[0.12] bg-transparent text-foreground",
          "hover:bg-white/[0.05] hover:border-white/[0.16] hover:shadow-[0_2px_8px_rgba(255,255,255,0.08)]",
        ].join(" "),

        // Outline - Clean and minimal
        outline: [
          "border border-white/[0.12] bg-transparent text-foreground",
          "hover:bg-white/[0.05]",
        ].join(" "),

        // Ghost - Invisible until hover
        ghost: [
          "bg-transparent text-muted-foreground",
          "hover:bg-white/[0.05] hover:text-foreground",
        ].join(" "),

        // Link - Text-only interaction
        link: [
          "bg-transparent p-0 text-primary underline-offset-4",
          "hover:underline",
        ].join(" "),

        // Destructive - Error actions
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:opacity-90",
        ].join(" "),

        // Success - Positive actions (OpenAI green)
        success: ["bg-accent text-accent-foreground", "hover:opacity-90"].join(
          " ",
        ),

        // Tertiary - Extra subtle action
        tertiary: [
          "bg-transparent text-muted-foreground",
          "hover:bg-white/[0.04] hover:text-foreground",
          "border border-transparent",
        ].join(" "),

        // Default
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover",
        ].join(" "),
      },

      size: {
        xs: "h-7 px-2.5 text-xs rounded-md gap-1.5 [&_svg]:size-3.5",
        sm: "h-8 px-3 text-sm rounded-md gap-1.5 [&_svg]:size-4",
        md: "h-9 px-4 text-sm rounded-md gap-2 [&_svg]:size-4",
        lg: "h-10 px-5 text-base rounded-lg gap-2 [&_svg]:size-5",
        xl: "h-12 px-6 text-base rounded-lg gap-2.5 [&_svg]:size-5",
        icon: "h-9 w-9 rounded-md p-0 [&_svg]:size-4",
        "icon-sm": "h-8 w-8 rounded-md p-0 [&_svg]:size-4",
        "icon-lg": "h-10 w-10 rounded-lg p-0 [&_svg]:size-5",
        default: "h-9 px-4 text-sm rounded-md gap-2 [&_svg]:size-4",
      },

      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      block: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
