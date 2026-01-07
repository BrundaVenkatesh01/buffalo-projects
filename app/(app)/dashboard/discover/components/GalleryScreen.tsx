"use client";

import type { DocumentSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";

import { FilterBar } from "./FilterBar";
import { MatchesSection } from "./MatchesSection";

import { ProjectCardGallery } from "@/components/projects/ProjectCardGallery";
import { Badge, Button } from "@/components/unified";
import { Loader2, Plus, Rocket, Sparkles } from "@/icons";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { calculateMatches, type Match } from "@/services/matchingService";
import { useAuthStore } from "@/stores/authStore";
import { useGalleryStore } from "@/stores/galleryStore";
import type { ProjectCategory, Workspace } from "@/types";

/**
 * GalleryScreen - Discover Buffalo Projects & Businesses
 * 
 * Flexible discovery page for both:
 * - Buffalo businesses
 * - Personal projects
 * - Community initiatives
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-neutral-400">Loading projects...</p>
        </div>
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
      
      <section className="relative border-b border-border py-12 md:py-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 shadow-lg shadow-blue-500/50">
                  <Sparkles className="h-3 w-3 mr-1 inline" />
                  Buffalo Community
                </Badge>
                {projectCount > 0 && (
                  <span className="text-sm font-semibold text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {projectCount} {projectCount === 1 ? "project" : "projects"}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl mb-2">
                Discover Projects
              </h1>
              
              <p className="text-base text-neutral-200 max-w-xl leading-relaxed">
                {projectCount === 0 
                  ? "Be the first to showcase your project or business to the Buffalo community!"
                  : "Explore projects, businesses, and ideas from Buffalo creators and entrepreneurs."}
              </p>
            </div>

            
            <Link href="/workspace/new">
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/50 border-0 h-12 px-6"
              >
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Share Your Project</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      {matches.length > 0 && (
        <MatchesSection
          matches={matches}
          onSeeAll={() => {
            console.warn("See all matches clicked");
          }}
        />
      )}

      
      {matches.length === 0 && userAsks.length === 0 && (
        <section className="border-b border-border py-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-sm text-neutral-300 text-center">
              💡 <span className="font-semibold">Tip:</span> Add what you're looking for to your project to see personalized matches here!
            </p>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <FilterBar resultsCount={filteredWorkspaces.length} />

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-6">
          {filteredWorkspaces.length === 0 ? (
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 p-16 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
              
              {/* Icon with gradient glow */}
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/50 relative z-10">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-50" />
              </div>
              
              
              <h3 className="mb-3 text-2xl font-bold text-white relative z-10">
                Be the First ✨
              </h3>
              <p className="mb-8 max-w-md text-base text-neutral-200 relative z-10 leading-relaxed">
                {filters.category !== "all" || filters.searchQuery
                  ? "No projects match your search yet. Share yours and be the first!"
                  : "No projects shared yet. Be a pioneer and showcase your work to the Buffalo community!"}
              </p>
              <Link href="/workspace/new">
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl shadow-blue-500/50 relative z-10 h-12 px-8"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-semibold">Share Your Project</span>
                </Button>
              </Link>
              <p className="mt-4 text-xs text-neutral-400 relative z-10">
                Takes just a few minutes to create your page
              </p>
            </div>
          ) : (
            <>
              {/* 2-column grid */}
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
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more...
                  </div>
                )}
                {!loadingMore && !hasMore && filteredWorkspaces.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-neutral-300 mb-4">
                      That's all {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? "project" : "projects"}! 🎉
                    </p>
                    <Link href="/workspace/new">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-white/20 hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4" />
                        Add Yours
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