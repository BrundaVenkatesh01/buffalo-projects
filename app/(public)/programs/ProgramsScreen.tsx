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
import { Calendar, Clock, Mail, Trophy, Sparkles, Zap, Target } from "@/icons";
// import { headingStyles, bodyStyles } from "@/styles/typography";

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
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    iconBg: "from-blue-500/20 to-cyan-500/20",
    badgeBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
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
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    iconBg: "from-purple-500/20 to-pink-500/20",
    badgeBg: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
] as const;

const RITUALS = [
  {
    name: "Monday Standup",
    detail: "Asynchronous update posted to gallery card by noon ET.",
    icon: Target,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Midweek Micro-Review",
    detail: "Mentor or peer leaves a structured comment using prompt tags.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Friday Demo Tape",
    detail: "Ship a 90-second loom or screenshot to document progress.",
    icon: Zap,
    gradient: "from-orange-500 to-red-500",
  },
] as const;

export function ProgramsScreen() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="relative border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
              Programs
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Seasons, not sprints
          </h1>

          <p className="text-lg md:text-xl text-neutral-200 max-w-3xl leading-relaxed">
            Each season has a clear mission, checkpoints, and rituals so mentors
            and builders stay in sync. Publish once, earn reviews all season.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-base font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/50 border-0"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Apply to Season 01
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-14 text-base font-semibold border-white/20 hover:bg-white/10 text-white"
              onClick={() => {
                window.open("mailto:hello@buffaloprojects.com", "_blank");
              }}
              leftIcon={<Mail className="h-5 w-5" />}
            >
              Nominate a mentor
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {SEASONS.map((season, _index) => (
            <Card
              key={season.title}
              className="relative border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-8 overflow-hidden group hover:border-white/30 transition-all duration-300"
            >
              <div
                className={`absolute inset-0 opacity-10 bg-gradient-to-br ${season.gradient}`}
              />
              <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${season.iconBg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                  <div className="flex-1 space-y-4">
                    <Badge
                      className={`rounded-full ${season.badgeBg} text-white border-0 px-4 py-1.5 shadow-lg font-semibold`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {season.timeframe}
                    </Badge>

                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {season.title}
                    </h2>

                    <p className="text-base md:text-lg text-neutral-300">
                      {season.focus}
                    </p>
                  </div>

                  <Button
                    className="rounded-full px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold backdrop-blur-sm"
                    variant="secondary"
                  >
                    Get reminders
                  </Button>
                </div>

                <CardContent className="mt-6 space-y-3 rounded-2xl border border-white/20 bg-black/30 backdrop-blur-sm p-6">
                  {season.checkpoints.map((checkpoint) => (
                    <div
                      key={checkpoint}
                      className="flex items-start gap-4 group/item"
                    >
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${season.gradient} shadow-lg`}
                      >
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-base text-neutral-200 group-hover/item:text-white transition-colors">
                        {checkpoint}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </div>
            </Card>
          ))}

          <Card className="relative border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500" />

            <CardHeader className="relative z-10 p-0 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  Weekly rituals
                </CardTitle>
              </div>
              <CardDescription className="text-base text-neutral-300">
                Light structure so progress never goes dark
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 p-0 grid gap-6 md:grid-cols-3">
              {RITUALS.map((ritual) => {
                const Icon = ritual.icon;
                return (
                  <div
                    key={ritual.name}
                    className="group space-y-4 rounded-2xl border border-white/20 bg-black/30 backdrop-blur-sm p-6 hover:bg-black/40 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${ritual.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300 group-hover:text-white transition-colors`}
                      >
                        {ritual.name}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed group-hover:text-neutral-200 transition-colors">
                      {ritual.detail}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
