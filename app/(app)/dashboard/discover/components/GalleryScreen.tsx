"use client";

import type { DocumentSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";

import { FilterBar } from "./FilterBar";
import { MatchesSection } from "./MatchesSection";

import { ProjectCardGallery } from "@/components/projects/ProjectCardGallery";
import { Badge, Button } from "@/components/unified";
import { Loader2, Plus, Rocket } from "@/icons";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { calculateMatches, type Match } from "@/services/matchingService";
import { useAuthStore } from "@/stores/authStore";
import { useGalleryStore } from "@/stores/galleryStore";
import type { ProjectCategory, Workspace } from "@/types";

/**
 * GalleryScreen - Cold start optimized discovery
 *
 * Designed for early stage with few projects:
 * - "Early Access" messaging creates urgency
 * - 2-column grid feels fuller
 * - Prominent "Share your project" CTA
 * - Coming soon features to show momentum
 */
export function GalleryScreen() {
  const { filters, sortBy } = useGalleryStore();
  const { user } = useAuthStore();

  // Pagination state
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Matching state
  const [userAsks, setUserAsks] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const prevFiltersRef = useRef({
    category: filters.category,
    location: filters.location,
  });

  // Fetch workspaces with pagination
  const fetchWorkspaces = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const serverFilters: {
          limit: number;
          orderBy: "publishedAt" | "lastModified";
          orderDirection: "asc" | "desc";
          category?: ProjectCategory;
          location?: "buffalo" | "remote";
          buffaloAffiliated?: boolean;
          startAfter?: DocumentSnapshot;
        } = {
          limit: 20,
          orderBy: sortBy === "recent" ? "publishedAt" : "lastModified",
          orderDirection: "desc",
        };

        if (filters.category && filters.category !== "all") {
          serverFilters.category = filters.category;
        }

        if (filters.location && filters.location !== "all") {
          if (filters.location === "buffalo") {
            serverFilters.buffaloAffiliated = true;
          } else if (filters.location === "remote") {
            serverFilters.location = "remote";
          }
        }

        if (!reset && cursor) {
          serverFilters.startAfter = cursor;
        }

        const result =
          await firebaseDatabase.getPublicWorkspacesPage(serverFilters);

        if (reset) {
          setAllWorkspaces(result.workspaces);
        } else {
          setAllWorkspaces((prev) => [...prev, ...result.workspaces]);
        }

        setHasMore(result.hasMore);
        setCursor(result.cursor || null);
      } catch (err) {
        console.error("Failed to fetch public workspaces:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [cursor, filters.category, filters.location, sortBy],
  );

  // Initial load
  useEffect(() => {
    void fetchWorkspaces(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user's asks from their workspaces for matching
  useEffect(() => {
    async function fetchUserAsks() {
      if (!user?.uid) {
        setUserAsks([]);
        return;
      }

      try {
        const userWorkspaces = await firebaseDatabase.getUserWorkspaces(
          user.uid,
        );
        // Aggregate all unique asks from user's projects
        const allAsks = userWorkspaces
          .flatMap((w) => w.asks || [])
          .filter((ask, index, self) => self.indexOf(ask) === index);
        setUserAsks(allAsks);
      } catch (err) {
        console.error("Failed to fetch user asks:", err);
      }
    }

    void fetchUserAsks();
  }, [user?.uid]);

  // Calculate matches when userAsks or allWorkspaces change
  useEffect(() => {
    if (userAsks.length > 0 && allWorkspaces.length > 0) {
      // Filter out user's own projects from matches
      const otherProjects = allWorkspaces.filter(
        (w) => w.ownerId !== user?.uid,
      );
      const calculatedMatches = calculateMatches(userAsks, otherProjects);
      setMatches(calculatedMatches);
    } else {
      setMatches([]);
    }
  }, [userAsks, allWorkspaces, user?.uid]);

  // Reset when filters change
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.category !== filters.category ||
      prevFiltersRef.current.location !== filters.location;

    if (filtersChanged) {
      prevFiltersRef.current = {
        category: filters.category,
        location: filters.location,
      };
      setCursor(null);
      void fetchWorkspaces(true);
    }
  }, [filters.category, filters.location, fetchWorkspaces]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      void fetchWorkspaces(false);
    }
  }, [loadingMore, loading, hasMore, fetchWorkspaces]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  // Client-side filtering
  const filteredWorkspaces = useMemo(() => {
    let result = [...allWorkspaces];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.projectName.toLowerCase().includes(query) ||
          w.oneLiner?.toLowerCase().includes(query) ||
          w.creator?.toLowerCase().includes(query),
      );
    }

    if (filters.category !== "all") {
      result = result.filter((w) => w.category === filters.category);
    }

    if (filters.stages.length > 0) {
      result = result.filter(
        (w) => w.stage && filters.stages.includes(w.stage),
      );
    }

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });
    }

    return result;
  }, [allWorkspaces, filters, sortBy]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const projectCount = allWorkspaces.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Early Access messaging */}
      <section className="border-b border-border py-8 md:py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground text-xs">
                  Early Access
                </Badge>
                {projectCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {projectCount} project{projectCount === 1 ? "" : "s"} shared
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Discover Projects
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                Be among the first to explore what builders are creating. More
                features coming soon.
              </p>
            </div>

            {/* CTA - Share your project */}
            <Link href="/workspace/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Share your project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Matches Section - Personalized project matches */}
      {matches.length > 0 && (
        <MatchesSection
          matches={matches}
          onSeeAll={() => {
            // TODO: Navigate to filtered view or modal showing all matches
            console.warn("See all matches clicked");
          }}
        />
      )}

      {/* Coming Soon features - show only if no matches */}
      {matches.length === 0 && (
        <section className="border-b border-border py-3 bg-muted/30">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-xs text-muted-foreground">
              {userAsks.length > 0
                ? "No matches found yet. Try adding gives to your projects!"
                : "Add asks to your projects to see personalized matches here."}
            </p>
          </div>
        </section>
      )}

      {/* Filter Bar - Simplified */}
      <FilterBar resultsCount={filteredWorkspaces.length} />

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-6">
          {filteredWorkspaces.length === 0 ? (
            /* Empty State - "Be the first" */
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
              <Rocket className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Be the first
              </h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                {filters.category !== "all" || filters.searchQuery
                  ? "No projects match your filters yet. Be the first to share one!"
                  : "No projects shared yet. Get in early and be the first to showcase your work."}
              </p>
              <Link href="/workspace/new">
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Share your project
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* 2-column grid (feels fuller with few projects) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredWorkspaces.map((workspace, index) => (
                  <ProjectCardGallery
                    key={workspace.code}
                    workspace={workspace}
                    animationDelay={index * 0.05}
                  />
                ))}
              </div>

              {/* Load more */}
              <div ref={observerTarget} className="mt-8 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                  </div>
                )}
                {!loadingMore && !hasMore && filteredWorkspaces.length > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-3">
                      That&apos;s all {filteredWorkspaces.length} project
                      {filteredWorkspaces.length === 1 ? "" : "s"}
                    </p>
                    <Link href="/workspace/new">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        Add yours
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
