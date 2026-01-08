"use client";

import { m } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { GradientMesh, GridPattern } from "@/components/graphics";
import { Button } from "@/components/unified";
import { ArrowRight, CheckCircle2, Download, Shield, Users, Sparkles } from "@/icons";
import { cleanupGSAP, prefersReducedMotion } from "@/lib/gsap-utils";
import { useAuthStore } from "@/stores/authStore";

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
          className="max-w-5xl mx-auto text-center py-24 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 px-4 py-2 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Buffalo Projects</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
            Your work deserves
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              to be seen
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            You're building something meaningful in Buffalo. Whether it's a business, a side project, or an idea taking shape—
            <span className="text-white font-semibold"> give it a home where people can find it.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push(user ? "/workspace/new" : "/signup")}
              rightIcon={
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              }
              className="group relative h-14 px-10 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 border-0"
            >
              Create Your Page
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push("/dashboard/discover")}
              className="h-14 px-10 text-lg border border-white/20 hover:bg-white/10 text-white"
            >
              See Examples
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Share anywhere</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>No coding needed</span>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-neutral-500 mb-4">Have existing content?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push(user ? "/workspace/new?import=github" : "/signup")}
                className="text-sm text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
              >
                Import from GitHub
              </button>
              <span className="text-neutral-600">•</span>
              <button
                onClick={() => router.push(user ? "/workspace/new?import=file" : "/signup")}
                className="text-sm text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
              >
                Upload a document
              </button>
              <span className="text-neutral-600">•</span>
              <button
                onClick={() => router.push(user ? "/workspace/new?import=url" : "/signup")}
                className="text-sm text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
              >
                Import from URL
              </button>
            </div>
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
              Built for creators,
              <br />
              <span className="text-neutral-400">not corporations</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl mx-auto">
              No complicated forms. No design skills required.{" "}
              <span className="text-white">Just you and your story.</span>
            </p>
          </m.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Start private, share when ready"
              description="Work on your page privately. When it feels right, hit publish and get a link you can share anywhere. No pressure."
              index={0}
            />

            <FeatureCard
              icon={<Download className="w-8 h-8" />}
              title="Bring your existing work"
              description="Already have a GitHub repo, website, or document? Import it and we'll pull out the key details. Your page takes shape in minutes."
              index={1}
            />

            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Join Buffalo's builder community"
              description="See what others are working on. Get feedback. Find collaborators. Buffalo Projects is where the city's makers connect."
              index={2}
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-neutral-900 relative">
        <div className="max-w-4xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Made in Buffalo, for Buffalo
            </h2>
            <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              We're building a home for every project, business, and idea that makes this city special. 
              Your story matters. Let's help you tell it.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push(user ? "/workspace/new" : "/signup")}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="h-14 px-10 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl shadow-blue-500/40"
            >
              Start Your Page
            </Button>
          </m.div>
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