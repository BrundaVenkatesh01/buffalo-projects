"use client";

import { useState } from "react";

import { Badge, Button } from "@/components/unified";
import { Search, X, Filter, ChevronDown } from "@/icons";
import { cn } from "@/lib/utils";
import { useGalleryStore } from "@/stores/galleryStore";
import type { ProjectCategory, ProjectStage } from "@/types";

const CATEGORIES: Array<{ value: ProjectCategory | "all"; label: string }> = [
  { value: "all", label: "All Categories" },
  { value: "startup", label: "Startup" },
  { value: "design", label: "Design" },
  { value: "research", label: "Research" },
  { value: "indie", label: "Indie" },
  { value: "open-source", label: "Open Source" },
  { value: "creative", label: "Creative" },
  { value: "other", label: "Other" },
];

const STAGES: Array<{ value: ProjectStage; label: string }> = [
  { value: "idea", label: "Idea" },
  { value: "research", label: "Research" },
  { value: "planning", label: "Planning" },
  { value: "building", label: "Building" },
  { value: "testing", label: "Testing" },
  { value: "launching", label: "Launching" },
  { value: "scaling", label: "Scaling" },
];

const COMMON_GIVES_ASKS = [
  "Feedback",
  "Mentorship",
  "Design Help",
  "Code Review",
  "User Testing",
  "Product Strategy",
  "Marketing",
  "Co-founder",
  "Funding",
  "Beta Users",
];

interface FilterBarProps {
  resultsCount?: number;
}

export function FilterBar({ resultsCount }: FilterBarProps) {
  const {
    filters,
    sortBy,
    setSearchQuery,
    setCategory,
    setStages,
    setLocation,
    setGives,
    setAsks,
    setSortBy,
    clearFilters,
  } = useGalleryStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.stages.length > 0 ||
    filters.location !== "all" ||
    filters.gives.length > 0 ||
    filters.asks.length > 0 ||
    filters.searchQuery !== "";

  const handleStageToggle = (stage: ProjectStage) => {
    if (filters.stages.includes(stage)) {
      setStages(filters.stages.filter((s) => s !== stage));
    } else {
      setStages([...filters.stages, stage]);
    }
  };

  const handleGiveToggle = (give: string) => {
    if (filters.gives.includes(give)) {
      setGives(filters.gives.filter((g) => g !== give));
    } else {
      setGives([...filters.gives, give]);
    }
  };

  const handleAskToggle = (ask: string) => {
    if (filters.asks.includes(ask)) {
      setAsks(filters.asks.filter((a) => a !== ask));
    } else {
      setAsks([...filters.asks, ask]);
    }
  };

  const selectedCategoryLabel =
    CATEGORIES.find((c) => c.value === filters.category)?.label ||
    "All Categories";

  return (
    <div className="sticky top-16 z-40 border-b border-white/10 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-blue-500/30 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-400 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="gap-2 h-11 rounded-xl border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 text-white font-medium transition-all duration-200"
            >
              {selectedCategoryLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {categoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-white/20 bg-neutral-900/98 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value);
                      setCategoryDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors",
                      filters.category === cat.value
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white font-semibold"
                        : "text-neutral-300 hover:text-white",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer transition-all duration-200 h-11 rounded-xl px-4 font-semibold",
                filters.location === "all"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                  : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
              )}
              onClick={() => setLocation("all")}
            >
              All
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer transition-all duration-200 h-11 rounded-xl px-4 font-semibold",
                filters.location === "buffalo"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                  : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
              )}
              onClick={() => setLocation("buffalo")}
            >
              🦬 Buffalo
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer transition-all duration-200 h-11 rounded-xl px-4 font-semibold",
                filters.location === "remote"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                  : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
              )}
              onClick={() => setLocation("remote")}
            >
              Remote
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2 h-11 rounded-xl border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 text-white font-medium transition-all duration-200"
          >
            <Filter className="h-4 w-4" />
            Advanced
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}

          {resultsCount !== undefined && (
            <div className="ml-auto hidden sm:block text-sm font-semibold text-white/80">
              {resultsCount} {resultsCount === 1 ? "project" : "projects"}
            </div>
          )}
        </div>

        {showAdvanced && (
          <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
            <div>
              <label className="mb-3 block text-xs font-bold text-white uppercase tracking-wider">
                Project Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((stage) => (
                  <Badge
                    key={stage.value}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                      filters.stages.includes(stage.value)
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                        : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                    )}
                    onClick={() => handleStageToggle(stage.value)}
                  >
                    {stage.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold text-white uppercase tracking-wider">
                Offering (Gives)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_GIVES_ASKS.map((give) => (
                  <Badge
                    key={give}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                      filters.gives.includes(give)
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500/50 shadow-lg shadow-green-500/50"
                        : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                    )}
                    onClick={() => handleGiveToggle(give)}
                  >
                    {give}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold text-white uppercase tracking-wider">
                Looking For (Asks)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_GIVES_ASKS.map((ask) => (
                  <Badge
                    key={ask}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                      filters.asks.includes(ask)
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500/50 shadow-lg shadow-purple-500/50"
                        : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                    )}
                    onClick={() => handleAskToggle(ask)}
                  >
                    {ask}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold text-white uppercase tracking-wider">
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                    sortBy === "recent"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                      : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                  )}
                  onClick={() => setSortBy("recent")}
                >
                  Recently Published
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                    sortBy === "popular"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                      : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                  )}
                  onClick={() => setSortBy("popular")}
                >
                  Most Popular
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                    sortBy === "comments"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                      : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                  )}
                  onClick={() => setSortBy("comments")}
                >
                  Most Comments
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 font-medium",
                    sortBy === "trending"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/50"
                      : "bg-white/10 text-neutral-300 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30",
                  )}
                  onClick={() => setSortBy("trending")}
                >
                  Trending
                </Badge>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.category !== "all" && (
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500/50 shadow-lg group"
              >
                {selectedCategoryLabel}
                <X
                  className="h-3 w-3 cursor-pointer group-hover:rotate-90 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategory("all");
                  }}
                />
              </Badge>
            )}
            {filters.stages.map((stage) => (
              <Badge
                key={stage}
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500/50 shadow-lg group"
              >
                {STAGES.find((s) => s.value === stage)?.label}
                <X
                  className="h-3 w-3 cursor-pointer group-hover:rotate-90 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStageToggle(stage);
                  }}
                />
              </Badge>
            ))}
            {filters.gives.map((give) => (
              <Badge
                key={give}
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500/50 shadow-lg group"
              >
                {give}
                <X
                  className="h-3 w-3 cursor-pointer group-hover:rotate-90 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGiveToggle(give);
                  }}
                />
              </Badge>
            ))}
            {filters.asks.map((ask) => (
              <Badge
                key={ask}
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500/50 shadow-lg group"
              >
                {ask}
                <X
                  className="h-3 w-3 cursor-pointer group-hover:rotate-90 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAskToggle(ask);
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}