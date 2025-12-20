/**
 * Community Section
 *
 * Asks (what you need) and Gives (what you offer) for peer exchange.
 */

"use client";

import type React from "react";
import { useState } from "react";

import { usePublishForm } from "../PublishFormContext";

import { SectionWrapper } from "./SectionWrapper";

import { Input, Label, Badge } from "@/components/unified";
import { HandHelping, Gift, X, Plus } from "@/icons";
import { cn } from "@/lib/utils";

// Suggestions for asks
const ASK_SUGGESTIONS = [
  "Feedback",
  "Co-founder",
  "Designer",
  "Developer",
  "User testers",
  "Funding",
  "Mentorship",
  "Connections",
];

// Suggestions for gives
const GIVE_SUGGESTIONS = [
  "Product strategy",
  "Frontend dev",
  "Backend dev",
  "Design feedback",
  "User research",
  "Marketing",
  "Technical review",
  "Introductions",
];

interface ChipInputProps {
  label: string;
  icon: React.ReactNode;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  suggestions: string[];
  placeholder: string;
  variant: "ask" | "give";
}

function ChipInput({
  label,
  icon,
  items,
  onAdd,
  onRemove,
  suggestions,
  placeholder,
  variant,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(inputValue);
    }
  };

  const filteredSuggestions = suggestions
    .filter((s) => !items.includes(s))
    .slice(0, 6);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-foreground flex items-center gap-2">
        {icon}
        {label}
      </Label>

      {/* Input */}
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary flex-1"
        />
        <button
          type="button"
          onClick={() => handleAdd(inputValue)}
          disabled={!inputValue.trim()}
          className={cn(
            "p-2 rounded-md transition-colors",
            inputValue.trim()
              ? variant === "ask"
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : "bg-white/5 text-muted-foreground cursor-not-allowed",
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Selected items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className={cn(
                "cursor-default group",
                variant === "ask"
                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/25"
                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/25",
              )}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-1.5 opacity-60 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAdd(suggestion)}
                className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CommunitySection() {
  const { state, dispatch } = usePublishForm();

  return (
    <SectionWrapper
      title="Community Exchange"
      sectionKey="community"
      icon={<HandHelping className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-6">
        <p className="text-xs text-muted-foreground">
          Connect with other builders by sharing what you need and what you can
          offer.
        </p>

        {/* Asks */}
        <ChipInput
          label="What I'm Looking For"
          icon={<HandHelping className="h-3.5 w-3.5 text-amber-400" />}
          items={state.asks}
          onAdd={(item) => dispatch({ type: "ADD_ASK", payload: item })}
          onRemove={(item) => dispatch({ type: "REMOVE_ASK", payload: item })}
          suggestions={ASK_SUGGESTIONS}
          placeholder="e.g., Design feedback, Beta testers..."
          variant="ask"
        />

        {/* Gives */}
        <ChipInput
          label="What I Can Offer"
          icon={<Gift className="h-3.5 w-3.5 text-emerald-400" />}
          items={state.gives}
          onAdd={(item) => dispatch({ type: "ADD_GIVE", payload: item })}
          onRemove={(item) => dispatch({ type: "REMOVE_GIVE", payload: item })}
          suggestions={GIVE_SUGGESTIONS}
          placeholder="e.g., Code review, UX advice..."
          variant="give"
        />
      </div>
    </SectionWrapper>
  );
}
