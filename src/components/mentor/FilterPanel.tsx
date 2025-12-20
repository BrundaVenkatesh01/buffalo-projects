"use client";

import { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui-next";
import { Button } from "@/components/ui-next";

type StageValue = "idea" | "building" | "testing" | "launching";

interface FilterPanelProps {
  stageSelections: Record<StageValue, boolean>;
  onStageToggle: (stage: StageValue, next: boolean) => void;
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  hasAsksOnly: boolean;
  onHasAsksChange: (next: boolean) => void;
  recentOnly: boolean;
  onRecentChange: (next: boolean) => void;
  buffaloOnly: boolean;
  onBuffaloChange: (next: boolean) => void;
  onResetFilters: () => void;
}

const STAGE_LABELS: Record<StageValue, string> = {
  idea: "Idea",
  building: "Building",
  testing: "Testing",
  launching: "Launched",
};

export function FilterPanel({
  stageSelections,
  onStageToggle,
  tags,
  selectedTags,
  onToggleTag,
  onClearTags,
  hasAsksOnly,
  onHasAsksChange,
  recentOnly,
  onRecentChange,
  buffaloOnly,
  onBuffaloChange,
  onResetFilters,
}: FilterPanelProps) {
  const sortedTags = useMemo(
    () => tags.sort((a, b) => a.localeCompare(b)),
    [tags],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
          onClick={onResetFilters}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-[0.24em] text-muted-foreground/80">
          Stage
        </Label>
        <div className="grid gap-2">
          {(Object.keys(STAGE_LABELS) as StageValue[]).map((stage) => {
            const active = stageSelections[stage];
            return (
              <button
                key={stage}
                type="button"
                className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm transition ${
                  active
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-white/20"
                }`}
                onClick={() => {
                  onStageToggle(stage, !active);
                }}
              >
                <span>{STAGE_LABELS[stage]}</span>
                <Badge
                  variant={active ? "default" : "outline"}
                  className="ml-2 rounded-full text-[10px] uppercase tracking-[0.24em]"
                >
                  {active ? "On" : "Off"}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-[0.24em] text-muted-foreground/80">
            Tags
          </Label>
          {selectedTags.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              onClick={onClearTags}
            >
              Clear
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTags.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No tags indexed yet.
            </p>
          ) : (
            sortedTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/[0.08] text-muted-foreground hover:bg-white/[0.12]"
                  }`}
                  onClick={() => {
                    onToggleTag(tag);
                  }}
                >
                  #{tag}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <div className="space-y-1">
            <Label className="text-sm text-foreground">Has asks</Label>
            <p className="text-xs text-muted-foreground">
              Only show projects with active mentor asks.
            </p>
          </div>
          <Switch checked={hasAsksOnly} onCheckedChange={onHasAsksChange} />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <div className="space-y-1">
            <Label className="text-sm text-foreground">Recently updated</Label>
            <p className="text-xs text-muted-foreground">
              Only projects updated in the last 7 days.
            </p>
          </div>
          <Switch checked={recentOnly} onCheckedChange={onRecentChange} />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <div className="space-y-1">
            <Label className="text-sm text-foreground">
              Buffalo affiliated
            </Label>
            <p className="text-xs text-muted-foreground">
              Highlight teams building from Buffalo or representing the region.
            </p>
          </div>
          <Switch checked={buffaloOnly} onCheckedChange={onBuffaloChange} />
        </div>
      </div>
    </div>
  );
}
