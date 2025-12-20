/**
 * Buffalo Projects - Component-Specific Semantic Tokens
 *
 * Maps primitives to specific component patterns (buttons, cards, inputs, etc.)
 * USE THESE for consistent component styling.
 *
 * Brand Identity: Consistent Buffalo blue (#0070f3) across all interactive elements
 */

import { COLOR_PRIMITIVES } from "../primitives/colors";
import { BORDER_RADIUS, BOX_SHADOW } from "../primitives/effects";
import { SPACING_PRIMITIVES } from "../primitives/spacing";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUTTON TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BUTTON = {
  // Primary button (main CTAs - Buffalo branded)
  primary: {
    background: {
      default: COLOR_PRIMITIVES.buffalo[500], // Buffalo blue button
      hover: COLOR_PRIMITIVES.buffalo[600], // Buffalo blue hover
      active: COLOR_PRIMITIVES.buffalo[700], // Buffalo blue active
      disabled: COLOR_PRIMITIVES.neutral[200], // Disabled state
    },
    text: {
      default: COLOR_PRIMITIVES.neutral[1000],
      disabled: COLOR_PRIMITIVES.neutral[500],
    },
    border: "transparent",
    shadow: BOX_SHADOW.sm,
    radius: BORDER_RADIUS.md,
  },

  // Secondary button (alternative actions)
  secondary: {
    background: {
      default: COLOR_PRIMITIVES.neutral[150],
      hover: COLOR_PRIMITIVES.neutral[200],
      active: COLOR_PRIMITIVES.neutral[300],
      disabled: COLOR_PRIMITIVES.neutral[100],
    },
    text: {
      default: COLOR_PRIMITIVES.neutral[1000],
      disabled: COLOR_PRIMITIVES.neutral[500],
    },
    border: COLOR_PRIMITIVES.neutral[200],
    shadow: BOX_SHADOW.none,
    radius: BORDER_RADIUS.md,
  },

  // Ghost button (subtle actions)
  ghost: {
    background: {
      default: "transparent",
      hover: "rgba(255, 255, 255, 0.05)",
      active: "rgba(255, 255, 255, 0.08)",
      disabled: "transparent",
    },
    text: {
      default: COLOR_PRIMITIVES.neutral[600],
      hover: COLOR_PRIMITIVES.neutral[1000],
      disabled: COLOR_PRIMITIVES.neutral[400],
    },
    border: "transparent",
    shadow: BOX_SHADOW.none,
    radius: BORDER_RADIUS.md,
  },

  // Outline button
  outline: {
    background: {
      default: "transparent",
      hover: "rgba(255, 255, 255, 0.03)",
      active: "rgba(255, 255, 255, 0.05)",
      disabled: "transparent",
    },
    text: {
      default: COLOR_PRIMITIVES.neutral[1000],
      disabled: COLOR_PRIMITIVES.neutral[500],
    },
    border: {
      default: COLOR_PRIMITIVES.neutral[200],
      hover: COLOR_PRIMITIVES.neutral[300],
      disabled: COLOR_PRIMITIVES.neutral[200],
    },
    shadow: BOX_SHADOW.none,
    radius: BORDER_RADIUS.md,
  },

  // Destructive button (delete, remove)
  destructive: {
    background: {
      default: COLOR_PRIMITIVES.red[600],
      hover: COLOR_PRIMITIVES.red[700],
      active: COLOR_PRIMITIVES.red[800],
      disabled: COLOR_PRIMITIVES.neutral[200],
    },
    text: {
      default: COLOR_PRIMITIVES.neutral[1000],
      disabled: COLOR_PRIMITIVES.neutral[500],
    },
    border: "transparent",
    shadow: BOX_SHADOW.sm,
    radius: BORDER_RADIUS.md,
  },

  // Size variants
  size: {
    xs: {
      padding: `${SPACING_PRIMITIVES.rem[1.5]} ${SPACING_PRIMITIVES.rem[3]}`,
      fontSize: "0.75rem",
      height: "1.75rem",
    },
    sm: {
      padding: `${SPACING_PRIMITIVES.rem[2]} ${SPACING_PRIMITIVES.rem[3]}`,
      fontSize: "0.875rem",
      height: "2rem",
    },
    md: {
      padding: `${SPACING_PRIMITIVES.rem[2.5]} ${SPACING_PRIMITIVES.rem[4]}`,
      fontSize: "0.875rem",
      height: "2.5rem",
    },
    lg: {
      padding: `${SPACING_PRIMITIVES.rem[3]} ${SPACING_PRIMITIVES.rem[6]}`,
      fontSize: "1rem",
      height: "3rem",
    },
    xl: {
      padding: `${SPACING_PRIMITIVES.rem[4]} ${SPACING_PRIMITIVES.rem[8]}`,
      fontSize: "1rem",
      height: "3.5rem",
    },
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CARD = {
  // Default card
  default: {
    background: COLOR_PRIMITIVES.neutral[100],
    border: "rgba(255, 255, 255, 0.08)",
    shadow: BOX_SHADOW.none,
    radius: BORDER_RADIUS.xl,
    padding: SPACING_PRIMITIVES.rem[6],
  },

  // Elevated card (more prominent)
  elevated: {
    background: COLOR_PRIMITIVES.neutral[100],
    border: "rgba(255, 255, 255, 0.1)",
    shadow: BOX_SHADOW.md,
    radius: BORDER_RADIUS.xl,
    padding: SPACING_PRIMITIVES.rem[6],
  },

  // Interactive card (clickable)
  interactive: {
    background: {
      default: "rgba(255, 255, 255, 0.03)",
      hover: "rgba(255, 255, 255, 0.05)",
      active: "rgba(255, 255, 255, 0.08)",
    },
    border: {
      default: "rgba(255, 255, 255, 0.08)",
      hover: "rgba(255, 255, 255, 0.12)",
    },
    shadow: BOX_SHADOW.none,
    radius: BORDER_RADIUS.xl,
    padding: SPACING_PRIMITIVES.rem[6],
  },

  // Glass card (backdrop blur effect)
  glass: {
    background: "rgba(0, 0, 0, 0.4)",
    border: "rgba(255, 255, 255, 0.1)",
    shadow: BOX_SHADOW.lg,
    radius: BORDER_RADIUS.xl,
    padding: SPACING_PRIMITIVES.rem[6],
    backdropBlur: "blur(16px)",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const INPUT = {
  default: {
    background: {
      default: COLOR_PRIMITIVES.neutral[100],
      hover: COLOR_PRIMITIVES.neutral[150],
      focus: COLOR_PRIMITIVES.neutral[100],
      disabled: COLOR_PRIMITIVES.neutral[50],
    },
    border: {
      default: COLOR_PRIMITIVES.neutral[200],
      hover: COLOR_PRIMITIVES.neutral[300],
      focus: COLOR_PRIMITIVES.buffalo[500], // Buffalo blue focus ring
      error: COLOR_PRIMITIVES.red[600],
      disabled: COLOR_PRIMITIVES.neutral[200],
    },
    text: {
      default: COLOR_PRIMITIVES.neutral[1000],
      placeholder: COLOR_PRIMITIVES.neutral[500],
      disabled: COLOR_PRIMITIVES.neutral[400],
    },
    shadow: {
      default: BOX_SHADOW.none,
      focus: `0 0 0 3px rgba(0, 112, 243, 0.1)`,
      error: `0 0 0 3px rgba(239, 68, 68, 0.1)`,
    },
    radius: BORDER_RADIUS.lg,
    padding: `${SPACING_PRIMITIVES.rem[2.5]} ${SPACING_PRIMITIVES.rem[3]}`,
    height: "2.5rem",
  },

  // Size variants
  size: {
    sm: {
      padding: `${SPACING_PRIMITIVES.rem[2]} ${SPACING_PRIMITIVES.rem[3]}`,
      fontSize: "0.875rem",
      height: "2rem",
    },
    md: {
      padding: `${SPACING_PRIMITIVES.rem[2.5]} ${SPACING_PRIMITIVES.rem[3]}`,
      fontSize: "0.875rem",
      height: "2.5rem",
    },
    lg: {
      padding: `${SPACING_PRIMITIVES.rem[3]} ${SPACING_PRIMITIVES.rem[4]}`,
      fontSize: "1rem",
      height: "3rem",
    },
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BADGE TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BADGE = {
  default: {
    background: COLOR_PRIMITIVES.neutral[150],
    text: COLOR_PRIMITIVES.neutral[600],
    border: "transparent",
    radius: BORDER_RADIUS.md,
  },
  primary: {
    background: "rgba(0, 112, 243, 0.1)", // Buffalo blue tint
    text: COLOR_PRIMITIVES.buffalo[500], // Buffalo blue text
    border: "transparent",
    radius: BORDER_RADIUS.md,
  },
  success: {
    background: "rgba(34, 197, 94, 0.1)",
    text: COLOR_PRIMITIVES.green[400],
    border: "transparent",
    radius: BORDER_RADIUS.md,
  },
  warning: {
    background: "rgba(245, 158, 11, 0.1)",
    text: COLOR_PRIMITIVES.amber[400],
    border: "transparent",
    radius: BORDER_RADIUS.md,
  },
  error: {
    background: "rgba(239, 68, 68, 0.1)",
    text: COLOR_PRIMITIVES.red[400],
    border: "transparent",
    radius: BORDER_RADIUS.md,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DIALOG/MODAL TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DIALOG = {
  overlay: "rgba(0, 0, 0, 0.6)",
  content: {
    background: COLOR_PRIMITIVES.neutral[50],
    border: "rgba(255, 255, 255, 0.1)",
    shadow: BOX_SHADOW["2xl"],
    radius: BORDER_RADIUS.xl,
    padding: SPACING_PRIMITIVES.rem[6],
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOLTIP TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TOOLTIP = {
  background: COLOR_PRIMITIVES.neutral[900],
  text: COLOR_PRIMITIVES.neutral[0],
  border: "transparent",
  shadow: BOX_SHADOW.lg,
  radius: BORDER_RADIUS.md,
  padding: `${SPACING_PRIMITIVES.rem[2]} ${SPACING_PRIMITIVES.rem[3]}`,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WORKSPACE-SPECIFIC TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Workspace Canvas Block Tokens
 * Used for Business Model Canvas 9-block grid
 */
export const CANVAS_BLOCK = {
  // Standard block - auto-height, compact spacing
  standard: {
    background: {
      default: "rgba(255, 255, 255, 0.02)",
      hover: "rgba(255, 255, 255, 0.05)",
      active: "rgba(255, 255, 255, 0.08)",
    },
    border: {
      default: "rgba(255, 255, 255, 0.1)",
      hover: "rgba(0, 112, 243, 0.4)", // Buffalo blue hover
      complete: "rgba(0, 112, 243, 0.3)", // Buffalo blue when complete
    },
    radius: BORDER_RADIUS.lg,
    padding: SPACING_PRIMITIVES.rem[2], // Reduced from 3 to 2 (12px)
    minHeight: "auto", // Auto-height based on content
  },

  // Core block (Value Propositions)
  core: {
    background: {
      default: "rgba(0, 112, 243, 0.12)",
      hover: "rgba(0, 112, 243, 0.15)",
    },
    border: {
      default: "rgba(0, 112, 243, 0.4)",
    },
    radius: BORDER_RADIUS["2xl"],
    padding: SPACING_PRIMITIVES.rem[3],
  },
} as const;

/**
 * Workspace Pivot Timeline Tokens
 * Magnitude-based colors for pivot visualization
 */
export const PIVOT = {
  minor: {
    background: "rgba(0, 112, 243, 0.15)", // Buffalo blue
    border: "rgba(0, 112, 243, 0.4)",
    node: "rgba(0, 112, 243, 0.2)",
    text: COLOR_PRIMITIVES.buffalo[400],
  },
  major: {
    background: "rgba(59, 130, 246, 0.2)", // Blue-500
    border: "rgba(59, 130, 246, 0.4)",
    node: "rgba(59, 130, 246, 0.25)",
    text: COLOR_PRIMITIVES.blue[400],
  },
  complete: {
    background: "rgba(124, 58, 237, 0.2)", // Purple-600
    border: "rgba(124, 58, 237, 0.4)",
    node: "rgba(124, 58, 237, 0.25)",
    text: COLOR_PRIMITIVES.purple[400],
  },
} as const;

/**
 * Workspace Surface Tokens
 * Common workspace-specific backgrounds and borders
 */
export const WORKSPACE_SURFACE = {
  // Subtle surfaces (dropzones, background cards)
  subtle: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "rgba(255, 255, 255, 0.1)",
  },

  // Muted surfaces (panels, sidebars)
  muted: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
  },

  // Elevated surfaces (floating cards, modals)
  elevated: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.1)",
  },

  // Primary accent surface (highlights, active states)
  primaryAccent: {
    background: "rgba(0, 112, 243, 0.1)",
    border: "rgba(0, 112, 243, 0.3)",
  },
} as const;

/**
 * Workspace Stage Colors
 * For project stage badges and indicators
 * Uses Buffalo blue as the primary color with variants for different stages
 */
export const STAGE_COLORS = {
  idea: {
    background: "rgba(0, 112, 243, 0.15)", // Buffalo blue for ideas
    text: COLOR_PRIMITIVES.buffalo[400],
    border: "rgba(0, 112, 243, 0.3)",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  research: {
    background: "rgba(124, 58, 237, 0.15)", // Purple for research
    text: COLOR_PRIMITIVES.purple[400],
    border: "rgba(124, 58, 237, 0.3)",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  planning: {
    background: "rgba(59, 130, 246, 0.15)", // Lighter blue for planning
    text: COLOR_PRIMITIVES.blue[400],
    border: "rgba(59, 130, 246, 0.3)",
    className: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  },
  building: {
    background: "rgba(20, 184, 166, 0.15)", // Teal for building
    text: COLOR_PRIMITIVES.teal[400],
    border: "rgba(20, 184, 166, 0.3)",
    className: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  },
  testing: {
    background: "rgba(245, 158, 11, 0.15)", // Amber for testing
    text: COLOR_PRIMITIVES.amber[400],
    border: "rgba(245, 158, 11, 0.3)",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  launching: {
    background: "rgba(34, 197, 94, 0.15)", // Green for launching
    text: COLOR_PRIMITIVES.green[400],
    border: "rgba(34, 197, 94, 0.3)",
    className: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  scaling: {
    background: "rgba(16, 185, 129, 0.15)", // Emerald for scaling
    text: COLOR_PRIMITIVES.green[500],
    border: "rgba(16, 185, 129, 0.3)",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";
export type ButtonSize = keyof typeof BUTTON.size;
export type CardVariant = keyof typeof CARD;
export type InputSize = keyof typeof INPUT.size;
export type BadgeVariant = keyof typeof BADGE;
export type PivotMagnitude = keyof typeof PIVOT;
export type ProjectStage = keyof typeof STAGE_COLORS;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEDGE COMPONENT TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Wedge UI Tokens
 * Used for validation, reflection, peer intelligence, and narrative components.
 * These differentiate Buffalo Projects from generic canvas tools.
 */
export const WEDGE = {
  /** Reflection prompts - uses Buffalo blue */
  reflection: {
    background: "rgba(0, 112, 243, 0.08)",
    border: "rgba(0, 112, 243, 0.2)",
    borderHigh: "rgba(0, 112, 243, 0.4)",
    accent: COLOR_PRIMITIVES.buffalo[500],
    iconBg: "rgba(0, 112, 243, 0.2)",
  },

  /** Evidence gap indicators - amber warning colors */
  evidence: {
    empty: {
      background: "rgba(255, 255, 255, 0.02)",
      border: "rgba(255, 255, 255, 0.08)",
      text: COLOR_PRIMITIVES.neutral[500],
    },
    claimed: {
      background: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.3)",
      text: COLOR_PRIMITIVES.amber[400],
    },
    partial: {
      background: "rgba(0, 112, 243, 0.1)",
      border: "rgba(0, 112, 243, 0.3)",
      text: COLOR_PRIMITIVES.buffalo[400],
    },
    supported: {
      background: "rgba(34, 197, 94, 0.1)",
      border: "rgba(34, 197, 94, 0.3)",
      text: COLOR_PRIMITIVES.green[400],
    },
  },

  /** Peer intelligence - purple for community */
  peer: {
    background: "rgba(124, 58, 237, 0.08)",
    border: "rgba(124, 58, 237, 0.2)",
    accent: COLOR_PRIMITIVES.purple[400],
    iconBg: "rgba(124, 58, 237, 0.2)",
  },

  /** Narrative export - teal for storytelling */
  narrative: {
    background: "rgba(20, 184, 166, 0.08)",
    border: "rgba(20, 184, 166, 0.2)",
    accent: COLOR_PRIMITIVES.teal[400],
    iconBg: "rgba(20, 184, 166, 0.2)",
  },
} as const;

export type WedgeTheme = keyof typeof WEDGE;
export type EvidenceStatus = keyof typeof WEDGE.evidence;
