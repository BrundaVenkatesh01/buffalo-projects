import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Single viewport hook to replace duplicate mobile detection
 * Uses Tailwind breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
 */
export function useViewport(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    // Initial check
    updateBreakpoint();

    // Single listener for entire app
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Helper hooks for common checks
 */
export function useIsMobile(): boolean {
  return useViewport() === "mobile";
}

export function useIsTablet(): boolean {
  return useViewport() === "tablet";
}

export function useIsDesktop(): boolean {
  return useViewport() === "desktop";
}
