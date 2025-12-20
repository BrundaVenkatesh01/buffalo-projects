/**
 * Container - Responsive container component with consistent padding
 * Ensures content never touches screen edges and respects safe areas
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
  className?: string;
}

export function Container({
  children,
  size = "xl",
  padding = true,
  className,
}: ContainerProps) {
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
        "mx-auto w-full",
        sizeClasses[size],
        padding && "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section - Full-width section with consistent vertical padding
 */
interface SectionProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Section({ children, size = "md", className }: SectionProps) {
  const sizeClasses = {
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-24 lg:py-32",
  };

  return (
    <section className={cn(sizeClasses[size], className)}>{children}</section>
  );
}

/**
 * Stack - Vertical stack with consistent spacing between children
 */
interface StackProps {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Stack({ children, gap = "md", className }: StackProps) {
  const gapClasses = {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  };

  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)}>
      {children}
    </div>
  );
}

/**
 * Inline - Horizontal layout with consistent spacing
 */
interface InlineProps {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  className?: string;
}

export function Inline({
  children,
  gap = "md",
  align = "center",
  justify = "start",
  wrap = false,
  className,
}: InlineProps) {
  const gapClasses = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "flex",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Grid - Responsive grid layout
 */
interface GridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4 | 6 | 12;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Grid({ children, cols = 3, gap = "md", className }: GridProps) {
  const colsClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-12",
  };

  const gapClasses = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div className={cn("grid", colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

/**
 * Center - Center content horizontally and vertically
 */
interface CenterProps {
  children: ReactNode;
  minHeight?: string;
  className?: string;
}

export function Center({ children, minHeight, className }: CenterProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
}

/**
 * Cluster - Group items with wrapping and consistent spacing
 * Perfect for tags, buttons, chips
 */
interface ClusterProps {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end";
  className?: string;
}

export function Cluster({
  children,
  gap = "sm",
  align = "center",
  justify = "start",
  className,
}: ClusterProps) {
  const gapClasses = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return (
    <div
      className={cn(
        "flex flex-wrap",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}
