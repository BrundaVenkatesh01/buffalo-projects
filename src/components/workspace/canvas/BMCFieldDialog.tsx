/**
 * Business Model Canvas Field Dialog
 *
 * Simplified modal for editing a single BMC field with AI assistance.
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  WORKSPACE_SURFACE,
} from "@/components/unified";
import type { BMCFieldConfig } from "@/constants/bmcFields";
import { FileText } from "@/icons";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";

export interface BMCFieldDialogProps {
  field: BMCFieldConfig;
  value: string;
  projectName: string;
  description: string;
  bmcData: Workspace["bmcData"];
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: string) => void;
}

/**
 * Dialog component for editing a single BMC field
 * Provides AI suggestions and evidence context
 */
export function BMCFieldDialog({
  field,
  value,
  projectName,
  description,
  bmcData,
  isOpen,
  onClose,
  onChange,
}: BMCFieldDialogProps) {
  const [charCount, setCharCount] = useState(value.length);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Get evidence documents linked to this block
  const documents = useWorkspaceStore(
    (state) => state.currentWorkspace?.documents ?? [],
  );
  const linkedDocuments = useMemo(() => {
    return documents.filter((doc) => doc.linkedFields?.includes(field.id));
  }, [documents, field.id]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    setCharCount(newValue.length);
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    try {
      const { geminiService } = await import("@/services/geminiService");

      const contentForAI =
        value.trim() || `Help me fill in the ${field.title} section`;

      // Get other sections for context
      const otherSections = Object.fromEntries(
        Object.entries(bmcData || {}).filter(([key]) => key !== field.id),
      );

      // Build evidence context
      const evidenceContext =
        linkedDocuments.length > 0
          ? `\n\nLinked Evidence (${linkedDocuments.length} ${linkedDocuments.length === 1 ? "document" : "documents"}):\n${linkedDocuments
              .map(
                (doc, idx) =>
                  `${idx + 1}. ${doc.name} (${doc.type || "document"})${doc.extractedText ? `\n   Content: ${doc.extractedText.slice(0, 500)}...` : ""}`,
              )
              .join("\n")}`
          : "";

      // Enhanced prompt with evidence
      const enhancedContent = `${contentForAI}${evidenceContext}`;

      const response = await geminiService.getBMCSuggestions(
        field.title,
        enhancedContent,
        otherSections,
        {
          ...(projectName ? { projectName } : {}),
          ...(description ? { description } : {}),
          evidenceCount: linkedDocuments.length,
        },
      );

      const suggestions =
        response.suggestions?.filter((s) => s.trim().length > 0) || [];
      setAiSuggestions(suggestions.slice(0, 3));
      setAiInsight(response.insights || null);

      if (response.fallback) {
        // Service unavailable, but we have fallback suggestions
        toast.info("AI service unavailable", {
          description: "Showing general guidance instead",
        });
      } else if (suggestions.length > 0) {
        const evidenceNote =
          linkedDocuments.length > 0
            ? ` Analyzed ${linkedDocuments.length} evidence ${linkedDocuments.length === 1 ? "document" : "documents"}.`
            : "";
        toast.success("AI suggestions ready!", {
          description: `Review the suggestions below for inspiration.${evidenceNote}`,
        });
      } else {
        toast.info("No suggestions this time", {
          description:
            linkedDocuments.length === 0
              ? "Try adding evidence documents to get more specific suggestions"
              : "Try adding more context to your canvas",
        });
      }
    } catch (error) {
      console.error("AI request failed:", error);

      // Show fallback suggestions
      setAiSuggestions([
        "Start by clearly defining the problem you're solving",
        "Talk to potential customers to validate your assumptions",
        "Focus on the most critical aspect first, then iterate",
      ]);
      setAiInsight(
        "Sometimes the best insights come from real customer conversations",
      );

      toast.error("AI unavailable", {
        description: "Showing general guidance instead",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const clearAI = () => {
    setAiSuggestions([]);
    setAiInsight(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          borderColor: WORKSPACE_SURFACE.subtle.border,
        }}
      >
        {/* Header */}
        <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {field.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground/80">
                {field.hint}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 py-6">
          {/* Editor Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Your Content
              </label>
              <span className="text-xs text-muted-foreground/60">
                {charCount} character{charCount !== 1 ? "s" : ""}
              </span>
            </div>
            <textarea
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              rows={12}
              className={cn(
                "w-full resize-none rounded-xl border border-white/20 bg-white/[0.03] px-4 py-3",
                "text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40",
                "focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200",
              )}
              autoFocus
            />
          </div>

          {/* AI Suggestions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleAskAI()}
                  disabled={aiLoading}
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    aiLoading
                      ? "text-muted-foreground"
                      : "text-foreground hover:text-primary",
                  )}
                >
                  {aiLoading ? "Thinking..." : "Ask AI for Suggestions"}
                </button>
                {linkedDocuments.length > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5">
                    <FileText className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] font-semibold text-emerald-500">
                      {linkedDocuments.length} evidence
                    </span>
                  </div>
                )}
              </div>
              {aiSuggestions.length > 0 && (
                <button
                  type="button"
                  onClick={clearAI}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {aiSuggestions.length > 0 && (
                <m.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                      AI Suggestions
                    </p>
                    <div className="space-y-2.5">
                      {aiSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-white/10 bg-white/5 p-3"
                        >
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                    {aiInsight && (
                      <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-xs leading-relaxed">
                        <strong className="font-semibold text-primary">
                          Key insight:
                        </strong>{" "}
                        <span className="text-foreground/90">{aiInsight}</span>
                      </div>
                    )}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="text-xs text-muted-foreground/60">
            Press{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
              ESC
            </kbd>{" "}
            to close
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full px-5"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
