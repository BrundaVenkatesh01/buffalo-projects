"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/unified";
import { Calendar, Clock, Mail, Trophy } from "@/icons";
import { headingStyles, bodyStyles } from "@/styles/typography";

const SEASONS = [
  {
    title: "Season 01 — Winter Sprint",
    timeframe: "January 6 – February 28",
    focus: "Make Buffalo's projects visible and reviewable.",
    checkpoints: [
      "Publish public project page",
      "Document first proof artifact",
      "Collect two mentor reviews",
    ],
  },
  {
    title: "Season 02 — Mentor Residency",
    timeframe: "March 10 – April 30",
    focus: "Structured mentor pairings and rapid signal loops.",
    checkpoints: [
      "Weekly mentor sync",
      "Prototype or pilot launch",
      "Share digests to public gallery",
    ],
  },
] as const;

const RITUALS = [
  {
    name: "Monday Standup",
    detail: "Asynchronous update posted to gallery card by noon ET.",
  },
  {
    name: "Midweek Micro-Review",
    detail: "Mentor or peer leaves a structured comment using prompt tags.",
  },
  {
    name: "Friday Demo Tape",
    detail: "Ship a 90-second loom or screenshot to document progress.",
  },
] as const;

export function ProgramsScreen() {
  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-white/5 bg-gradient-to-b from-black via-black to-black/60 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">
            Programs
          </p>
          <h1 className={headingStyles({ level: "h1", weight: "bold" })}>
            Seasons, not sprints
          </h1>
          <p className={bodyStyles({ variant: "lead" })}>
            Each season has a clear mission, checkpoints, and rituals so mentors
            and builders stay in sync. Publish once, earn reviews all season.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full px-6"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Apply to Season 01
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full px-6"
              onClick={() => {
                window.open("mailto:hello@buffaloprojects.com", "_blank");
              }}
              leftIcon={<Mail className="h-4 w-4" />}
            >
              Nominate a mentor
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {SEASONS.map((season) => (
            <Card
              key={season.title}
              className="border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20"
                  >
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {season.timeframe}
                  </Badge>
                  <CardTitle className="mt-3 text-3xl text-foreground">
                    {season.title}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {season.focus}
                  </CardDescription>
                </div>
                <Button className="rounded-full px-4" variant="secondary">
                  Get reminders
                </Button>
              </div>
              <CardContent className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-muted-foreground">
                {season.checkpoints.map((checkpoint) => (
                  <div key={checkpoint} className="flex items-start gap-3">
                    <Trophy className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{checkpoint}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card className="border-white/10 bg-white/[0.02] p-6">
            <CardHeader>
              <CardTitle className="text-2xl">Weekly rituals</CardTitle>
              <CardDescription>
                Light structure so progress never goes dark
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {RITUALS.map((ritual) => (
                <div
                  key={ritual.name}
                  className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {ritual.name}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ritual.detail}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
