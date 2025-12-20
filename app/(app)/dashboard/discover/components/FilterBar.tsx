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
    <div className="sticky top-16 z-40 border-b border-white/[0.05] bg-background/98 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-5">
        {/* Main Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-white/[0.20] focus:bg-white/[0.04] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="gap-2 h-11 rounded-xl border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] text-neutral-400 hover:text-white transition-all duration-200"
            >
              {selectedCategoryLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {categoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-white/[0.08] bg-neutral-950/98 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value);
                      setCategoryDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm hover:bg-white/[0.06] transition-colors",
                      filters.category === cat.value
                        ? "bg-blue-500/10 text-blue-400 font-medium"
                        : "text-neutral-400",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer transition-all duration-200 h-11 rounded-xl px-4 border-white/[0.08]",
                filters.location === "all"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
              )}
              onClick={() => setLocation("all")}
            >
              All
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer transition-all duration-200 h-11 rounded-xl px-4 border-white/[0.08]",
                filters.location === "buffalo"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
              )}
              onClick={() => setLocation("buffalo")}
            >
              🦬 Buffalo
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer transition-all duration-200 h-11 rounded-xl px-4 border-white/[0.08]",
                filters.location === "remote"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
              )}
              onClick={() => setLocation("remote")}
            >
              Remote
            </Badge>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2 h-11 rounded-xl border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] text-neutral-400 hover:text-white transition-all duration-200"
          >
            <Filter className="h-4 w-4" />
            Advanced
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 h-11 rounded-xl text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}

          {/* Results Count */}
          {resultsCount !== undefined && (
            <div className="ml-auto hidden sm:block text-sm text-neutral-500">
              {resultsCount} {resultsCount === 1 ? "project" : "projects"}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-6 space-y-6 border-t border-white/[0.05] pt-6">
            {/* Stage Filter */}
            <div>
              <label className="mb-3 block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Project Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((stage) => (
                  <Badge
                    key={stage.value}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                      filters.stages.includes(stage.value)
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                    )}
                    onClick={() => handleStageToggle(stage.value)}
                  >
                    {stage.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Gives Filter */}
            <div>
              <label className="mb-3 block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Offering (Gives)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_GIVES_ASKS.map((give) => (
                  <Badge
                    key={give}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                      filters.gives.includes(give)
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                    )}
                    onClick={() => handleGiveToggle(give)}
                  >
                    {give}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Asks Filter */}
            <div>
              <label className="mb-3 block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Looking For (Asks)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_GIVES_ASKS.map((ask) => (
                  <Badge
                    key={ask}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                      filters.asks.includes(ask)
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                    )}
                    onClick={() => handleAskToggle(ask)}
                  >
                    {ask}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-3 block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                    sortBy === "recent"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                  )}
                  onClick={() => setSortBy("recent")}
                >
                  Recently Published
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                    sortBy === "popular"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                  )}
                  onClick={() => setSortBy("popular")}
                >
                  Most Popular
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                    sortBy === "comments"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                  )}
                  onClick={() => setSortBy("comments")}
                >
                  Most Comments
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-full px-3 py-1.5 border-white/[0.08]",
                    sortBy === "trending"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : "bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.12]",
                  )}
                  onClick={() => setSortBy("trending")}
                >
                  Trending
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.category !== "all" && (
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1.5 bg-blue-500/10 text-blue-400 border-blue-500/30 group"
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
                className="gap-1.5 rounded-full px-3 py-1.5 bg-blue-500/10 text-blue-400 border-blue-500/30 group"
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
                className="gap-1.5 rounded-full px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group"
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
                className="gap-1.5 rounded-full px-3 py-1.5 bg-purple-500/10 text-purple-400 border-purple-500/30 group"
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
