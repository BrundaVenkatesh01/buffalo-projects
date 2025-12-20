"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { Users, Lightbulb, Rocket, TrendingUp, Heart, Zap } from "@/icons";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineEvent {
  id: string;
  phase: string;
  title: string;
  description: string;
  icon: typeof Users;
  color: string;
  glowColor: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "genesis",
    phase: "Genesis",
    title: "The Problem",
    description:
      "Buffalo builders were working in isolation. Great ideas stayed hidden in Google Docs and Notion pages. Mentors wanted to help but didn't know who needed feedback.",
    icon: Lightbulb,
    color: "text-yellow-400",
    glowColor: "rgba(250, 204, 21, 0.3)",
  },
  {
    id: "vision",
    phase: "Vision",
    title: "Build in Public",
    description:
      "What if Buffalo's startup ecosystem worked like open source? Document your journey. Share your pivots. Learn from each other's wins and losses.",
    icon: Zap,
    color: "text-blue-400",
    glowColor: "rgba(96, 165, 250, 0.3)",
  },
  {
    id: "tools",
    phase: "Tools",
    title: "The Workspace",
    description:
      "Business Model Canvas. Pivot tracking. Version history. AI-powered insights. Everything you need to move from idea to launch, all in one place.",
    icon: Rocket,
    color: "text-purple-400",
    glowColor: "rgba(192, 132, 252, 0.3)",
  },
  {
    id: "community",
    phase: "Community",
    title: "Buffalo Mentors",
    description:
      "Experienced founders, investors, and operators ready to give feedback. No cold emails. No gatekeepers. Just builders helping builders.",
    icon: Heart,
    color: "text-red-400",
    glowColor: "rgba(248, 113, 113, 0.3)",
  },
  {
    id: "movement",
    phase: "Movement",
    title: "50 Founding Builders",
    description:
      "We're starting with 50. Students. Founders. Side projects. Full-time startups. All building in public. All learning together. All putting Buffalo on the map.",
    icon: Users,
    color: "text-green-400",
    glowColor: "rgba(74, 222, 128, 0.3)",
  },
  {
    id: "future",
    phase: "Future",
    title: "What's Next",
    description:
      "Gallery launches January 1st, 2026. Real projects. Real pivots. Real progress. Buffalo's startup story, documented one build at a time.",
    icon: TrendingUp,
    color: "text-blue-400",
    glowColor: "rgba(96, 165, 250, 0.3)",
  },
];

export function BuffaloTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Animate the timeline line growing
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        },
      );

      // Animate each timeline event
      eventsRef.current.forEach((event, index) => {
        if (!event) {
          return;
        }

        const isLeft = index % 2 === 0;

        gsap.fromTo(
          event,
          {
            opacity: 0,
            x: isLeft ? -100 : 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: event,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Pulse glow effect on scroll
        const glowElement = event.querySelector(".event-glow");
        if (glowElement) {
          gsap.fromTo(
            glowElement,
            {
              opacity: 0,
              scale: 0.8,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: event,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-24">
      {/* Center vertical line */}
      <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 overflow-hidden bg-white/5">
        <div
          ref={lineRef}
          className="h-full w-full origin-top bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600"
        />
      </div>

      {/* Timeline events */}
      <div className="space-y-24 md:space-y-32">
        {TIMELINE_EVENTS.map((event, index) => {
          const isLeft = index % 2 === 0;
          const Icon = event.icon;

          return (
            <div
              key={event.id}
              ref={(el) => {
                eventsRef.current[index] = el;
              }}
              className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-col items-center gap-8 md:gap-16`}
            >
              {/* Content card */}
              <div
                className={`w-full md:w-[calc(50%-4rem)] ${isLeft ? "md:text-right" : "md:text-left"}`}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div
                    className="event-glow pointer-events-none absolute -inset-8 rounded-3xl blur-3xl"
                    style={{ backgroundColor: event.glowColor }}
                  />

                  {/* Card content */}
                  <div className="relative space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground ${isLeft ? "md:ml-auto" : ""}`}
                    >
                      {event.phase}
                    </div>
                    <h3
                      className={`text-3xl font-bold tracking-tight ${event.color}`}
                    >
                      {event.title}
                    </h3>
                    <p className="text-[17px] leading-relaxed text-muted-foreground/80">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center icon */}
              <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-white/10 to-white/5 shadow-2xl md:absolute md:left-1/2 md:-translate-x-1/2">
                <div
                  className="absolute inset-0 rounded-full opacity-50 blur-xl"
                  style={{ backgroundColor: event.glowColor }}
                />
                <Icon className={`relative h-8 w-8 ${event.color}`} />
              </div>

              {/* Spacer for mobile */}
              <div className="hidden w-full md:block md:w-[calc(50%-4rem)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
