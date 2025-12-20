"use client";

import { m } from "framer-motion";

import { ChevronDown } from "@/icons";

export interface ScrollIndicatorProps {
  onClick?: () => void;
  className?: string;
}

/**
 * ScrollIndicator
 *
 * An animated scroll indicator that guides users to scroll down.
 *
 * Features:
 * - Bouncing animation to draw attention
 * - Gradient glow effect matching Buffalo branding
 * - Clickable to trigger smooth scroll
 * - Fades out when user scrolls down
 */
export function ScrollIndicator({
  onClick,
  className = "",
}: ScrollIndicatorProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default: smooth scroll down one viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <m.button
      onClick={handleClick}
      className={`group relative flex flex-col items-center gap-2 cursor-pointer focus:outline-none ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      aria-label="Scroll down"
    >
      {/* Pulsing glow background */}
      <m.div
        className="absolute inset-0 -z-10 blur-xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Text hint */}
      <m.span
        className="text-xs md:text-sm text-foreground/60 font-medium tracking-wider uppercase"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Scroll to discover
      </m.span>

      {/* Animated chevron */}
      <m.div
        className="relative"
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown
          className="w-6 h-6 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground/90 transition-colors"
          strokeWidth={2}
        />

        {/* Second chevron for layered effect */}
        <m.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 1, 0],
            y: [0, 8, 16],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown
            className="w-6 h-6 md:w-8 md:h-8 text-foreground/40"
            strokeWidth={2}
          />
        </m.div>
      </m.div>
    </m.button>
  );
}
