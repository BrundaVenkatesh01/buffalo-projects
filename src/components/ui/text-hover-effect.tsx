"use client";

import { m } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

export interface TextHoverEffectProps {
  text: string;
  duration?: number;
  className?: string;
}

/**
 * TextHoverEffect
 *
 * An interactive SVG text component that reveals a gradient on hover.
 * Inspired by Aceternity UI, customized for Buffalo Projects branding.
 *
 * Features:
 * - SVG-based text rendering for smooth animations
 * - Radial gradient mask that follows cursor position
 * - Buffalo brand colors (purple, pink, blue)
 * - Animated stroke reveal on mount
 *
 * @see https://ui.aceternity.com/components/text-hover-effect
 */
export const TextHoverEffect: React.FC<TextHoverEffectProps> = ({
  text,
  duration = 0.3,
  className = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`select-none ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Buffalo Projects gradient: purple → pink → blue */}
        <linearGradient id="textGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#a855f7" />
          {/* purple-500 */}
          <stop offset="33%" stopColor="#d946ef" />
          {/* fuchsia-500 */}
          <stop offset="66%" stopColor="#ec4899" />
          {/* pink-500 */}
          <stop offset="100%" stopColor="#60a5fa" />
          {/* blue-400 */}
        </linearGradient>

        {/* Brighter gradient for hover effect */}
        <linearGradient
          id="textGradientBright"
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
        >
          <stop offset="0%" stopColor="#c084fc" />
          {/* purple-400 */}
          <stop offset="33%" stopColor="#f0abfc" />
          {/* fuchsia-400 */}
          <stop offset="66%" stopColor="#f9a8d4" />
          {/* pink-400 */}
          <stop offset="100%" stopColor="#93c5fd" />
          {/* blue-300 */}
        </linearGradient>

        {/* Radial gradient mask that follows cursor */}
        <m.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          animate={maskPosition}
          transition={{ duration: duration, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </m.radialGradient>

        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Base gradient text - always visible */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="2"
        className="font-bold"
        style={{
          fontSize: "72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fill: "url(#textGradient)",
          stroke: "url(#textGradient)",
          opacity: 0.95,
        }}
      >
        {text}
      </text>

      {/* Hover overlay - brighter gradient stroke with mask */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradientBright)"
        strokeWidth="3"
        mask="url(#textMask)"
        className="font-bold transition-opacity duration-300"
        style={{
          fontSize: "72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fill: "url(#textGradientBright)",
          opacity: hovered ? 1 : 0,
        }}
      >
        {text}
      </text>
    </svg>
  );
};
