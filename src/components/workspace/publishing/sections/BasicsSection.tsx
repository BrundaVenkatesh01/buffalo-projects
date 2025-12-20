/**
 * Basics Section
 *
 * Core project information: name, pitch, description, category, stage, tags.
 * Always expanded by default in the publish form.
 */

"use client";

import type React from "react";
import { useState } from "react";

import {
  usePublishForm,
  CATEGORY_OPTIONS,
  TAG_SUGGESTIONS,
} from "../PublishFormContext";

import { SectionWrapper } from "./SectionWrapper";

import {
  Input,
  Label,
  Textarea,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/unified";
import { STAGE_PROGRESSION, type StageConfig } from "@/constants/stages";
import { X, Plus } from "@/icons";
import { cn } from "@/lib/utils";

export function BasicsSection() {
  const { state, dispatch } = usePublishForm();
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (tag: string) => {
    dispatch({ type: "ADD_TAG", payload: tag });
    setNewTag("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  return (
    <SectionWrapper title="Basics" sectionKey="basics" defaultExpanded>
      <div className="space-y-4">
        {/* Project Name */}
        <div className="space-y-1.5">
          <Label htmlFor="projectName" className="text-sm text-foreground">
            Project Name
          </Label>
          <Input
            id="projectName"
            value={state.projectName}
            onChange={(e) =>
              dispatch({ type: "SET_PROJECT_NAME", payload: e.target.value })
            }
            placeholder="What's your project called?"
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* One-liner Pitch */}
        <div className="space-y-1.5">
          <Label htmlFor="oneLiner" className="text-sm text-foreground">
            One-liner Pitch
          </Label>
          <Input
            id="oneLiner"
            value={state.oneLiner}
            onChange={(e) =>
              dispatch({ type: "SET_ONE_LINER", payload: e.target.value })
            }
            placeholder="Describe your project in one sentence"
            maxLength={120}
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            {state.oneLiner.length}/120 characters
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            value={state.description}
            onChange={(e) =>
              dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
            }
            placeholder="Tell us more about your project..."
            rows={4}
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
          />
        </div>

        {/* Category & Stage - Side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm text-foreground">
              Category
            </Label>
            <Select
              value={state.category}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_CATEGORY",
                  payload: value as typeof state.category,
                })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stage */}
          <div className="space-y-1.5">
            <Label htmlFor="stage" className="text-sm text-foreground">
              Stage
            </Label>
            <Select
              value={state.stage}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_STAGE",
                  payload: value as typeof state.stage,
                })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGE_PROGRESSION.map((stage: StageConfig) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <span className="flex items-center gap-2">
                      <stage.icon className="h-4 w-4" />
                      <span>{stage.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Tags</Label>

          {/* Tag input */}
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary flex-1"
            />
            <button
              type="button"
              onClick={() => handleAddTag(newTag)}
              disabled={!newTag.trim()}
              className={cn(
                "p-2 rounded-md transition-colors",
                newTag.trim()
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "bg-white/5 text-muted-foreground cursor-not-allowed",
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Selected tags */}
          {state.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {state.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/10 text-foreground hover:bg-white/15 cursor-default group"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "REMOVE_TAG", payload: tag })
                    }
                    className="ml-1.5 opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested tags */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Suggested:</p>
            <div className="flex flex-wrap gap-1.5">
              {TAG_SUGGESTIONS.filter((tag) => !state.tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => dispatch({ type: "ADD_TAG", payload: tag })}
                    className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
