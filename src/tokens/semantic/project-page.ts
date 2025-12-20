/**
 * Project Page Semantic Tokens
 *
 * Design tokens specific to project detail/showcase pages.
 * Provides consistent styling for visual-first project displays.
 */

import { BOX_SHADOW } from "../primitives/effects";
import { SPACING_PRIMITIVES } from "../primitives/spacing";

export const PROJECT_PAGE = {
  /**
   * Hero section configuration
   */
  hero: {
    minHeight: "60vh",
    coverOverlay: "rgba(0, 0, 0, 0.4)", // Dark overlay for readability
    gradient: {
      from: "rgba(255, 255, 255, 0.03)",
      to: "rgba(0, 0, 0, 0)",
    },
    title: {
      mobile: "text-4xl",
      tablet: "text-5xl",
      desktop: "text-6xl",
      large: "text-7xl",
      weight: "font-extrabold",
      tracking: "tracking-tight",
      leading: "leading-[1.05]",
    },
    subtitle: {
      mobile: "text-lg",
      desktop: "text-2xl",
      weight: "font-light",
      leading: "leading-relaxed",
    },
    metadata: {
      size: "text-xs",
      color: "text-muted-foreground",
    },
  },

  /**
   * Section configuration
   */
  section: {
    spacing: SPACING_PRIMITIVES.rem[16], // 4rem between sections
    spacingMobile: SPACING_PRIMITIVES.rem[12], // 3rem on mobile
    header: {
      size: "text-xs sm:text-sm",
      tracking: "tracking-[0.28em]",
      transform: "uppercase",
      weight: "font-semibold",
      color: "text-foreground",
      marginBottom: SPACING_PRIMITIVES.rem[4],
    },
    maxWidth: "max-w-7xl",
    padding: {
      desktop: "px-8",
      mobile: "px-4",
    },
  },

  /**
   * Gallery configuration
   */
  gallery: {
    aspectRatio: "aspect-video",
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
    gap: SPACING_PRIMITIVES.rem[4],
    image: {
      rounded: "rounded-xl",
      ring: "ring-1 ring-border/50",
      hover: {
        scale: "scale-[1.02]",
        shadow: BOX_SHADOW.lg,
        duration: "duration-300",
      },
    },
  },

  /**
   * Link preview cards
   */
  linkCard: {
    aspectRatio: "aspect-[2/1]",
    rounded: "rounded-xl",
    background: "bg-gradient-to-br from-muted/30 via-muted/20 to-transparent",
    border: "border border-border",
    padding: SPACING_PRIMITIVES.rem[6],
    hover: {
      scale: "scale-[1.01]",
      borderColor: "border-primary/40",
      shadow: BOX_SHADOW.md,
      duration: "duration-300",
    },
  },

  /**
   * Stats bar configuration
   */
  stats: {
    background: "bg-muted/10",
    border: "border-y border-border",
    backdrop: "backdrop-blur-sm",
    padding: `${SPACING_PRIMITIVES.rem[4]} ${SPACING_PRIMITIVES.rem[8]}`,
    paddingMobile: `${SPACING_PRIMITIVES.rem[3]} ${SPACING_PRIMITIVES.rem[4]}`,
    gap: SPACING_PRIMITIVES.rem[8],
    gapMobile: SPACING_PRIMITIVES.rem[4],
    icon: {
      size: "h-5 w-5",
      color: "text-primary",
      background: "bg-primary/15",
      rounded: "rounded-full",
      padding: "p-2",
    },
    label: {
      size: "text-xs",
      tracking: "tracking-wider",
      transform: "uppercase",
      color: "text-muted-foreground",
    },
    value: {
      size: "text-lg",
      weight: "font-semibold",
      color: "text-foreground",
    },
  },

  /**
   * BMC section configuration
   */
  bmc: {
    block: {
      rounded: "rounded-lg",
      padding: SPACING_PRIMITIVES.rem[6],
      background: "bg-muted/30",
      border: "border border-border",
      hover: {
        background: "hover:bg-muted/50",
        duration: "duration-200",
      },
    },
    title: {
      size: "text-sm sm:text-base",
      weight: "font-semibold",
      tracking: "tracking-wide",
      transform: "uppercase",
      color: "text-foreground",
    },
    content: {
      size: "text-sm sm:text-base",
      leading: "leading-relaxed",
      color: "text-foreground/90",
    },
    hint: {
      size: "text-xs sm:text-sm",
      style: "italic",
      color: "text-muted-foreground",
    },
  },

  /**
   * Update timeline configuration
   */
  timeline: {
    card: {
      rounded: "rounded-xl",
      padding: SPACING_PRIMITIVES.rem[6],
      background: "bg-card",
      border: "border-l-4",
      shadow: BOX_SHADOW.sm,
    },
    connector: {
      width: "w-px",
      color: "bg-border",
      margin: "ml-3",
    },
  },

  /**
   * Card hover effects
   */
  card: {
    hover: {
      scale: "scale-[1.02]",
      shadow: BOX_SHADOW.lg,
      borderColor: "border-primary/30",
      duration: "duration-300",
      ease: "ease-out",
    },
  },

  /**
   * Container widths
   */
  container: {
    narrow: "max-w-4xl", // For prose content
    standard: "max-w-6xl", // For most sections
    wide: "max-w-7xl", // For galleries and grids
    full: "w-full", // For hero and full-width sections
  },

  /**
   * Responsive breakpoints (Tailwind classes)
   */
  breakpoints: {
    sm: "sm:", // 640px
    md: "md:", // 768px
    lg: "lg:", // 1024px
    xl: "xl:", // 1280px
    "2xl": "2xl:", // 1536px
  },
} as const;

/**
 * Animation configurations for project pages
 */
export const PROJECT_ANIMATIONS = {
  /**
   * Page load animations
   */
  entrance: {
    hero: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" },
    },
    section: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
    },
    stagger: {
      delayIncrement: 0.1, // Delay between staggered items
    },
  },

  /**
   * Hover animations
   */
  hover: {
    card: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    image: {
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    button: {
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  },

  /**
   * Scroll animations
   */
  scroll: {
    smooth: "scroll-smooth",
    behavior: "smooth" as ScrollBehavior,
    block: "start" as ScrollLogicalPosition,
  },
} as const;

/**
 * Progressive enhancement tiers
 * Defines what makes each content quality tier
 */
export const CONTENT_TIERS = {
  minimal: {
    required: ["projectName", "description"],
    sections: ["hero", "about", "footer"],
  },
  standard: {
    required: ["projectName", "description"],
    optional: ["links", "gallery", "stage"],
    sections: ["hero", "stats", "links", "gallery", "about", "footer"],
  },
  rich: {
    required: ["projectName", "description"],
    optional: ["links", "gallery", "stage", "bmc", "updates", "documents"],
    sections: [
      "hero",
      "stats",
      "links",
      "gallery",
      "about",
      "bmc",
      "updates",
      "documents",
      "footer",
    ],
  },
  complete: {
    required: ["projectName", "description"],
    optional: [
      "links",
      "gallery",
      "stage",
      "bmc",
      "updates",
      "documents",
      "team",
      "comments",
    ],
    sections: [
      "hero",
      "stats",
      "links",
      "gallery",
      "about",
      "bmc",
      "updates",
      "documents",
      "team",
      "comments",
      "footer",
    ],
  },
} as const;
