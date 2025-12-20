"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { Megaphone, Wrench, Globe2 } from "@/icons";

/**
 * Premium Coming Soon Page - 2025 Tech Startup Standards
 *
 * Features:
 * - Glassmorphism effects with backdrop blur
 * - Depth through layered shadows
 * - Premium typography hierarchy
 * - Micro-interactions on all interactive elements
 * - Strategic spacing for visual breathing room
 * - Monochromatic blue/slate palette
 */
export function ComingSoonPremium() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Subtle mouse follow effect for glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
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
          ease: "power3.out", // Smoother easing for premium feel
          duration: 0.8,
        },
      });

      // Hero: Elegant fade + slight scale
      tl.fromTo(
        heroRef.current,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1 },
      );

      // Subtitle: Slide with slight delay
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.6",
      );

      // Description: Stagger paragraphs
      tl.fromTo(
        descriptionRef.current?.children || [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 },
        "-=0.4",
      );

      // Form: Premium scale + fade
      tl.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.94, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9 },
        "-=0.3",
      );

      // Features: Stagger with elegance
      tl.fromTo(
        featuresRef.current?.children || [],
        { opacity: 0, y: 32, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.8 },
        "-=0.5",
      );

      // Footer: Gentle fade
      tl.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3",
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative max-w-5xl w-full text-center">
      {/* Animated gradient glow that follows mouse */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 transition-opacity duration-300 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />

      {/* Main content with spacing for breathing room */}
      <div className="relative z-10 space-y-16">
        {/* Hero Section */}
        <div ref={heroRef} className="space-y-6 opacity-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-300">
              Launching Soon
            </span>
          </div>

          {/* Main headline with premium typography */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none">
              Buffalo Projects
            </h1>
            <div className="flex items-center justify-center gap-3" />
          </div>
        </div>

        {/* Tagline with emphasis */}
        <p
          ref={subtitleRef}
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-300 opacity-0 leading-tight"
        >
          Where Buffalo Builders Ship
        </p>

        {/* Description with refined spacing */}
        <div ref={descriptionRef} className="space-y-6 max-w-3xl mx-auto">
          <p className="text-xl sm:text-2xl text-slate-200 leading-relaxed font-light opacity-0">
            A decentralized platform where entrepreneurs{" "}
            <span className="text-white font-medium">
              promote their projects
            </span>
            ,{" "}
            <span className="text-white font-medium">
              connect with the community
            </span>
            , and access curated local resources.
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed opacity-0">
            No gatekeepers. No barriers. Just builders sharing their work and
            growing together.
          </p>
        </div>

        {/* Waitlist Form with Glassmorphism */}
        <div ref={formRef} className="opacity-0 max-w-md mx-auto">
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-blue-900/20">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    Get Early Access
                  </h2>
                  <p className="text-sm text-slate-400">
                    Join the waitlist to be first when we launch
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards with Premium Design */}
        <div ref={featuresRef} className="grid sm:grid-cols-3 gap-6 mt-20">
          {[
            {
              Icon: Megaphone,
              title: "Promote Your Project",
              description:
                "Share your work with Buffalo's entrepreneurial community. Get visibility and feedback.",
              gradient: "from-blue-500/10 to-cyan-500/10",
              border: "border-blue-500/20",
            },
            {
              Icon: Wrench,
              title: "Build in Public",
              description:
                "Use workspace tools like Business Model Canvas to develop your ideas over time.",
              gradient: "from-purple-500/10 to-pink-500/10",
              border: "border-purple-500/20",
            },
            {
              Icon: Globe2,
              title: "Local Resources",
              description:
                "Access Buffalo's funding, networking, education, and workspace opportunities.",
              gradient: "from-cyan-500/10 to-teal-500/10",
              border: "border-cyan-500/20",
            },
          ].map((feature, idx) => (
            <div key={idx} className="relative group opacity-0">
              {/* Hover glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}
              />

              {/* Card */}
              <div
                className={`relative bg-white/5 backdrop-blur-xl rounded-xl p-8 border ${feature.border} transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="mb-4 flex items-center justify-center">
                  <feature.Icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with subtle elegance */}
        <div
          ref={footerRef}
          className="pt-16 border-t border-white/5 opacity-0"
        >
          <div className="space-y-3">
            <p className="text-slate-400 text-sm leading-relaxed">
              Building the future of Buffalo&apos;s startup ecosystem,{" "}
              <span className="text-white font-medium">
                one project at a time
              </span>
              .
            </p>
            <p className="text-slate-600 text-xs font-medium tracking-wide">
              MADE IN BUFFALO, FOR BUFFALO BUILDERS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
