import { cva, type VariantProps } from "class-variance-authority";

/**
 * Typography scale for Buffalo Projects inspired by the Task 13a spec.
 * Provides a consistent, minimal hierarchy aligned with the OpenAI/Vercel
 * aesthetic we’re targeting.
 */
export const headingStyles = cva(
  "font-display tracking-tight text-foreground",
  {
    variants: {
      level: {
        display: "text-5xl md:text-6xl lg:text-7xl leading-[1.05]",
        hero: "text-4xl md:text-5xl lg:text-6xl leading-[1.08]",
        h1: "text-4xl md:text-5xl leading-[1.1]",
        h2: "text-3xl md:text-4xl leading-[1.1]",
        h3: "text-2xl md:text-3xl leading-snug",
        h4: "text-xl md:text-2xl leading-snug",
        eyebrow:
          "text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    compoundVariants: [
      {
        level: "display",
        weight: "bold",
        class:
          "text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text",
      },
    ],
    defaultVariants: {
      level: "h2",
      weight: "semibold",
      align: "left",
    },
  },
);

export type HeadingStyleProps = VariantProps<typeof headingStyles>;

export const bodyStyles = cva("text-muted-foreground", {
  variants: {
    variant: {
      lead: "text-lg md:text-xl text-foreground leading-relaxed",
      base: "text-base leading-relaxed",
      secondary: "text-sm text-muted-foreground/80 leading-relaxed",
      caption: "text-xs uppercase tracking-[0.24em] text-muted-foreground",
      eyebrow:
        "text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/80",
      micro: "text-[11px] text-muted-foreground",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "base",
    weight: "normal",
    align: "left",
  },
});

export type BodyStyleProps = VariantProps<typeof bodyStyles>;
