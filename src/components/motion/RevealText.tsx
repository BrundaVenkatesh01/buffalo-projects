/**
 * RevealText - Animated text reveal effects
 * Creates engaging text entrances with stagger
 */

"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

import { MOTION } from "@/config/motion";

interface RevealTextProps {
  children: ReactNode;
  /**
   * Reveal animation type
   */
  type?: "word" | "line" | "fade";
  /**
   * Delay before animation starts (in seconds)
   */
  delay?: number;
  /**
   * Custom className for wrapper
   */
  className?: string;
}

/**
 * Animated text reveal with word-by-word or line-by-line stagger
 */
export function RevealText({
  children,
  type = "fade",
  delay = 0,
  className = "",
}: RevealTextProps) {
  // For simple fade, don't split text
  if (type === "fade") {
    return (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: MOTION.duration.slow / 1000,
          delay,
          ease: MOTION.easing.smooth,
        }}
        className={className}
      >
        {children}
      </m.div>
    );
  }

  // For word/line animations, content should be a string
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        staggerChildren: type === "word" ? 0.03 : 0.08,
        delayChildren: delay,
      }}
      className={className}
      style={{ display: "inline" }}
    >
      {words.map((word, i) => (
        <m.span
          key={i}
          variants={{
            hidden: {
              opacity: 0,
              y: 10,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: MOTION.duration.base / 1000,
                ease: MOTION.easing.smooth,
              },
            },
          }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </m.span>
      ))}
    </m.div>
  );
}

/**
 * Heading with reveal animation
 */
export function RevealHeading({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: MOTION.duration.slower / 1000,
        delay,
        ease: MOTION.easing.smooth,
      }}
      className={className}
    >
      {children}
    </m.h2>
  );
}
