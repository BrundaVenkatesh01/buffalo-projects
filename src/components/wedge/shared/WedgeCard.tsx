"use client";

/**
 * WedgeCard - Base card component for all wedge UI
 *
 * Provides consistent styling, theming, and animation across
 * reflection prompts, evidence indicators, peer insights, and narrative exports.
 */

import { m, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

import type { WedgeTheme, WedgePriority } from "../types";

import { DismissButton } from "./DismissButton";
import {
  wedgeCardVariants,
  wedgeCardHover,
  wedgePulseVariants,
} from "./WedgeMotion";

import { Card } from "@/components/ui-next";
import { cn } from "@/lib/utils";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const themeStyles: Record<
  WedgeTheme,
  {
    border: string;
    background: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  reflection: {
    border: "border-l-4 border-l-primary/40 border-white/10",
    background: "bg-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  evidence: {
    border: "border-l-4 border-l-amber-500/40 border-white/10",
    background: "bg-amber-500/5",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },
  peer: {
    border: "border-l-4 border-l-purple-500/40 border-white/10",
    background: "bg-purple-500/5",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
  },
  narrative: {
    border: "border-l-4 border-l-teal-500/40 border-white/10",
    background: "bg-teal-500/5",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-400",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface WedgeCardProps {
  /** Unique identifier for tracking */
  id: string;
  /** Visual theme */
  theme: WedgeTheme;
  /** Priority affects visual prominence */
  priority?: WedgePriority;
  /** Whether card can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Whether card is currently dismissed */
  isDismissed?: boolean;
  /** Left accent icon */
  icon?: ReactNode;
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function WedgeCard({
  id,
  theme,
  priority = "medium",
  dismissible = true,
  onDismiss,
  isDismissed = false,
  icon,
  children,
  className,
}: WedgeCardProps) {
  const styles = themeStyles[theme];

  return (
    <AnimatePresence mode="wait">
      {!isDismissed && (
        <m.div
          key={id}
          variants={wedgeCardVariants}
          initial="hidden"
          animate={priority === "high" ? ["visible", "pulse"] : "visible"}
          exit="exit"
          whileHover={wedgeCardHover}
          // Apply pulse animation for high priority
          {...(priority === "high" && {
            variants: { ...wedgeCardVariants, ...wedgePulseVariants },
          })}
        >
          <Card
            variant="minimal"
            padding="sm"
            className={cn(
              "rounded-xl transition-colors duration-200",
              styles.border,
              styles.background,
              priority === "high" && "ring-1 ring-primary/30",
              className,
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              {icon && (
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    styles.iconBg,
                    styles.iconColor,
                    "[&_svg]:h-5 [&_svg]:w-5",
                  )}
                >
                  {icon}
                </div>
              )}

              {/* Content */}
              <div className="min-w-0 flex-1">{children}</div>

              {/* Dismiss Button */}
              {dismissible && onDismiss && (
                <DismissButton onDismiss={onDismiss} />
              )}
            </div>
          </Card>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBCOMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Title for wedge card content */
export function WedgeCardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        "text-sm font-medium leading-tight text-foreground",
        className,
      )}
    >
      {children}
    </h4>
  );
}

/** Description/body text for wedge card */
export function WedgeCardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-1 text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

/** Action button area for wedge card */
export function WedgeCardActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-3 flex items-center gap-2", className)}>
      {children}
    </div>
  );
}

/** Metadata/context line for wedge card */
export function WedgeCardMeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
