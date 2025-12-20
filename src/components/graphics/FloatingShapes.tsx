/**
 * FloatingShapes - Subtle geometric shapes with parallax
 * Bauhaus/Swiss modernism inspired background elements
 */
"use client";

import { m, useReducedMotion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

interface FloatingShapesProps {
  className?: string;
}

type Shape =
  | {
      type: "circle" | "square";
      size: number;
      top?: string;
      left?: string;
      right?: string;
      bottom?: string;
      opacity: number;
      duration: number;
      rotate?: number;
    }
  | {
      type: "rectangle";
      width: number;
      height: number;
      top?: string;
      left?: string;
      right?: string;
      bottom?: string;
      opacity: number;
      duration: number;
      rotate?: number;
    };

export function FloatingShapes({ className }: FloatingShapesProps) {
  const shouldReduceMotion = useReducedMotion();

  const shapes: Shape[] = [
    {
      type: "circle",
      size: 200,
      top: "15%",
      left: "10%",
      opacity: 0.03,
      duration: 20,
    },
    {
      type: "square",
      size: 150,
      top: "60%",
      right: "15%",
      opacity: 0.04,
      duration: 25,
    },
    {
      type: "rectangle",
      width: 300,
      height: 100,
      top: "40%",
      left: "70%",
      opacity: 0.02,
      duration: 30,
      rotate: 15,
    },
    {
      type: "circle",
      size: 100,
      bottom: "20%",
      left: "25%",
      opacity: 0.05,
      duration: 18,
    },
  ];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {shapes.map((shape, index) => {
        const isCircle = shape.type === "circle";
        const isSquare = shape.type === "square";

        const style: React.CSSProperties = {
          position: "absolute",
          top: shape.top,
          left: shape.left,
          right: shape.right,
          bottom: shape.bottom,
          width: shape.type === "rectangle" ? shape.width : shape.size,
          height: shape.type === "rectangle" ? shape.height : shape.size,
          borderRadius: isCircle ? "50%" : isSquare ? "8px" : "4px",
          opacity: shape.opacity,
          transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
        };

        if (shouldReduceMotion) {
          return (
            <div
              key={index}
              className="border-2 border-blue-500/50"
              style={style}
            />
          );
        }

        return (
          <m.div
            key={index}
            className="border-2 border-blue-500/50"
            style={style}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * GeometricAccent - Single geometric shape accent
 * For targeted use in specific sections
 */
interface GeometricAccentProps {
  shape?: "circle" | "square" | "triangle";
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export function GeometricAccent({
  shape = "circle",
  size = 100,
  color = "border-blue-500",
  opacity = 0.1,
  className,
}: GeometricAccentProps) {
  const borderRadius =
    shape === "circle" ? "50%" : shape === "square" ? "8px" : "0";

  return (
    <div
      className={cn("border-2", color, className)}
      style={{
        width: size,
        height: size,
        borderRadius,
        opacity,
        clipPath:
          shape === "triangle"
            ? "polygon(50% 0%, 0% 100%, 100% 100%)"
            : undefined,
      }}
      aria-hidden="true"
    />
  );
}
