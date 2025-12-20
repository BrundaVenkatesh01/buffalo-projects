"use client";

import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";

import { MOTION } from "@/config/motion";

interface MorphIconProps {
  icon: ReactNode;
  isVisible: boolean;
  className?: string;
}

/**
 * MorphIcon - Smooth icon transitions with morph animation
 * Perfect for state changes (empty → loading → complete)
 */
export function MorphIcon({ icon, isVisible, className }: MorphIconProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <m.div
          // key removed to avoid stringifying ReactNode
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          transition={{
            duration: MOTION.duration.base / 1000,
            ease: MOTION.easing.spring,
          }}
          className={className}
        >
          {icon}
        </m.div>
      )}
    </AnimatePresence>
  );
}

/**
 * IconTransition - Crossfade between two icons
 * For simple A/B icon switches
 */
interface IconTransitionProps {
  iconA: ReactNode;
  iconB: ReactNode;
  showA: boolean;
  className?: string;
}

export function IconTransition({
  iconA,
  iconB,
  showA,
  className,
}: IconTransitionProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showA ? (
          <m.div
            key="iconA"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: MOTION.duration.fast / 1000,
            }}
            className={className}
          >
            {iconA}
          </m.div>
        ) : (
          <m.div
            key="iconB"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: MOTION.duration.fast / 1000,
            }}
            className={className}
          >
            {iconB}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * CheckmarkMorph - Animated checkmark for success states
 * Morphs from empty circle to checkmark with spring animation
 */
interface CheckmarkMorphProps {
  isChecked: boolean;
  size?: number;
  className?: string;
}

export function CheckmarkMorph({
  isChecked,
  size = 24,
  className,
}: CheckmarkMorphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Circle */}
      <m.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 1, opacity: 1 }}
        animate={{
          pathLength: isChecked ? 0 : 1,
          opacity: isChecked ? 0 : 1,
        }}
        transition={{
          duration: MOTION.duration.base / 1000,
          ease: MOTION.easing.easeOut,
        }}
      />

      {/* Checkmark */}
      <m.path
        d="M6 12l4 4l8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: isChecked ? 1 : 0,
          opacity: isChecked ? 1 : 0,
        }}
        transition={{
          duration: MOTION.duration.slow / 1000,
          ease: MOTION.easing.easeOut,
          delay: 0.1,
        }}
      />

      {/* Filled circle background (success state) */}
      <m.circle
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
        fillOpacity="0.1"
        initial={{ scale: 0 }}
        animate={{ scale: isChecked ? 1 : 0 }}
        transition={MOTION.spring.bouncy}
      />
    </svg>
  );
}
