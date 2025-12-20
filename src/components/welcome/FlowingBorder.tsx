"use client";

import { gsap } from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

import { prefersReducedMotion, EASINGS } from "@/lib/gsap-utils";
import { cn } from "@/lib/utils";

interface FlowingBorderProps {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  speed?: number;
  enabled?: boolean;
}

/**
 * FlowingBorder Component
 * Wraps content with an animated flowing gradient border
 * Uses SVG with animated stroke-dashoffset for smooth border flow
 */
export function FlowingBorder({
  children,
  className,
  borderColor = "rgba(59, 130, 246, 0.5)",
  borderWidth = 2,
  speed = 4,
  enabled = true,
}: FlowingBorderProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !pathRef.current || prefersReducedMotion()) {
      return;
    }

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    // Set up the stroke dash array
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: 0,
    });

    // Animate the dash offset to create flowing effect
    const animation = gsap.to(path, {
      strokeDashoffset: -pathLength * 2,
      duration: speed,
      ease: EASINGS.linear,
      repeat: -1,
    });

    return () => {
      animation.kill();
    };
  }, [enabled, speed]);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* SVG border overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="borderGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={borderColor} stopOpacity="0" />
            <stop offset="50%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={`M ${borderWidth / 2} ${borderWidth / 2}
              L ${containerRef.current?.offsetWidth ?? 100 - borderWidth / 2} ${borderWidth / 2}
              L ${containerRef.current?.offsetWidth ?? 100 - borderWidth / 2} ${containerRef.current?.offsetHeight ?? 100 - borderWidth / 2}
              L ${borderWidth / 2} ${containerRef.current?.offsetHeight ?? 100 - borderWidth / 2}
              Z`}
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Content */}
      {children}
    </div>
  );
}
