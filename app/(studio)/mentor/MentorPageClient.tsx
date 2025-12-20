"use client";

import { differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { FilterPanel } from "@/components/mentor/FilterPanel";
import { MentorProjectCard } from "@/components/mentor/MentorProjectCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, Input } from "@/components/unified";
import { usePublicProjects } from "@/hooks/usePublicProjects";
import { cn } from "@/lib/utils";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { useAuthStore } from "@/stores/authStore";
import type { Workspace } from "@/types";

type StageValue = "idea" | "building" | "testing" | "launching";
type SortMode = (typeof SORT_OPTIONS)[number]["id"];

const STAGES: StageValue[] = ["idea", "building", "testing", "launching"];
const SORT_OPTIONS = [
  { id: "fresh", label: "Freshest" },
  { id: "signals", label: "Signals" },
  { id: "asks", label: "Has asks" },
] as const;

const isBuffaloProject = (project: Workspace): boolean => {
  if (project.buffaloAffiliated) {
    return true;
  }
  return project.location === "buffalo";
};

const projectHasAsks = (project: Workspace): boolean => {
  const legacyAsks = (project as unknown as { asks?: unknown }).asks;
  if (Array.isArray(legacyAsks) && legacyAsks.length > 0) {
    return true;
  }
  return (
    project.contextNotes?.some((note) => note.category === "resource") ?? false
  );
};

export default function MentorPageClient() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loadingUser = useAuthStore((state) => state.loading);

  const { projects, loading, error, hasMore, loadingMore, refresh, loadMore } =
    usePublicProjects({ limit: 20 });

  const [stageSelections, setStageSelections] = useState<
    Record<StageValue, boolean>
  >({
    idea: true,
    building: true,
    testing: true,
    launching: true,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasAsksOnly, setHasAsksOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);
  const [buffaloOnly, setBuffaloOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shortlist, setShortlist] = useState<Set<string>>(new Set());
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "shortlist">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("fresh");

  useEffect(() => {
    if (!loadingUser && (!user || !user.isMentor)) {
      router.replace("/profile");
    }
  }, [loadingUser, router, user]);

  useEffect(() => {
    if (!user?.uid) {
      setShortlist(new Set());
      return;
    }

    let isMounted = true;
    setLoadingShortlist(true);
    void firebaseDatabase
      .getShortlistedProjects(user.uid)
      .then((entries) => {
        if (!isMounted) {
          return;
        }
        setShortlist(new Set(entries));
      })
      .finally(() => {
        if (isMounted) {
          setLoadingShortlist(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((project) => {
      (project.tags ?? []).forEach((tag) => {
        if (tag.trim().length > 0) {
          tagSet.add(tag.trim());
        }
      });
    });
    return Array.from(tagSet);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const activeStages = STAGES.filter((stage) => stageSelections[stage]);
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const defaultSort = (a: Workspace, b: Workspace) => {
      const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return bDate - aDate;
    };

    return projects
      .filter((project) => {
        if (
          activeStages.length > 0 &&
          project.stage &&
          !activeStages.includes(project.stage as StageValue)
        ) {
          return false;
        }

        if (selectedTags.length > 0) {
          const projectTags = project.tags ?? [];
          const matchesTag = selectedTags.some((tag) =>
            projectTags.includes(tag),
          );
          if (!matchesTag) {
            return false;
          }
        }

        if (hasAsksOnly && !projectHasAsks(project)) {
          return false;
        }

        if (recentOnly) {
          const lastModified = project.lastModified
            ? new Date(project.lastModified)
            : null;
          if (!lastModified) {
            return false;
          }
          const daysAgo = differenceInCalendarDays(new Date(), lastModified);
          if (Number.isNaN(daysAgo) || daysAgo > 7) {
            return false;
          }
        }

        if (buffaloOnly && !isBuffaloProject(project)) {
          return false;
        }

        if (normalizedQuery.length > 0) {
          const haystack = [
            project.projectName,
            project.description,
            project.projectDescription,
            ...(project.tags ?? []),
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(normalizedQuery)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortMode === "signals") {
          const diff = getSignalScore(b) - getSignalScore(a);
          if (diff !== 0) {
            return diff;
          }
          return defaultSort(a, b);
        }

        if (sortMode === "asks") {
          const aHasAsk = projectHasAsks(a) ? 1 : 0;
          const bHasAsk = projectHasAsks(b) ? 1 : 0;
          if (aHasAsk !== bHasAsk) {
            return bHasAsk - aHasAsk;
          }
          return defaultSort(a, b);
        }

        return defaultSort(a, b);
      });
  }, [
    projects,
    stageSelections,
    selectedTags,
    hasAsksOnly,
    recentOnly,
    buffaloOnly,
    searchQuery,
    sortMode,
  ]);

  const handleStageToggle = useCallback((stage: StageValue, next: boolean) => {
    setStageSelections((prev) => ({
      ...prev,
      [stage]: next,
    }));
  }, []);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((previous) => {
      if (previous.includes(tag)) {
        return previous.filter((existing) => existing !== tag);
      }
      return [...previous, tag];
    });
  }, []);

  const handleClearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const handleHasAsksChange = useCallback((next: boolean) => {
    setHasAsksOnly(next);
  }, []);

  const handleRecentChange = useCallback((next: boolean) => {
    setRecentOnly(next);
  }, []);

  const handleBuffaloChange = useCallback((next: boolean) => {
    setBuffaloOnly(next);
  }, []);

  const handleResetFilters = useCallback(() => {
    setStageSelections({
      idea: true,
      building: true,
      testing: true,
      launching: true,
    });
    setSelectedTags([]);
    setHasAsksOnly(false);
    setRecentOnly(false);
    setBuffaloOnly(false);
    setSearchQuery("");
    setSortMode("fresh");
  }, []);

  const handleToggleShortlist = async (projectCode: string, next: boolean) => {
    if (!user?.uid) {
      router.push("/signin?redirect=/mentor");
      return;
    }

    const previous = new Set(shortlist);
    const nextSet = new Set(shortlist);
    if (next) {
      nextSet.add(projectCode);
    } else {
      nextSet.delete(projectCode);
    }
    setShortlist(nextSet);

    try {
      if (next) {
        await firebaseDatabase.addProjectToShortlist(projectCode, user.uid);
        toast.success("Project shortlisted");
      } else {
        await firebaseDatabase.removeProjectFromShortlist(
          projectCode,
          user.uid,
        );
        toast.success("Project removed from shortlist");
      }
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "Unable to update shortlist";
      toast.error(reason);
      setShortlist(previous);
    }
  };

  const shortlistProjects = useMemo(
    () => filteredProjects.filter((project) => shortlist.has(project.code)),
    [filteredProjects, shortlist],
  );

  const projectsToRender =
    activeTab === "shortlist" ? shortlistProjects : filteredProjects;

  const showEmptyState = !loading && projectsToRender.length === 0;

  if (!user?.isMentor) {
    return (
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">
          Mentor tools are locked
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Toggle mentor mode in your profile to access the mentor dashboard and
          triage Buffalo projects.
        </p>
        <Button
          className="rounded-full px-5 text-xs uppercase tracking-[0.24em]"
          onClick={() => {
            router.push("/profile");
          }}
        >
          Update profile
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 lg:flex-row lg:items-center lg:px-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Mentor Mode
            </p>
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">
              Help Buffalo builders ship faster
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Filter by stage, freshness, asks, and tags to find projects where
              your expertise has the most impact. Shortlist teams to revisit or
              introduce to your network.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 lg:w-auto lg:justify-end">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (value === "all" || value === "shortlist") {
                  setActiveTab(value);
                }
              }}
              className="flex-1 lg:flex-none"
            >
              <TabsList className="grid h-10 w-full grid-cols-2 rounded-full bg-white/10 p-1 lg:w-auto">
                <TabsTrigger
                  value="all"
                  className="rounded-full text-xs uppercase tracking-[0.24em]"
                >
                  All projects
                </TabsTrigger>
                <TabsTrigger
                  value="shortlist"
                  className="rounded-full text-xs uppercase tracking-[0.24em]"
                >
                  Shortlist
                  {shortlist.size > 0 ? (
                    <span className="ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-primary/80 px-1 text-[10px] text-primary-foreground">
                      {shortlist.size}
                    </span>
                  ) : null}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                onClick={() => {
                  void refresh();
                }}
              >
                Refresh feed
              </Button>
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full px-4 text-xs uppercase tracking-[0.24em]">
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[420px] max-w-full overflow-y-auto bg-[#0b0d0f]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left text-base text-foreground">
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    stageSelections={stageSelections}
                    onStageToggle={handleStageToggle}
                    tags={availableTags}
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                    onClearTags={handleClearTags}
                    hasAsksOnly={hasAsksOnly}
                    onHasAsksChange={handleHasAsksChange}
                    recentOnly={recentOnly}
                    onRecentChange={handleRecentChange}
                    buffaloOnly={buffaloOnly}
                    onBuffaloChange={handleBuffaloChange}
                    onResetFilters={handleResetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <Input
              label="Search projects"
              placeholder="Search by name, tags, or description"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Sort
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSortMode(option.id)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition",
                      sortMode === option.id
                        ? "border-white/80 bg-white/15 text-white"
                        : "border-white/10 text-muted-foreground hover:border-white/25",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={`mentor-skeleton-${index}`}
                className="h-[320px] rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : null}

        {showEmptyState ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center">
            <h2 className="font-display text-2xl text-foreground">
              {activeTab === "shortlist"
                ? "Your shortlist is empty"
                : "No projects match these filters yet"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === "shortlist"
                ? "Shortlist projects to revisit them quickly. Tap the bookmark icon on any project to add it here."
                : "Adjust your filters, or refresh the feed to see new projects as builders publish updates."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {activeTab === "shortlist" ? (
                <Button
                  className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                  onClick={() => {
                    setActiveTab("all");
                  }}
                >
                  Browse all projects
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                    onClick={handleResetFilters}
                  >
                    Reset filters
                  </Button>
                  <Button
                    className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                    onClick={() => {
                      void refresh();
                    }}
                  >
                    Refresh feed
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : null}

        {!loading && projectsToRender.length > 0 ? (
          <div className="space-y-12">
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {projectsToRender.map((project) => (
                <MentorProjectCard
                  key={project.code}
                  project={project}
                  shortlisted={shortlist.has(project.code)}
                  onToggleShortlist={(projectCode, next) => {
                    if (loadingShortlist) {
                      return;
                    }
                    void handleToggleShortlist(projectCode, next);
                  }}
                />
              ))}
            </div>
            {hasMore ? (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  className="rounded-full px-6 text-xs uppercase tracking-[0.24em]"
                  onClick={() => {
                    void loadMore();
                  }}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more projects"}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getSignalScore(project: Workspace): number {
  const comments = project.commentCount ?? 0;
  const pivots = project.pivots?.length ?? 0;
  const updates = project.updates?.length ?? 0;
  return comments * 2 + pivots + updates;
}
