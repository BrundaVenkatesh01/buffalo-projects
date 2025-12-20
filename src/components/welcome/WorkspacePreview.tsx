"use client";
/* eslint-disable react/no-unescaped-entities */

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect, useRef, useState } from "react";

import { AnimatedGlow } from "./AnimatedGlow";

import { DURATIONS, EASINGS, prefersReducedMotion } from "@/lib/gsap-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

/**
 * WorkspacePreview Component
 * Shows an animated preview of the workspace being built
 * Demonstrates the journey from empty canvas to published project
 */
export function WorkspacePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"building" | "publishing" | "published">(
    "building",
  );

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) {
      setPhase("published");
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        onRepeat: () => {
          setPhase("building");
        },
      });

      // Phase 1: Canvas appears (0-1s)
      tl.fromTo(
        ".canvas-grid",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATIONS.slow,
          ease: EASINGS.default,
        },
      );

      // Phase 2: Fields populate with typing effect (1-5s)
      const fields = [
        {
          selector: ".field-problem",
          text: "Buffalo builders working in isolation",
        },
        {
          selector: ".field-solution",
          text: "Shared workspace + public gallery",
        },
        {
          selector: ".field-audience",
          text: "Students, side projects, first-time founders",
        },
      ];

      fields.forEach((field) => {
        tl.to(
          field.selector,
          {
            text: field.text,
            duration: 1.5,
            ease: "none",
          },
          `+=0.3`,
        );
      });

      // Phase 3: Pivot marker appears (5-6s)
      tl.fromTo(
        ".pivot-marker",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: DURATIONS.medium,
          ease: EASINGS.bounce,
        },
        "+=0.5",
      );

      // Phase 4: Transition to published state (6-8s)
      tl.call(() => setPhase("publishing"), undefined, "+=0.5");

      tl.to(".workspace-container", {
        scale: 0.9,
        opacity: 0.5,
        duration: DURATIONS.medium,
        ease: EASINGS.default,
      });

      tl.call(() => setPhase("published"));

      tl.fromTo(
        ".published-card",
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: DURATIONS.slow,
          ease: EASINGS.default,
        },
        "-=0.2",
      );

      // Hold published state (8-10s)
      tl.to({}, { duration: 2 });

      // Phase 5: Reset (10-11s)
      tl.to(".published-card", {
        scale: 0.8,
        opacity: 0,
        y: -50,
        duration: DURATIONS.medium,
        ease: EASINGS.default,
      });

      tl.to(".workspace-container", {
        scale: 1,
        opacity: 1,
        duration: DURATIONS.medium,
        ease: EASINGS.default,
      });

      // Clear text fields
      fields.forEach((field) => {
        tl.to(field.selector, { text: "", duration: 0.1 }, "-=0.3");
      });

      tl.to(".pivot-marker", {
        scale: 0,
        opacity: 0,
        duration: 0.1,
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl">
      {/* Workspace View */}
      <div
        className={`workspace-container transition-opacity ${phase === "published" ? "opacity-0" : "opacity-100"}`}
      >
        <AnimatedGlow intensity="low" speed="medium">
          <div className="canvas-grid rounded-2xl border border-white/10 bg-[#0a0a0a]/90 p-8 backdrop-blur-xl">
            {/* Canvas Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Business Model Canvas
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500/50" />
                <span className="text-xs text-muted-foreground">
                  Auto-saved
                </span>
              </div>
            </div>

            {/* Canvas Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Problem */}
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Problem
                </div>
                <div className="field-problem min-h-[3rem] text-sm text-foreground" />
              </div>

              {/* Solution */}
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Solution
                </div>
                <div className="field-solution min-h-[3rem] text-sm text-foreground" />
              </div>

              {/* Target Audience */}
              <div className="col-span-2 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Audience
                </div>
                <div className="field-audience min-h-[3rem] text-sm text-foreground" />
              </div>
            </div>

            {/* Pivot Marker */}
            <div className="pivot-marker mt-4 flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Pivot detected</span>
            </div>
          </div>
        </AnimatedGlow>
      </div>

      {/* Published Card View */}
      {phase !== "building" && (
        <div className="published-card absolute inset-0 flex items-center justify-center">
          <AnimatedGlow intensity="medium" speed="medium">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-8 backdrop-blur-xl">
              {/* Published Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Published
              </div>

              {/* Project Info */}
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                Buffalo Builders Hub
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                A platform connecting isolated entrepreneurs across Buffalo's
                startup ecosystem.
              </p>

              {/* Tags */}
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  Student Project
                </span>
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                  Building
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>234 views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span>12 comments</span>
                </div>
              </div>
            </div>
          </AnimatedGlow>
        </div>
      )}
    </div>
  );
}
