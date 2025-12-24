"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { GradientMesh, GridPattern } from "@/components/graphics";
import { Button } from "@/components/unified";
import { ArrowRight, CheckCircle2, Download, Shield, Users } from "@/icons";
import { cleanupGSAP, prefersReducedMotion } from "@/lib/gsap-utils";
import { useAuthStore } from "@/stores/authStore";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Phrases for slide-replace animation - Focus on portfolio value, not community
const HEADLINE_PHRASES = [
  "Your project deserves a home.",
  "Build your portfolio.",
  "Share with one link.",
];

function SlideReplaceHeadline() {
  const phrases = HEADLINE_PHRASES;
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Cycle through phrases every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 7000); // 7 seconds per phrase

    return () => clearInterval(interval);
  }, [phrases.length]);

  // Animation variants for slide transitions
  const slideVariants = {
    enter: {
      x: shouldReduceMotion ? 0 : 100,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: shouldReduceMotion ? 0 : -100,
      opacity: 0,
    },
  };

  return (
    <div className="min-h-[140px] md:min-h-[160px] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <m.h1
          key={currentPhraseIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white"
        >
          {phrases[currentPhraseIndex]}
        </m.h1>
      </AnimatePresence>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !cardRef.current) {
      return;
    }

    const card = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        ref={cardRef}
        className="relative group h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glassmorphism card - on brand */}
        <div className="relative h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.1] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-300 shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:shadow-blue-500/10">
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/[0.05] via-transparent to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon with subtle glow */}
          <div className="relative inline-flex mb-7">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4 rounded-2xl bg-white/[0.06] text-blue-400 border border-white/[0.1] group-hover:border-blue-400/30 transition-all duration-300">
              {icon}
            </div>
          </div>

          <h3 className="relative text-xl font-semibold text-white mb-3 tracking-tight">
            {title}
          </h3>
          <p className="relative text-neutral-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </m.div>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      // Hero section fade in
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
        });
      }

      // How it works section title
      if (howItWorksRef.current) {
        gsap.from(howItWorksRef.current.querySelector(".section-title"), {
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 70%",
            once: true,
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Cards container ref kept for potential future use
      // Individual card animations handled by Motion whileInView

      // Parallax effect on gradient background
      gsap.to(".gradient-mesh", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        y: 200,
        ease: "none",
      });
    });

    return () => {
      ctx.revert();
      cleanupGSAP();
    };
  }, []);

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Hero Section */}
      <div className="min-h-screen relative flex items-center justify-center px-6">
        {/* Gradient mesh background with parallax */}
        <div className="gradient-mesh">
          <GradientMesh />
        </div>

        {/* Subtle grid pattern overlay */}
        <GridPattern className="text-white" spacing={32} opacity={0.015} />

        {/* Hero Content */}
        <div
          ref={heroRef}
          className="max-w-4xl mx-auto text-center py-24 relative z-10"
        >
          {/* Slide-Replace Headline */}
          <SlideReplaceHeadline />

          {/* Subheadline - Focus on tangible outcome */}
          <p className="text-xl md:text-2xl text-neutral-400 mt-8 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            Create a professional project page in minutes.{" "}
            <span className="text-white font-medium">
              One link to share everywhere.
            </span>
          </p>

          {/* Quick Import CTA */}
          <div className="flex flex-col items-center gap-4 mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            {/* GitHub URL Input */}
            <div className="flex w-full max-w-xl gap-3 items-stretch">
              <input
                type="text"
                placeholder="Paste GitHub URL (e.g. github.com/user/repo)"
                className="flex-1 h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      // Store URL in sessionStorage and redirect to import flow
                      sessionStorage.setItem("quick_import_url", value);
                      router.push(
                        user
                          ? "/workspace/new?import=github"
                          : "/signup?next=/workspace/new?import=github",
                      );
                    }
                  }
                }}
              />
              <Button
                variant="primary"
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder*="GitHub"]',
                  ) as HTMLInputElement;
                  const value = input?.value?.trim();
                  if (value) {
                    sessionStorage.setItem("quick_import_url", value);
                    router.push(
                      user
                        ? "/workspace/new?import=github"
                        : "/signup?next=/workspace/new?import=github",
                    );
                  } else {
                    router.push(user ? "/dashboard" : "/signup");
                  }
                }}
                rightIcon={
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                }
                className="group relative h-12 px-6 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border border-white/10 hover:border-white/20 whitespace-nowrap"
              >
                Import
              </Button>
            </div>

            {/* Or divider */}
            <div className="flex items-center gap-3 text-neutral-500 text-sm">
              <span className="w-12 h-px bg-white/10"></span>
              <span>or</span>
              <span className="w-12 h-px bg-white/10"></span>
            </div>

            {/* Manual create button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push(user ? "/workspace/new" : "/signup")}
              className="px-0 py-0 text-sm font-medium text-neutral-400 hover:text-white hover:underline underline-offset-4transition-colors duration-200"
            >
              Start from scratch
            </Button>
          </div>

          {/* Quick proof points - Focus on concrete deliverables */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {[
              {
                icon: <CheckCircle2 className="w-5 h-5" />,
                text: "Free forever",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5" />,
                text: "Shareable URL",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5" />,
                text: "No login to view",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.1] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 shadow-lg shadow-black/10"
              >
                <div className="text-blue-400 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-neutral-200">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section
        ref={howItWorksRef}
        className="py-24 md:py-40 px-6 border-t border-neutral-900 relative"
      >
        {/* Subtle background pattern for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="section-title text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Your project page, done right
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
              Import from anywhere. Polish in minutes.{" "}
              <span className="text-white">Share a professional link.</span>
            </p>
          </m.div>

          <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Private until you're ready"
              description="Work on your project privately. When you're happy with it, publish and get a shareable link anyone can view—no login required."
              index={0}
            />

            <FeatureCard
              icon={<Download className="w-8 h-8" />}
              title="Import in seconds"
              description="Paste your GitHub repo, website, or PDF. We auto-extract the details so you get a polished page without starting from scratch."
              index={1}
            />

            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Perfect for teams"
              description="Running an accelerator or class? Create a group and see everyone's projects in one dashboard. Great for cohorts and portfolios."
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Footer - Ultra Minimal */}
      <footer className="border-t border-white/[0.05] px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-neutral-600 font-light">
            © Buffalo Projects
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.push("/about")}
              className="text-sm text-neutral-500 hover:text-white transition-colors duration-300 font-light"
            >
              About
            </button>
            <button
              onClick={() => router.push("/support")}
              className="text-sm text-neutral-500 hover:text-white transition-colors duration-300 font-light"
            >
              Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
