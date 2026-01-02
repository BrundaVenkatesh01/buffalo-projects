"use client";

import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TEXTS = ["Buffalo Projects", "Built in Buffalo", "'26 is here!!"];

const ROTATION_INTERVAL = 30000; // 30 seconds
const TYPING_SPEED = 60; // Smoother: 60ms per character

/**
 * Animated typing logo with color-coded special words
 *
 * Features:
 * - Smooth typing animation character by character
 * - "Buffalo" highlighted in primary blue
 * - "'26" highlighted with rainbow gradient
 * - Cycles through inspirational builder slogans
 * - Blinking cursor effect
 */
export function AnimatedLogo({
  size = "md",
  className = "",
}: AnimatedLogoProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const currentText = TEXTS[textIndex] || "";

  const sizeClasses = {
    sm: "text-sm tracking-tight",
    md: "text-base tracking-tight",
    lg: "text-xl tracking-tight",
  };

  // Parse text into segments with styling
  const textSegments = useMemo(() => {
    const segments: Array<{
      text: string;
      style: "buffalo" | "rainbow" | "normal";
    }> = [];
    const text = displayedText;

    // Check for "Buffalo" (case-insensitive)
    const buffaloMatch = text.match(/(Buffalo)/i);
    const rainbowMatch = text.match(/('26)/);

    if (buffaloMatch) {
      const index = buffaloMatch.index!;
      if (index > 0) {
        segments.push({ text: text.slice(0, index), style: "normal" });
      }
      segments.push({ text: buffaloMatch[0], style: "buffalo" });
      const afterBuffalo = text.slice(index + buffaloMatch[0].length);

      if (rainbowMatch && afterBuffalo.includes("'26")) {
        const rainbowIndex = afterBuffalo.indexOf("'26");
        if (rainbowIndex > 0) {
          segments.push({
            text: afterBuffalo.slice(0, rainbowIndex),
            style: "normal",
          });
        }
        segments.push({ text: "'26", style: "rainbow" });
        if (rainbowIndex + 3 < afterBuffalo.length) {
          segments.push({
            text: afterBuffalo.slice(rainbowIndex + 3),
            style: "normal",
          });
        }
      } else if (afterBuffalo) {
        segments.push({ text: afterBuffalo, style: "normal" });
      }
    } else if (rainbowMatch) {
      const index = rainbowMatch.index!;
      if (index > 0) {
        segments.push({ text: text.slice(0, index), style: "normal" });
      }
      segments.push({ text: "'26", style: "rainbow" });
      if (index + 3 < text.length) {
        segments.push({ text: text.slice(index + 3), style: "normal" });
      }
    } else {
      segments.push({ text, style: "normal" });
    }

    return segments;
  }, [displayedText]);

  // Smooth typing effect
  useEffect(() => {
    if (!currentText) {
      return undefined;
    }

    if (shouldReduceMotion) {
      setDisplayedText(currentText);
      setIsTyping(false);
      return undefined;
    }

    if (isTyping && displayedText.length < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    } else if (isTyping && displayedText.length === currentText.length) {
      setIsTyping(false);
    }
    return undefined;
  }, [displayedText, currentText, isTyping, shouldReduceMotion]);

  // Rotation timer - switch text every 30 seconds
  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const rotationTimer = setTimeout(() => {
      setDisplayedText("");
      setIsTyping(true);
      setTextIndex((prev) => (prev + 1) % TEXTS.length);
    }, ROTATION_INTERVAL);

    return () => clearTimeout(rotationTimer);
  }, [textIndex, shouldReduceMotion]);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      <AnimatePresence mode="wait">
        <m.span
          key={textIndex}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          exit={shouldReduceMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`font-display font-semibold ${sizeClasses[size]}`}
        >
          {textSegments.map((segment, segmentIdx) => {
            if (segment.style === "buffalo") {
              return (
                <span key={`segment-${segmentIdx}`} className="text-primary">
                  {segment.text}
                </span>
              );
            } else if (segment.style === "rainbow") {
              return (
                <span
                  key={`segment-${segmentIdx}`}
                  className="bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFE66D] bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)",
                  }}
                >
                  {segment.text}
                </span>
              );
            } else {
              return (
                <span key={`segment-${segmentIdx}`} className="text-foreground">
                  {segment.text}
                </span>
              );
            }
          })}
        </m.span>
      </AnimatePresence>

      {/* Cursor blink */}
      {!shouldReduceMotion && (
        <m.span
          animate={{
            opacity: [1, 1, 0, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`inline-block h-[1em] w-[2px] bg-primary ${sizeClasses[size]}`}
        />
      )}
    </div>
  );
}
