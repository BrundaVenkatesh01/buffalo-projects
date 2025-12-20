"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, Input, Badge } from "@/components/unified";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid3x3,
  List,
  LayoutGrid,
} from "@/icons";

export type ProjectSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "most-active"
  | "stage";

export type ProjectFilterOption =
  | "all"
  | "public"
  | "private"
  | "twentysix"
  | "idea"
  | "research"
  | "planning"
  | "building"
  | "testing"
  | "launching"
  | "scaling";

export type ViewMode = "grid" | "list" | "compact";

interface ProjectFilterBarProps {
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: ProjectSortOption;
  onSortChange: (sort: ProjectSortOption) => void;
  filter: ProjectFilterOption;
  onFilterChange: (filter: ProjectFilterOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProjectFilterBar({
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
}: ProjectFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    searchQuery || filter !== "all" || sortBy !== "newest";

  // Calculate number of active filters for mobile badge
  const activeFilterCount = [
    searchQuery && "search",
    filter !== "all" && "filter",
    sortBy !== "newest" && "sort",
  ].filter(Boolean).length;

  const clearAll = () => {
    onSearchChange("");
    onFilterChange("all");
    onSortChange("newest");
  };

  return (
    <div className="bg-background/95 pb-2 space-y-2">
      {/* Main Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle (Mobile) - Shows active filter count */}
        <Button
          variant="outline"
          size="default"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Desktop Filters */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as ProjectSortOption)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="most-active">Most Active</SelectItem>
              <SelectItem value="stage">By Stage</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter */}
          <Select
            value={filter}
            onValueChange={(value) =>
              onFilterChange(value as ProjectFilterOption)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="twentysix">&apos;26 Entries</SelectItem>
              <SelectItem value="idea">Idea Stage</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="building">Building</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="launching">Launching</SelectItem>
              <SelectItem value="scaling">Scaling</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "compact" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => onViewModeChange("compact")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filters (Expandable) */}
      {showFilters && (
        <div className="sm:hidden space-y-2 pt-2 border-t">
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as ProjectSortOption)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="most-active">Most Active</SelectItem>
              <SelectItem value="stage">By Stage</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter}
            onValueChange={(value) =>
              onFilterChange(value as ProjectFilterOption)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="twentysix">&apos;26 Entries</SelectItem>
              <SelectItem value="idea">Idea Stage</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="building">Building</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="launching">Launching</SelectItem>
              <SelectItem value="scaling">Scaling</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex items-center gap-1 border rounded-md p-1 flex-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onViewModeChange("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onViewModeChange("list")}
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === "compact" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onViewModeChange("compact")}
              >
                <LayoutGrid className="h-4 w-4" />
                Compact
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            Showing {filteredCount}{" "}
            {filteredCount === 1 ? "project" : "projects"}
            {filteredCount !== totalCount && <span> of {totalCount}</span>}
          </span>
          {filteredCount === 0 && totalCount > 0 && (
            <Badge variant="outline" className="text-xs">
              No matches
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="gap-2"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
