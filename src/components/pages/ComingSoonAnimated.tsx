"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { Megaphone, Wrench, Globe2 } from "@/icons";

/**
 * Resend-inspired Coming Soon Page with GSAP animations
 * Features:
 * - Subtle, purposeful motion
 * - Staggered entrance effects
 * - Performance-conscious animations
 * - Accessibility-first approach
 */
export function ComingSoonAnimated() {
  const heroRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Show everything immediately without animation
      gsap.set(
        [
          heroRef.current,
          subtitleRef.current,
          descriptionRef.current,
          formRef.current,
          featuresRef.current,
          footerRef.current,
        ],
        {
          opacity: 1,
          y: 0,
        },
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
          duration: 0.6,
        },
      });

      // Hero entrance: fade + slight scale
      tl.fromTo(
        heroRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.8 },
      );

      // Subtitle: subtle slide up
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0 },
        "-=0.4", // Overlap with hero
      );

      // Description: stagger lines
      tl.fromTo(
        descriptionRef.current?.children || [],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.1 },
        "-=0.3",
      );

      // Form: scale + fade
      tl.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7 },
        "-=0.2",
      );

      // Features: stagger cards
      tl.fromTo(
        featuresRef.current?.children || [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
        "-=0.4",
      );

      // Footer: gentle fade
      tl.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2",
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-3xl w-full text-center space-y-10">
      {/* Logo/Brand - Hero entrance */}
      <div ref={heroRef} className="space-y-4 opacity-0">
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight">
          Buffalo Projects
        </h1>
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="text-2xl md:text-3xl font-semibold text-blue-300 opacity-0"
      >
        Launching Soon
      </p>

      {/* Description - Split into staggerable elements */}
      <div ref={descriptionRef} className="space-y-4">
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed opacity-0">
          A decentralized platform where Buffalo entrepreneurs promote their
          projects, connect with the community, and access curated local
          resources.
        </p>
        <p className="text-base text-slate-400 max-w-xl mx-auto opacity-0">
          No gatekeepers. No barriers. Just builders sharing their work and
          growing together.
        </p>
      </div>

      {/* Waitlist Form */}
      <div ref={formRef} className="opacity-0">
        <WaitlistForm />
      </div>

      {/* Feature Highlights - Stagger cards */}
      <div ref={featuresRef} className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
          <div className="mb-3 flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-white font-semibold mb-2">
            Promote Your Project
          </h3>
          <p className="text-slate-400 text-sm">
            Share your work with Buffalo&apos;s entrepreneurial community. Get
            visibility and feedback.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
          <div className="mb-3 flex items-center justify-center">
            <Wrench className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-white font-semibold mb-2">Build in Public</h3>
          <p className="text-slate-400 text-sm">
            Use workspace tools like Business Model Canvas to develop your ideas
            over time.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 opacity-0">
          <div className="mb-3 flex items-center justify-center">
            <Globe2 className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-white font-semibold mb-2">Local Resources</h3>
          <p className="text-slate-400 text-sm">
            Access Buffalo&apos;s funding, networking, education, and workspace
            opportunities.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="pt-8 border-t border-white/10 opacity-0">
        <p className="text-slate-500 text-sm mb-2">
          Building the future of Buffalo&apos;s startup ecosystem, one project
          at a time.
        </p>
        <p className="text-slate-600 text-xs">
          Made in Buffalo, for Buffalo builders
        </p>
      </div>
    </div>
  );
}
