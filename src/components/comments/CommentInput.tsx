"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { Button } from "@/components/ui-next";
import { Textarea } from "@/components/ui-next";
import { AtSign, Eye, EyeOff, Send } from "@/icons";
import { cn } from "@/lib/utils";
import { markdownToHtml } from "@/utils/markdown";
import {
  buildMentionSuggestions,
  detectActiveTrigger,
  indexMentionCandidates,
  type MentionSuggestion,
  findMentionedUserIds,
} from "@/utils/mentionParser";

const DEFAULT_MAX_LENGTH = 2000;

export interface CommentInputProps {
  onSubmit: (payload: {
    content: string;
    mentionIds: string[];
  }) => Promise<void>;
  isSubmitting?: boolean;
  mentionCandidates?: MentionSuggestion[];
  maxLength?: number;
  placeholder?: string;
}

export function CommentInput({
  onSubmit,
  isSubmitting = false,
  mentionCandidates = [],
  maxLength = DEFAULT_MAX_LENGTH,
  placeholder = "Share feedback, resources, or encouragement…",
}: CommentInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(0);

  const indexedCandidates = useMemo(
    () => indexMentionCandidates(mentionCandidates),
    [mentionCandidates],
  );

  const mentionSuggestions = useMemo(() => {
    if (activeTerm === null) {
      return [];
    }
    return buildMentionSuggestions(activeTerm, indexedCandidates);
  }, [activeTerm, indexedCandidates]);

  useEffect(() => {
    if (mentionSuggestions.length === 0) {
      setSuggestionsOpen(false);
      return;
    }
    setSuggestionsOpen(true);
    setFocusedSuggestion(0);
  }, [mentionSuggestions]);

  const insertMention = useCallback(
    (handle: string) => {
      const ref = textareaRef.current;
      if (!ref) {
        return;
      }

      const cursor = ref.selectionStart;
      const valueBeforeCursor = content.slice(0, cursor);
      const mentionStart = valueBeforeCursor.lastIndexOf("@");

      if (mentionStart === -1) {
        return;
      }

      const before = content.slice(0, mentionStart);
      const after = content.slice(cursor);
      const insertion = `@${handle} `;

      const nextValue = `${before}${insertion}${after}`;
      setContent(nextValue);

      const focusMention = () => {
        ref.focus();
        const nextCursor = mentionStart + insertion.length;
        ref.setSelectionRange(nextCursor, nextCursor);
      };

      if (
        typeof window !== "undefined" &&
        typeof window.requestAnimationFrame === "function"
      ) {
        window.requestAnimationFrame(focusMention);
      } else {
        focusMention();
      }
    },
    [content],
  );

  const handleSuggestionClick = (handle: string) => {
    insertMention(handle);
    setActiveTerm(null);
    setSuggestionsOpen(false);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value.slice(0, maxLength);
    setContent(nextValue);

    const cursor = event.target.selectionStart ?? nextValue.length;
    const term = detectActiveTrigger(nextValue, cursor);
    setActiveTerm(term);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!suggestionsOpen || mentionSuggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedSuggestion((prev) =>
        prev + 1 >= mentionSuggestions.length ? 0 : prev + 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedSuggestion((prev) =>
        prev - 1 < 0 ? mentionSuggestions.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (activeTerm !== null) {
        event.preventDefault();
        const selected = mentionSuggestions[focusedSuggestion];
        if (selected) {
          insertMention(selected.handle);
          setActiveTerm(null);
          setSuggestionsOpen(false);
        }
      }
    }

    if (event.key === "Escape") {
      setActiveTerm(null);
      setSuggestionsOpen(false);
    }
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    const mentionIds = findMentionedUserIds(trimmed, indexedCandidates);

    try {
      await onSubmit({
        content: trimmed,
        mentionIds,
      });

      setContent("");
      setIsPreviewMode(false);
      setActiveTerm(null);
      setSuggestionsOpen(false);
    } catch {
      // Surface errors via parent; no-op here
    }
  };

  const remaining = maxLength - content.length;
  const previewHtml = useMemo(() => markdownToHtml(content), [content]);

  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          <AtSign className="h-4 w-4" />
          Leave feedback
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "text-[11px] font-medium text-neutral-500",
              remaining < 0 && "text-red-400",
            )}
          >
            {remaining.toLocaleString()} chars left
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setIsPreviewMode((prev) => !prev)}
            className="h-8 w-8 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-pressed={isPreviewMode}
            aria-label={isPreviewMode ? "Exit preview mode" : "Preview comment"}
          >
            {isPreviewMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <div className="min-h-[160px] rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed text-neutral-300">
          {previewHtml ? (
            <div
              className="prose prose-invert max-w-none text-sm leading-relaxed [&_code]:rounded [&_code]:bg-white/[0.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Preview your comment in markdown
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[160px] resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-neutral-300 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/[0.12] focus-visible:border-white/[0.12] transition-all"
            maxLength={maxLength}
          />

          {suggestionsOpen && mentionSuggestions.length > 0 ? (
            <div className="absolute bottom-2 left-2 z-10 w-60 rounded-xl border border-white/[0.08] bg-neutral-950/98 backdrop-blur-xl p-2 shadow-2xl">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 px-2 py-1">
                Mention
              </div>
              <ul className="mt-1 space-y-0.5">
                {mentionSuggestions.map((suggestion, index) => (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all",
                        focusedSuggestion === index
                          ? "bg-white/[0.08] text-white"
                          : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-300",
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion.handle)}
                    >
                      <span className="font-medium">
                        {suggestion.displayName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        @{suggestion.handle}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          className="rounded-xl px-5 text-[11px] font-semibold uppercase tracking-wider h-10"
          onClick={() => {
            setContent("");
            setIsPreviewMode(false);
          }}
          variant="ghost"
          disabled={isSubmitting || content.length === 0}
        >
          Clear
        </Button>
        <Button
          type="button"
          className="flex items-center gap-3 rounded-xl px-5 text-[11px] font-semibold uppercase tracking-wider h-10 bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.08] hover:border-white/[0.12] transition-all"
          onClick={() => {
            void handleSubmit();
          }}
          disabled={
            isSubmitting || content.trim().length === 0 || remaining < 0
          }
        >
          <Send className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Post</span>
        </Button>
      </div>
    </div>
  );
}
