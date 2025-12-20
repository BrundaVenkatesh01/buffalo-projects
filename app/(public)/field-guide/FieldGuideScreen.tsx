"use client";

import Link from "next/link";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/unified";
import { BookOpen, Download, Lightbulb, Target } from "@/icons";
import { headingStyles, bodyStyles } from "@/styles/typography";

const GUIDE_SECTIONS = [
  {
    title: "Launch Playbooks",
    description: "Battle-tested templates for telling your story clearly.",
    icon: BookOpen,
    resources: [
      {
        title: "Public Launch Checklist",
        summary: "30 must-have tasks before you share in the gallery.",
        href: "/docs/launch-checklist.pdf",
      },
      {
        title: "Lightweight PR FAQ",
        summary: "Five questions every Buffalo founder should answer early.",
        href: "/docs/pr-faq-template.pdf",
      },
    ],
  },
  {
    title: "Proof Hubs",
    description:
      "Show traction with screenshots, journal entries, or data drops.",
    icon: Target,
    resources: [
      {
        title: "Evidence Log Template",
        summary: "Structured doc for adding proof to your public page.",
        href: "/docs/evidence-log-template.pdf",
      },
      {
        title: "Buffalo Partner Directory",
        summary: "Mentors, labs, and community partners ready to review proof.",
        href: "/resources",
      },
    ],
  },
  {
    title: "Funding Pathways",
    description: "Keep Buffalo founders close to capital without fluff.",
    icon: Lightbulb,
    resources: [
      {
        title: "Grant + Program Tracker",
        summary: "Local grants, state incentives, and national accelerators.",
        href: "/docs/grant-tracker.xlsx",
      },
      {
        title: "Investor Update Outline",
        summary: "One doc for monthly updates and ask alignment.",
        href: "/docs/investor-update-template.pdf",
      },
    ],
  },
] as const;

export function FieldGuideScreen() {
  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-white/5 bg-gradient-to-b from-black via-black to-black/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">
              Field Guide
            </p>
            <h1 className={headingStyles({ level: "h1", weight: "bold" })}>
              Systems, not inspiration
            </h1>
            <p className={bodyStyles({ variant: "lead" })}>
              Every section is built from Buffalo founders shipping in public.
              Use these playbooks to ship faster and keep your gallery page
              fresh.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full px-6"
              onClick={() => {
                window.open("mailto:hello@buffaloprojects.com", "_blank");
              }}
            >
              Request a custom teardown
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-6"
              onClick={() => {
                window.location.href = "/gallery";
              }}
            >
              See projects using it
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {GUIDE_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className="border-white/10 bg-white/[0.02] p-8"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  {section.title}
                </div>
                <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <h2 className="font-display text-3xl">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.resources.map((resource) => (
                      <Card
                        key={resource.title}
                        variant="interactive"
                        className="p-5"
                      >
                        <CardHeader className="mb-2">
                          <CardTitle className="text-xl">
                            {resource.title}
                          </CardTitle>
                          <CardDescription>{resource.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between p-0 pt-4 text-sm text-muted-foreground">
                          <Link
                            href={resource.href}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Link>
                          <Badge
                            variant="outline"
                            className="rounded-full border-white/20"
                          >
                            PDF / Doc
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
