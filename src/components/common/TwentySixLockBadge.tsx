"use client";

import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getTimeUntilTwentySix,
  TWENTY_SIX_UNLOCKED,
} from "@/config/featureFlags";

interface TwentySixLockBadgeProps {
  /**
   * Size variant
   */
  size?: "sm" | "md";

  /**
   * Custom class names
   */
  className?: string;
}

/**
 * Rainbow countdown link for '26 section
 * Default: Shows "'26" with rainbow gradient
 * Hover: Transforms to countdown (55d : 08h : 30m) with smooth animation
 */
export function TwentySixLockBadge({
  size = "md",
  className = "",
}: TwentySixLockBadgeProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilTwentySix());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Keep the badge accurate to the second for hover
    const update = () => setTimeLeft(getTimeUntilTwentySix());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
  };

  // After unlock, this badge becomes a simple Programs link
  if (TWENTY_SIX_UNLOCKED) {
    return (
      <Link
        href="/programs"
        className={`inline-flex items-center text-sm font-medium text-foreground hover:text-foreground/90 transition-colors ${className}`}
      >
        Programs
      </Link>
    );
  }

  const rainbowStyle = {
    background: "linear-gradient(to right, #e879f9, #f472b6, #fb923c)",
    backgroundSize: "200% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "rainbow-shift 3s ease infinite",
  };

  return (
    <Link
      href="/26"
      className={`relative inline-flex items-center gap-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-3 py-1.5 transition-all hover:bg-white/5 ${className}`}
      title="Unlocks January 1st, 2026"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: "drop-shadow(0 0 8px rgba(232, 121, 249, 0.3))",
      }}
    >
      <m.div
        className={`font-semibold tabular-nums ${textSizeClasses[size]} whitespace-nowrap`}
        animate={{
          scale: isHovered ? 1.08 : 1,
          y: isHovered ? -1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.5,
        }}
      >
        <AnimatePresence mode="wait">
          {isHovered ? (
            <m.span
              key="countdown"
              initial={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-flex items-center gap-1"
              style={rainbowStyle}
            >
              <m.span
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.05,
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                {timeLeft.days}d
              </m.span>
              <span className="opacity-40">:</span>
              <m.span
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.08,
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                {String(timeLeft.hours).padStart(2, "0")}h
              </m.span>
              <span className="opacity-40">:</span>
              <m.span
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.11,
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                {String(timeLeft.minutes).padStart(2, "0")}m
              </m.span>
            </m.span>
          ) : (
            <m.span
              key="default"
              initial={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={rainbowStyle}
            >
              &apos;26
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </Link>
  );
}
