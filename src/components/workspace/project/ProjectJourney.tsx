"use client";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { m } from "framer-motion";
import { nanoid } from "nanoid";
import { useState, useMemo } from "react";

import { Stack } from "@/components/layout";
import { Button, Badge, WORKSPACE_SURFACE, PIVOT } from "@/components/unified";
import {
  Plus,
  Link as LinkIcon,
  BookOpen,
  X,
  TrendingUp,
  TrendingDown,
  Zap,
  Flag,
  ArrowRight,
} from "@/icons";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { FONT_SIZES } from "@/tokens/primitives/typography";
import type { JournalEntry, Pivot } from "@/types";

const PIVOT_ICONS = {
  minor: TrendingDown,
  major: TrendingUp,
  complete: Zap,
} as const;

const PIVOT_LABELS = {
  minor: "Minor Pivot",
  major: "Major Pivot",
  complete: "Complete Pivot",
} as const;

type TimelineEvent =
  | { type: "journal"; data: JournalEntry; timestamp: string }
  | { type: "pivot"; data: Pivot; timestamp: string }
  | { type: "start"; timestamp: string };

export function ProjectJourney() {
  const { currentWorkspace, updateWorkspace } = useWorkspaceStore();
  const [newEntry, setNewEntry] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const journal = useMemo(
    () => currentWorkspace?.journal ?? [],
    [currentWorkspace?.journal],
  );
  const pivots = useMemo(
    () => currentWorkspace?.pivots ?? [],
    [currentWorkspace?.pivots],
  );
  const versions = currentWorkspace?.versions || [];
  const latestVersion = versions[versions.length - 1];

  // Combine journal and pivots into unified timeline
  const timeline = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add journal entries
    journal.forEach((entry) => {
      events.push({ type: "journal", data: entry, timestamp: entry.timestamp });
    });

    // Add pivots
    pivots.forEach((pivot) => {
      events.push({ type: "pivot", data: pivot, timestamp: pivot.date });
    });

    // Add project start marker
    if (currentWorkspace?.createdAt) {
      events.push({ type: "start", timestamp: currentWorkspace.createdAt });
    }

    // Sort by timestamp descending (newest first)
    return events.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [journal, pivots, currentWorkspace?.createdAt]);

  const handleAddEntry = () => {
    if (!newEntry.trim()) {
      return;
    }

    const entry: JournalEntry = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      content: newEntry,
      ...(latestVersion?.id ? { linkedVersion: latestVersion.id } : {}),
    };

    updateWorkspace({
      journal: [...journal, entry],
    });

    setNewEntry("");
    setIsAdding(false);
  };

  const getVersionSnapshot = (versionId?: string) => {
    if (!versionId) {
      return null;
    }
    return versions.find((version) => version.id === versionId);
  };

  const formatFieldName = (field: string): string =>
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

  // Calculate stats
  const stats = {
    totalEvents: journal.length + pivots.length,
    journalEntries: journal.length,
    totalPivots: pivots.length,
    majorPivots: pivots.filter(
      (p) => p.magnitude === "major" || p.magnitude === "complete",
    ).length,
  };

  return (
    <div className="w-full">
      <Stack gap="lg">
        {/* Header Section - Compact */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Project Journey
            </h2>
            {stats.totalEvents > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {stats.totalEvents} events · {stats.journalEntries} journal ·{" "}
                {stats.totalPivots} pivots
                {stats.majorPivots > 0 && ` · ${stats.majorPivots} major`}
              </p>
            )}
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Entry
            </Button>
          )}
        </div>

        {/* New Entry Form */}
        {isAdding && (
          <div
            className="relative overflow-hidden rounded-2xl border p-8 shadow-lg"
            style={{
              borderColor: WORKSPACE_SURFACE.subtle.border,
              background:
                "linear-gradient(to bottom right, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent opacity-60" />

            <div className="relative">
              <Stack gap="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      New Journal Entry
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Capture this moment in your project&apos;s journey
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewEntry("");
                    }}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="What are you learning? What insights emerged from customer conversations? What decisions did you make? Document the key moments as they happen..."
                  rows={8}
                  className={cn(
                    "w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3",
                    "text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40",
                    "focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "transition-all duration-200",
                  )}
                  style={{
                    borderColor: WORKSPACE_SURFACE.subtle.border,
                  }}
                  autoFocus
                />

                {latestVersion && (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
                    <LinkIcon className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Linked to Version
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {latestVersion.snapshot}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-muted-foreground">
                    {newEntry.trim().length} character
                    {newEntry.trim().length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsAdding(false);
                        setNewEntry("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="md"
                      onClick={handleAddEntry}
                      disabled={!newEntry.trim()}
                    >
                      Save Entry
                    </Button>
                  </div>
                </div>
              </Stack>
            </div>
          </div>
        )}

        {/* Empty State */}
        {timeline.length === 0 ? (
          <div
            className="relative overflow-hidden rounded-2xl border p-16 text-center shadow-lg"
            style={{
              borderColor: WORKSPACE_SURFACE.subtle.border,
              background:
                "linear-gradient(to bottom right, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))",
            }}
          >
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 shadow-lg shadow-primary/20">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Start Your Journey
              </h3>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
                Document pivots, customer interviews, and breakthrough moments.
                Your journey becomes a powerful record of how your project
                evolved.
              </p>
              <Button
                onClick={() => setIsAdding(true)}
                size="lg"
                leftIcon={<Plus />}
              >
                Create First Entry
              </Button>
            </m.div>
          </div>
        ) : (
          /* Unified Timeline - Proper vertical timeline design */
          <div className="relative pl-8">
            {/* Vertical timeline line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent"
              style={{ left: "15px" }}
            />

            <div className="space-y-12">
              {timeline.map((event, index) => {
                const isRecent = index === 0 && event.type !== "start";

                // Journal Entry
                if (event.type === "journal") {
                  const entry = event.data;
                  const linkedVersion = getVersionSnapshot(entry.linkedVersion);
                  const entryDate = parseISO(entry.timestamp);

                  return (
                    <m.div
                      key={`journal-${entry.id}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: Math.min(index * 0.08, 0.4),
                      }}
                      className="relative"
                    >
                      {/* Timeline node */}
                      <div
                        className={cn(
                          "absolute -left-8 top-8 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#0a0a0a]",
                          isRecent
                            ? "bg-primary shadow-lg shadow-primary/50"
                            : "bg-white/20",
                        )}
                      >
                        <BookOpen
                          className={cn(
                            "h-4 w-4",
                            isRecent ? "text-white" : "text-muted-foreground",
                          )}
                        />
                      </div>

                      <div
                        className={cn(
                          "relative overflow-hidden rounded-2xl border p-6 transition-all duration-200",
                          isRecent
                            ? "border-primary/30 bg-gradient-to-br from-primary/[0.08] to-white/[0.02] shadow-xl shadow-primary/10"
                            : "border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-white/20",
                        )}
                      >
                        <Stack gap="md">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-base font-bold text-foreground">
                                {format(entryDate, "EEEE, MMMM d, yyyy")}
                              </p>
                              <p
                                className="mt-1 uppercase tracking-wider text-muted-foreground"
                                style={{ fontSize: FONT_SIZES.xs }}
                              >
                                {format(entryDate, "h:mm a")} •{" "}
                                {formatDistanceToNow(entryDate, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            {isRecent && (
                              <Badge
                                variant="default"
                                className="shadow-md"
                                style={{ fontSize: FONT_SIZES.xs }}
                              >
                                Latest
                              </Badge>
                            )}
                          </div>

                          {/* Content */}
                          <div
                            className="rounded-lg border bg-white/[0.02] p-5"
                            style={{
                              borderColor: WORKSPACE_SURFACE.subtle.border,
                            }}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                              {entry.content}
                            </p>
                          </div>

                          {/* Version link */}
                          {linkedVersion && (
                            <div className="flex items-center gap-2">
                              <LinkIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">
                                Linked to{" "}
                                <span className="font-semibold text-primary">
                                  {linkedVersion.snapshot}
                                </span>
                              </span>
                            </div>
                          )}
                        </Stack>
                      </div>
                    </m.div>
                  );
                }

                // Pivot Event - Prominent design
                if (event.type === "pivot") {
                  const pivot = event.data;
                  const pivotDate = parseISO(pivot.date);
                  const PivotIcon = PIVOT_ICONS[pivot.magnitude];
                  const pivotColors = PIVOT[pivot.magnitude];
                  const fromVersion = getVersionSnapshot(pivot.fromVersion);
                  const toVersion = getVersionSnapshot(pivot.toVersion);

                  return (
                    <m.div
                      key={`pivot-${pivot.id}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: Math.min(index * 0.08, 0.4),
                      }}
                      className="relative"
                    >
                      {/* Prominent timeline node for pivots */}
                      <div
                        className="absolute -left-8 top-8 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#0a0a0a] shadow-xl"
                        style={{
                          backgroundColor: pivotColors.node,
                          boxShadow: `0 0 20px ${pivotColors.node}`,
                        }}
                      >
                        <PivotIcon className="h-4 w-4 text-white" />
                      </div>

                      <div
                        className="relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl transition-all duration-200 hover:shadow-2xl"
                        style={{
                          borderColor: pivotColors.border,
                          background: `linear-gradient(135deg, ${pivotColors.background}, rgba(255, 255, 255, 0.01))`,
                        }}
                      >
                        <Stack gap="lg">
                          {/* Header with pivot type badge */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-2 flex items-center gap-3">
                                <Badge
                                  className="text-sm font-bold uppercase tracking-wider"
                                  style={{
                                    backgroundColor: pivotColors.background,
                                    borderColor: pivotColors.border,
                                    color: pivotColors.text,
                                  }}
                                >
                                  <PivotIcon className="mr-2 h-4 w-4" />
                                  {PIVOT_LABELS[pivot.magnitude]}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  style={{
                                    borderColor: pivotColors.border,
                                    color: pivotColors.text,
                                  }}
                                >
                                  {pivot.fields.length} field
                                  {pivot.fields.length !== 1 ? "s" : ""} changed
                                </Badge>
                              </div>
                              <p className="text-base font-bold text-foreground">
                                {format(pivotDate, "EEEE, MMMM d, yyyy")}
                              </p>
                              <p
                                className="mt-1 uppercase tracking-wider text-muted-foreground"
                                style={{ fontSize: FONT_SIZES.xs }}
                              >
                                {format(pivotDate, "h:mm a")}
                              </p>
                            </div>
                          </div>

                          {/* Version transition */}
                          <div
                            className="flex items-center gap-4 rounded-lg border bg-white/[0.03] p-4"
                            style={{ borderColor: pivotColors.border }}
                          >
                            <div className="flex-1 text-center">
                              <p
                                className="uppercase tracking-wider text-muted-foreground"
                                style={{ fontSize: FONT_SIZES.xs }}
                              >
                                From
                              </p>
                              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                                {fromVersion?.snapshot || "?"}
                              </p>
                            </div>
                            <ArrowRight
                              className="h-6 w-6 flex-shrink-0"
                              style={{ color: pivotColors.text }}
                            />
                            <div className="flex-1 text-center">
                              <p
                                className="uppercase tracking-wider text-muted-foreground"
                                style={{ fontSize: FONT_SIZES.xs }}
                              >
                                To
                              </p>
                              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                                {toVersion?.snapshot || "?"}
                              </p>
                            </div>
                          </div>

                          {/* Fields changed */}
                          <div>
                            <p
                              className="mb-3 uppercase tracking-wider text-muted-foreground"
                              style={{ fontSize: FONT_SIZES.xs }}
                            >
                              Canvas Blocks Changed
                            </p>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                              {pivot.fields.map((field) => (
                                <div
                                  key={field}
                                  className="rounded-lg border bg-white/5 px-3 py-2 text-sm font-medium text-foreground"
                                  style={{ borderColor: pivotColors.border }}
                                >
                                  {formatFieldName(field)}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          {pivot.userNotes && (
                            <div
                              className="rounded-lg border bg-white/[0.02] p-5"
                              style={{
                                borderColor: WORKSPACE_SURFACE.subtle.border,
                              }}
                            >
                              <p
                                className="mb-2 text-xs font-bold uppercase tracking-wider"
                                style={{ color: pivotColors.text }}
                              >
                                Notes
                              </p>
                              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                                {pivot.userNotes}
                              </p>
                            </div>
                          )}
                        </Stack>
                      </div>
                    </m.div>
                  );
                }

                // Project Start Marker
                if (event.type === "start") {
                  const startDate = parseISO(event.timestamp);

                  return (
                    <div key="project-start" className="relative">
                      {/* Start marker node */}
                      <div className="absolute -left-8 top-6 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#0a0a0a] bg-emerald-500 shadow-lg shadow-emerald-500/50">
                        <Flag className="h-4 w-4 text-white" />
                      </div>

                      <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-white/[0.01] p-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-base font-bold text-emerald-500">
                              Project Started
                            </p>
                            <p
                              className="mt-1 uppercase tracking-wider text-muted-foreground"
                              style={{ fontSize: FONT_SIZES.xs }}
                            >
                              {format(startDate, "MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )}
      </Stack>
    </div>
  );
}
