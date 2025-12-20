"use client";

/**
 * PageLayout - Unified page wrapper with variant system
 *
 * Provides consistent dark theme treatment across all pages with:
 * - Background composition (gradient mesh, grid patterns, blobs)
 * - Integrated navigation
 * - Density-aware spacing
 *
 * Variants:
 * - marketing: Bold gradients, spacious spacing (landing, about)
 * - dashboard: Medium gradients, compact spacing (dashboard, discover)
 * - workspace: Subtle background, no nav (editor - uses custom sidebar)
 * - portfolio: Medium gradients, normal spacing (public project pages)
 */

import type { ReactNode } from "react";

import { BackgroundComposer } from "./backgrounds/BackgroundComposer";

import { Navigation } from "@/components/navigation/Navigation";
import { cn } from "@/lib/utils";

export type PageLayoutVariant =
  | "marketing"
  | "dashboard"
  | "workspace"
  | "portfolio";
export type BackgroundIntensity = "bold" | "medium" | "subtle" | "none";
export type SpacingDensity = "compact" | "normal" | "spacious";
export type NavigationMode = "full" | "minimal" | "none";

interface PageLayoutProps {
  /** Page archetype - sets intelligent defaults */
  variant: PageLayoutVariant;
  /** Background intensity override */
  background?: BackgroundIntensity;
  /** Spacing density override */
  density?: SpacingDensity;
  /** Navigation mode override */
  navigation?: NavigationMode;
  /** Additional CSS classes for main content area */
  className?: string;
  /** Page content */
  children: ReactNode;
}

// Variant defaults - can be overridden via props
const VARIANT_DEFAULTS: Record<
  PageLayoutVariant,
  {
    background: BackgroundIntensity;
    density: SpacingDensity;
    navigation: NavigationMode;
  }
> = {
  marketing: {
    background: "bold",
    density: "spacious",
    navigation: "full",
  },
  dashboard: {
    background: "medium",
    density: "compact",
    navigation: "full",
  },
  workspace: {
    background: "subtle",
    density: "normal",
    navigation: "none",
  },
  portfolio: {
    background: "medium",
    density: "normal",
    navigation: "full",
  },
};

// Density to padding mapping
const DENSITY_CLASSES: Record<SpacingDensity, string> = {
  compact: "py-4",
  normal: "py-8 md:py-12",
  spacious: "py-12 md:py-20 lg:py-24",
};

export function PageLayout({
  variant,
  background,
  density,
  navigation,
  className,
  children,
}: PageLayoutProps) {
  // Merge variant defaults with overrides
  const defaults = VARIANT_DEFAULTS[variant];
  const resolvedBackground = background ?? defaults.background;
  const resolvedDensity = density ?? defaults.density;
  const resolvedNavigation = navigation ?? defaults.navigation;

  // Navigation height offset (64px / 4rem when nav is shown)
  const hasNavigation = resolvedNavigation !== "none";
  const navOffset = hasNavigation ? "pt-16" : "";

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background layers - fixed position, no scroll */}
      <BackgroundComposer intensity={resolvedBackground} />

      {/* Navigation */}
      {hasNavigation && (
        <Navigation
          variant={resolvedNavigation === "minimal" ? "minimal" : "default"}
        />
      )}

      {/* Main content */}
      <main
        id="main-content"
        className={cn(
          "relative z-10",
          navOffset,
          DENSITY_CLASSES[resolvedDensity],
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}

/**
 * PageLayoutContent - Container wrapper for page content
 * Use inside PageLayout to get consistent width constraints
 */
interface PageLayoutContentProps {
  children: ReactNode;
  /** Max width size */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Additional classes */
  className?: string;
}

export function PageLayoutContent({
  children,
  size = "xl",
  className,
}: PageLayoutContentProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-[1400px]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
