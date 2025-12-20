"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { getTimeUntilTwentySix } from "@/config/featureFlags";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TwentySixCountdownProps {
  /**
   * Show seconds in countdown (default: false for performance)
   */
  showSeconds?: boolean;

  /**
   * Update interval in milliseconds
   * Default: 60000 (1 minute) if not showing seconds
   * Default: 1000 (1 second) if showing seconds
   */
  updateInterval?: number;

  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";

  /**
   * Show labels below numbers
   */
  showLabels?: boolean;

  /**
   * Minimal mode: render only digits (no labels, no headings)
   */
  minimal?: boolean;

  /**
   * Apply animated rainbow gradient to digits
   */
  rainbow?: boolean;

  /**
   * What to render when expired
   * - 'message' (default): display "'26 is live" message
   * - 'hide': render nothing
   * - 'zero': show 00 : 00 : 00
   */
  onExpire?: "message" | "hide" | "zero";
}

/**
 * Real-time countdown to '26 launch
 * Updates every minute (or second if showSeconds enabled)
 */
export function TwentySixCountdown({
  showSeconds = false,
  updateInterval,
  size = "lg",
  showLabels = true,
  minimal = false,
  rainbow = false,
  onExpire = "message",
}: TwentySixCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(
    getTimeUntilTwentySix(),
  );
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Get update interval based on showSeconds prop
  const interval = updateInterval ?? (showSeconds ? 1000 : 60000);

  useEffect(() => {
    setMounted(true);

    // Update immediately
    setTimeLeft(getTimeUntilTwentySix());

    // Set up interval
    const timer = setInterval(() => {
      const newTime = getTimeUntilTwentySix();
      setTimeLeft(newTime);

      // Stop timer when countdown reaches zero
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        className={
          minimal ? "text-center" : "text-center space-y-4 animate-pulse"
        }
        aria-live="polite"
        aria-label="Loading countdown"
      >
        <div
          className={`font-mono tracking-tight text-[#A1A1A1] ${getSizeClass(size)}`}
        >
          -- : -- : --
        </div>
      </div>
    );
  }

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isExpired) {
    if (onExpire === "hide") {
      return null;
    }
    if (onExpire === "zero") {
      return (
        <div className={minimal ? "text-center" : "text-center space-y-4"}>
          <div
            className={`font-mono tracking-tight tabular-nums ${getSizeClass(size)} ${rainbow ? "bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-rainbow-shift" : ""}`}
            style={rainbow ? { backgroundSize: "200% 100%" } : undefined}
          >
            00 {" : "} 00 {" : "} 00
          </div>
          {!minimal && showLabels && (
            <div
              className={`flex justify-center gap-8 text-xs uppercase tracking-wider text-[#A1A1A1] ${size === "sm" ? "gap-4" : size === "md" ? "gap-6" : "gap-8"}`}
            >
              <span>Days</span>
              <span>Hours</span>
              <span>Minutes</span>
            </div>
          )}
        </div>
      );
    }
    // Default message behavior
    return (
      <div className="text-center space-y-2">
        <div className={`font-sans tracking-tight ${getSizeClass(size)}`}>
          &apos;26 is live
        </div>
        {showLabels && (
          <div className="text-sm text-[#A1A1A1]">
            Programs, Field Guide, and Resources are now available
          </div>
        )}
      </div>
    );
  }

  // Build time units array
  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    ...(showSeconds ? [{ value: timeLeft.seconds, label: "Seconds" }] : []),
  ];

  // Minimal mode: simple text display
  if (minimal) {
    return (
      <div
        className="text-center"
        role="timer"
        aria-live="polite"
        aria-label={`Time until '26 launch: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes${showSeconds ? `, ${timeLeft.seconds} seconds` : ""}`}
      >
        <div
          className={`font-mono tracking-tight tabular-nums ${getSizeClass(size)} ${rainbow ? "bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-rainbow-shift" : ""}`}
          style={rainbow ? { backgroundSize: "200% 100%" } : undefined}
        >
          {String(timeLeft.days).padStart(2, "0")} {" : "}
          {String(timeLeft.hours).padStart(2, "0")} {" : "}
          {String(timeLeft.minutes).padStart(2, "0")}
          {showSeconds && (
            <>
              {" : "}
              {String(timeLeft.seconds).padStart(2, "0")}
            </>
          )}
        </div>
      </div>
    );
  }

  // Refined glass morphism card mode
  return (
    <div
      className="flex justify-center gap-3 md:gap-6"
      role="timer"
      aria-live="polite"
      aria-label={`Time until '26 launch: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes${showSeconds ? `, ${timeLeft.seconds} seconds` : ""}`}
    >
      {timeUnits.map((unit, index) => (
        <m.div
          key={unit.label}
          className="relative"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.6 }}
        >
          {/* Subtle glass container */}
          <div
            className="relative rounded-2xl border border-white/[0.04]
                          bg-gradient-to-b from-white/[0.03] to-white/[0.01]
                          backdrop-blur-sm p-4 md:p-6
                          shadow-[0_4px_24px_rgba(0,0,0,0.2)]
                          min-w-[75px] md:min-w-[95px]"
          >
            {/* Number */}
            <div
              className={`relative font-mono text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums
                            ${rainbow ? "bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-rainbow-shift" : "text-foreground/95"}`}
              style={rainbow ? { backgroundSize: "200% 100%" } : undefined}
            >
              {String(unit.value).padStart(2, "0")}
            </div>

            {/* Label */}
            {showLabels && (
              <div
                className="text-[10px] md:text-xs uppercase tracking-wider
                              text-muted-foreground/70 mt-2 text-center font-medium"
              >
                {unit.label}
              </div>
            )}
          </div>
        </m.div>
      ))}
    </div>
  );
}

/**
 * Get text size class based on size variant
 */
function getSizeClass(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "text-2xl";
    case "md":
      return "text-4xl";
    case "lg":
      return "text-6xl";
    default:
      return "text-6xl";
  }
}
