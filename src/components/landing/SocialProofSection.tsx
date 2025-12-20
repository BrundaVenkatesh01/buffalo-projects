"use client";

import React from "react";

import { ScrollReveal } from "@/components/motion";
import { Building2, Users, Zap } from "@/icons";
import { cn } from "@/lib/utils";
import { headingStyles, bodyStyles } from "@/styles/typography";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote:
      "I had a GitHub repo sitting there for months. Made it public in Buffalo Projects—got my first mentor reach-out that week.",
    author: "Alex Rivera",
    role: "Founder, TechStart Buffalo",
  },
  {
    quote:
      "43North judges wanted to see our work. Sent them our Buffalo Projects page. Way better than a slide deck.",
    author: "Jordan Kim",
    role: "43North Finalist",
  },
  {
    quote:
      "Pasted my GitHub URL. AI grabbed everything. Two minutes later I had a page to share with investors.",
    author: "Taylor Chen",
    role: "Student Founder, UB",
  },
];

const ecosystemLogos = [
  { name: "43North", tagline: "Buffalo's startup competition" },
  { name: "StartFast", tagline: "Accelerating WNY startups" },
  { name: "UB", tagline: "University at Buffalo" },
  { name: "Buffalo Niagara", tagline: "Partnership for regional growth" },
];

export function SocialProofSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Stats Bar */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 md:mb-24">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              value="50+"
              label="Builders sharing projects"
            />
            <StatCard
              icon={<Building2 className="w-6 h-6" />}
              value="100+"
              label="Public projects in the gallery"
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              value="2 min"
              label="Average time to go public"
            />
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <h2
              className={cn(
                headingStyles({
                  level: "h2",
                  weight: "medium",
                  align: "center",
                }),
                "text-neutral-200",
              )}
            >
              What builders are saying
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-24">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <TestimonialCard {...testimonial} />
            </ScrollReveal>
          ))}
        </div>

        {/* Ecosystem Logos */}
        <ScrollReveal delay={0.2}>
          <div className="text-center mb-8">
            <p
              className={cn(
                bodyStyles({ variant: "caption", align: "center" }),
                "text-neutral-500 uppercase tracking-wider",
              )}
            >
              Part of the Buffalo ecosystem
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {ecosystemLogos.map((org, index) => (
              <EcosystemLogo key={index} {...org} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mb-4 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-110">
        {icon}
      </div>
      <div
        className={cn(
          headingStyles({ level: "h2", align: "center" }),
          "text-neutral-100 mb-2",
        )}
      >
        {value}
      </div>
      <p
        className={cn(
          bodyStyles({ variant: "base", align: "center" }),
          "text-neutral-500",
        )}
      >
        {label}
      </p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: TestimonialProps) {
  return (
    <div
      className="relative rounded-2xl border border-white/[0.06]
                 bg-gradient-to-b from-white/[0.02] to-transparent
                 backdrop-blur-sm
                 p-6 md:p-8
                 shadow-[0_8px_32px_rgba(0,0,0,0.1)]
                 transition-all duration-500
                 hover:border-white/[0.12]
                 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]
                 hover:scale-[1.02]
                 group"
    >
      {/* Quote mark */}
      <div className="text-blue-500/20 text-5xl font-serif leading-none mb-4 transition-colors group-hover:text-blue-500/30">
        &quot;
      </div>

      {/* Quote */}
      <p
        className={cn(
          bodyStyles({ variant: "base" }),
          "text-neutral-300 mb-6 leading-relaxed transition-colors group-hover:text-neutral-200",
        )}
      >
        {quote}
      </p>

      {/* Author */}
      <div className="border-t border-white/5 pt-4">
        <p
          className={cn(
            bodyStyles({ variant: "base" }),
            "text-neutral-200 font-medium transition-colors group-hover:text-white",
          )}
        >
          {author}
        </p>
        <p
          className={cn(
            bodyStyles({ variant: "caption" }),
            "text-neutral-500 transition-colors group-hover:text-neutral-400",
          )}
        >
          {role}
        </p>
      </div>
    </div>
  );
}

function EcosystemLogo({ name, tagline }: { name: string; tagline: string }) {
  return (
    <div className="group cursor-default">
      <div
        className={cn(
          bodyStyles({ variant: "base" }),
          "text-neutral-400 font-semibold transition-all duration-300 group-hover:text-neutral-200 group-hover:scale-110",
        )}
      >
        {name}
      </div>
      <p
        className={cn(
          bodyStyles({ variant: "caption" }),
          "text-neutral-600 transition-colors group-hover:text-neutral-500",
        )}
      >
        {tagline}
      </p>
    </div>
  );
}
