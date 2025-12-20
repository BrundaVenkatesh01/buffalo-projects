"use client";

/**
 * DismissButton - Reusable dismiss functionality for wedge components
 *
 * Provides consistent dismiss button with optional store integration.
 */

import { m } from "framer-motion";
import { X } from "lucide-react";

import { wedgeTransitionFast } from "./WedgeMotion";

import { Button } from "@/components/unified";
import { cn } from "@/lib/utils";

interface DismissButtonProps {
  /** Callback when button clicked */
  onDismiss: () => void;
  /** Size variant */
  size?: "sm" | "md";
  /** Custom aria-label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export function DismissButton({
  onDismiss,
  size = "sm",
  label = "Dismiss",
  className,
}: DismissButtonProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <m.div
      initial={{ opacity: 0.6 }}
      whileHover={{ opacity: 1 }}
      transition={wedgeTransitionFast}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          "shrink-0 rounded-full text-muted-foreground hover:text-foreground",
          "hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-primary/50",
          className,
        )}
        onClick={onDismiss}
        aria-label={label}
      >
        <X className={iconSize} />
      </Button>
    </m.div>
  );
}
