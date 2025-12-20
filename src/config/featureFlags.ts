/**
 * Feature Flags Configuration
 *
 * Centralized feature toggle system for staged rollouts
 */

// '26 Launch Date: January 1, 2026 at midnight EST
export const TWENTY_SIX_LAUNCH_DATE = new Date("2026-01-01T00:00:00-05:00");

/**
 * Determines if the '26 section has unlocked
 * Before: /26 shows locked page with countdown
 * After: /26 redirects to /programs
 */
export const TWENTY_SIX_UNLOCKED = new Date() >= TWENTY_SIX_LAUNCH_DATE;

/**
 * Calculate time remaining until '26 launch
 */
export function getTimeUntilTwentySix() {
  const now = new Date();
  const difference = TWENTY_SIX_LAUNCH_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

/**
 * Get formatted countdown string
 * Example: "54 days : 12 hours : 34 minutes"
 */
export function getFormattedCountdown() {
  const time = getTimeUntilTwentySix();

  const days = String(time.days).padStart(2, "0");
  const hours = String(time.hours).padStart(2, "0");
  const minutes = String(time.minutes).padStart(2, "0");

  return `${days} : ${hours} : ${minutes}`;
}

// Other feature flags
export const ENABLE_COMMENTS =
  process.env["NEXT_PUBLIC_ENABLE_COMMENTS"] === "true";
export const ENABLE_MENTOR_MODE =
  process.env["NEXT_PUBLIC_ENABLE_MENTOR_MODE"] === "true";
export const ENABLE_GROUPS =
  process.env["NEXT_PUBLIC_ENABLE_GROUPS"] === "true";
