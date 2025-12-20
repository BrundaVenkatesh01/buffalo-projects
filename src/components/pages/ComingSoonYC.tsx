"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

/**
 * Buffalo Projects Coming Soon - Blue YC/SF Aesthetic
 *
 * Combines:
 * - YC/SF directness and simplicity
 * - Buffalo Projects blue brand color
 * - Information-dense, builder-focused
 * - Monospaced accents for technical credibility
 */
export function ComingSoonYC() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Simple fade in, no fancy choreography
      gsap.from(containerRef.current?.children || [], {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.08,
        ease: "power1.out",
        clearProps: "all",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-2xl w-full space-y-12 text-left">
      {/* Header with blue accent */}
      <div className="space-y-2 opacity-0">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Buffalo Projects
          </h1>
          <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
            BETA
          </span>
        </div>
        <p className="text-lg text-slate-400 font-mono">
          {">"} Decentralized platform for Buffalo entrepreneurs
        </p>
      </div>

      {/* Value prop - direct and factual */}
      <div className="space-y-4 opacity-0">
        <h2 className="text-2xl font-semibold text-white">
          What we&apos;re building:
        </h2>
        <ul className="space-y-3 text-slate-300 leading-relaxed">
          <li className="flex gap-3">
            <span className="text-blue-400 font-mono shrink-0">→</span>
            <span>
              <strong className="text-white">Promote your project</strong>{" "}
              without gatekeepers. Share work, get feedback from Buffalo&apos;s
              entrepreneurial community.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-mono shrink-0">→</span>
            <span>
              <strong className="text-white">Build in public</strong> with
              workspace tools. Business Model Canvas, project journal, version
              history.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-mono shrink-0">→</span>
            <span>
              <strong className="text-white">Access local resources</strong>{" "}
              curated for Buffalo. Funding, networking, education, workspace
              options.
            </span>
          </li>
        </ul>
      </div>

      {/* Why this matters */}
      <div className="space-y-3 opacity-0">
        <h2 className="text-xl font-semibold text-white">
          Why Buffalo needs this:
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Buffalo has builders. Buffalo has resources. But there&apos;s no
          central place to{" "}
          <strong className="text-white">discover projects</strong>,{" "}
          <strong className="text-white">connect builders</strong>, or{" "}
          <strong className="text-white">find local support</strong>.
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          We&apos;re fixing that. No VC-funded platform deciding who gets
          visibility. No algorithmic feed optimizing for engagement. Just a
          simple tool for Buffalo entrepreneurs to ship.
        </p>
      </div>

      {/* Waitlist - minimal design */}
      <div className="border-t border-white/10 pt-8 space-y-4 opacity-0">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Get notified when we launch:
          </h2>
          <p className="text-sm text-slate-400">
            We&apos;ll email you once. No spam, no weekly updates, no
            newsletter.
          </p>
        </div>
        <WaitlistForm />
      </div>

      {/* Stats/Status - YC loves metrics */}
      <div className="border-t border-white/10 pt-8 space-y-4 opacity-0">
        <h3 className="text-sm font-mono font-semibold text-slate-400 uppercase tracking-wider">
          Status
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              Q1 2026
            </div>
            <div className="text-sm text-slate-400">Target Launch</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">100%</div>
            <div className="text-sm text-slate-400">Free Forever</div>
          </div>
        </div>
      </div>

      {/* Footer - minimal credits */}
      <div className="border-t border-white/10 pt-8 opacity-0">
        <p className="text-sm text-slate-500">
          Built in Buffalo, NY.{" "}
          <span className="text-slate-400">
            Made by builders, for builders.
          </span>
        </p>
      </div>
    </div>
  );
}
