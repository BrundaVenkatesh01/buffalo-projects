// ...existing code...
"use client";

import { m } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { useEffect, useRef} from "react";
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
        className="relative group h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-white/[0.18] hover:bg-white/[0.04]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.1] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-300 shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:shadow-blue-500/10">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/[0.05] via-transparent to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative inline-flex mb-7">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4 rounded-2xl bg-white/[0.06] text-blue-400 border border-white/[0.1] transition-all duration-300 group-hover:border-blue-400/40 group-hover:-translate-y-0.5">
              {icon}
            </div>
          </div>

          <h3 className="relative text-xl font-semibold text-white/90 mb-3 tracking-tight transition-colors duration-300 group-hover:text-white">
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
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
        });
      }

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
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-purple-600/25 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-40 h-[500px] w-[700px] rounded-full bg-blue-600/25 blur-[180px]" />

      <div className="min-h-screen relative flex items-center justify-center px-6">
        <div className="gradient-mesh">
          <GradientMesh />
        </div>

        <GridPattern className="text-white" spacing={32} opacity={0.015} />

        <m.div
          ref={heroRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center py-24 relative z-10"
        >
          <div className="min-h-[140px] md:min-h-[160px] flex items-center justify-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
              Showcase Your Buffalo Projects/Business
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-neutral-300 mt-8 mb-14 max-w-2xl mx-auto leading-relaxed">
            Create a professional page for your business or project in minutes.{" "}
            <span className="text-white font-semibold">
              No tech skills needed.
            </span>
          </p>

          <div className="flex flex-col items-center gap-6 mt-10">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push(user ? "/workspace/new" : "/signup")}
              rightIcon={
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              }
              className="group relative h-14 px-10 text-lg shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 border border-white/20 hover:border-white/30"
            >
              Create My Business Page
            </Button>

            <div className="flex items-center gap-3 text-neutral-400 text-sm my-2">
              <span className="w-16 h-px bg-white/10"></span>
              <span>or</span>
              <span className="w-16 h-px bg-white/10"></span>
            </div>

            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm text-neutral-400 mb-3 text-center">
                Have a GitHub project? Import it:
              </p>
              <div className="flex w-full gap-3 items-stretch">
                <input
                  type="text"
                  placeholder="github.com/yourname/project"
                  className="flex-1 h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
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
                  variant="ghost"
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder*="github"]',
                    ) as HTMLInputElement;
                    const value = input?.value?.trim();
                    if (value) {
                      sessionStorage.setItem("quick_import_url", value);
                      router.push(
                        user
                          ? "/workspace/new?import=github"
                          : "/signup?next=/workspace/new?import=github",
                      );
                    }
                  }}
                  className="h-12 px-6 border border-white/10 hover:border-white/20 whitespace-nowrap"
                >
                  Import
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-neutral-500 text-sm mt-8">
            <span className="w-12 h-px bg-white/10"></span>
            <span>or</span>
            <span className="w-12 h-px bg-white/10"></span>
          </div>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push(user ? "/workspace/new" : "/signup")}
            className="px-0 py-0 text-sm font-medium text-neutral-400 hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
          >
            Start from scratch
          </Button>

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
                className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-pink-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-pink-400/40 shadow-lg shadow-black/10"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"
                />

                <div className="text-pink-400 group-hover:text-pink-300 transition-colors">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-neutral-200">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </m.div>
      </div>

      <section
        ref={howItWorksRef}
        className="py-24 md:py-40 px-6 border-t border-neutral-900 relative"
      >
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
            <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl mx-auto">
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
// ...existing code...
