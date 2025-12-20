/**
 * NoiseTexture - Subtle film grain overlay
 * Adds tactile, premium feel to backgrounds
 */
"use client";

import { cn } from "@/lib/utils";

interface NoiseTextureProps {
  className?: string;
  /**
   * Noise opacity
   * @default 0.015
   */
  opacity?: number;
}

export function NoiseTexture({
  className,
  opacity = 0.015,
}: NoiseTextureProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full">
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </div>
  );
}
