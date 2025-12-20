"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, Input, Textarea } from "@/components/unified";
import {
  BORDER,
  PADDING,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/components/unified";
import {
  CheckCircle2,
  AlertCircle,
  Edit2,
  ChevronDown,
  ChevronRight,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { ImportResult } from "@/services/importService";
import type { CanvasBlockId } from "@/types";

interface ImportReviewStepProps {
  result: ImportResult;
  onConfirm: (result: ImportResult) => void;
  onBack: () => void;
  onCancel: () => void;
}

const BMC_FIELD_LABELS: Record<CanvasBlockId, string> = {
  valuePropositions: "Value Propositions",
  customerSegments: "Customer Segments",
  channels: "Channels",
  customerRelationships: "Customer Relationships",
  revenueStreams: "Revenue Streams",
  keyResources: "Key Resources",
  keyActivities: "Key Activities",
  keyPartners: "Key Partners",
  costStructure: "Cost Structure",
};

export function ImportReviewStep({
  result,
  onConfirm,
  onBack,
  onCancel,
}: ImportReviewStepProps) {
  const [editedResult, setEditedResult] = useState<ImportResult>(result);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(result.extractedFields),
  );
  const [editingField, setEditingField] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateField = (field: keyof ImportResult, value: string) => {
    setEditedResult((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBMCField = (field: CanvasBlockId, value: string) => {
    setEditedResult((prev) => ({
      ...prev,
      bmcData: {
        ...prev.bmcData,
        [field]: value,
      },
    }));
  };

  const handleConfirm = () => {
    onConfirm(editedResult);
  };

  const confidenceColor =
    result.confidence >= 0.8
      ? "text-green-500"
      : result.confidence >= 0.6
        ? "text-yellow-500"
        : "text-amber-500";

  return (
    <div className={cn("flex flex-col", SPACING.lg)}>
      {/* Header with Confidence */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className={cn(TYPOGRAPHY.heading.lg, "mb-1")}>
            Review Imported Data
          </h3>
          <p className={cn(TYPOGRAPHY.muted.md)}>
            Review and edit the extracted information before creating your
            workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(TYPOGRAPHY.muted.sm)}>Confidence:</span>
          <span className={cn(TYPOGRAPHY.heading.sm, confidenceColor)}>
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div
          className={cn(
            "rounded-lg border border-yellow-500/20 bg-yellow-500/10",
            PADDING.md,
          )}
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
            <div className="flex-1">
              <p className={cn(TYPOGRAPHY.heading.xs, "mb-2 text-yellow-500")}>
                Attention Required
              </p>
              <ul className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <li key={i} className={cn(TYPOGRAPHY.muted.sm)}>
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div
          className={cn(
            "rounded-lg border border-primary/20 bg-primary/10",
            PADDING.md,
          )}
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className={cn(TYPOGRAPHY.heading.xs, "mb-2")}>
                AI Suggestions
              </p>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className={cn(TYPOGRAPHY.muted.sm)}>
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Project Metadata */}
      <div className={cn("space-y-4", PADDING.lg, RADIUS.lg, BORDER.default)}>
        <h4 className={cn(TYPOGRAPHY.heading.sm)}>Project Information</h4>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={cn(TYPOGRAPHY.label.default, "mb-2 block")}>
              Project Name *
            </label>
            <Input
              value={editedResult.projectName}
              onChange={(e) => updateField("projectName", e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className={cn(TYPOGRAPHY.label.default, "mb-2 block")}>
              Stage
            </label>
            <select
              value={editedResult.stage || "idea"}
              onChange={(e) => updateField("stage", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="idea">Idea</option>
              <option value="building">Building</option>
              <option value="testing">Testing</option>
              <option value="launched">Launched</option>
            </select>
          </div>
        </div>

        <div>
          <label className={cn(TYPOGRAPHY.label.default, "mb-2 block")}>
            One-liner (Elevator Pitch)
          </label>
          <Input
            value={editedResult.oneLiner || ""}
            onChange={(e) => updateField("oneLiner", e.target.value)}
            placeholder="A compelling one-sentence description"
          />
        </div>

        <div>
          <label className={cn(TYPOGRAPHY.label.default, "mb-2 block")}>
            Description
          </label>
          <Textarea
            value={editedResult.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="2-3 sentences about your project"
            rows={3}
          />
        </div>

        <div>
          <label className={cn(TYPOGRAPHY.label.default, "mb-2 block")}>
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {editedResult.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag}
                <button
                  onClick={() => {
                    const newTags = editedResult.tags.filter(
                      (_, idx) => idx !== i,
                    );
                    setEditedResult((prev) => ({ ...prev, tags: newTags }));
                  }}
                  className="ml-2 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            <Input
              placeholder="Add tag..."
              className="w-32"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const newTag = e.currentTarget.value.trim();
                  if (!editedResult.tags.includes(newTag)) {
                    setEditedResult((prev) => ({
                      ...prev,
                      tags: [...prev.tags, newTag],
                    }));
                  }
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Business Model Canvas Fields */}
      <div className={cn("space-y-2")}>
        <h4 className={cn(TYPOGRAPHY.heading.sm, "mb-4")}>
          Business Model Canvas
          <span className={cn(TYPOGRAPHY.muted.sm, "ml-2 font-normal")}>
            ({result.extractedFields.length}/9 fields extracted)
          </span>
        </h4>

        {Object.entries(BMC_FIELD_LABELS).map(([field, label]) => {
          const fieldId = field as CanvasBlockId;
          const value = editedResult.bmcData[fieldId] || "";
          const wasExtracted = result.extractedFields.includes(field);
          const isExpanded = expandedSections.has(field);
          const isEditing = editingField === field;

          return (
            <div
              key={field}
              className={cn(
                "rounded-lg border transition-colors",
                wasExtracted ? BORDER.default : BORDER.subtle,
                wasExtracted && isExpanded && "border-primary/30 bg-primary/5",
              )}
            >
              {/* Field Header */}
              <button
                onClick={() => toggleSection(field)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className={cn(TYPOGRAPHY.heading.xs)}>{label}</span>
                  {wasExtracted && (
                    <Badge variant="default" className="ml-2 text-xs">
                      Extracted
                    </Badge>
                  )}
                </div>
                {value && !isExpanded && (
                  <span
                    className={cn(TYPOGRAPHY.muted.sm, "max-w-md truncate")}
                  >
                    {value}
                  </span>
                )}
              </button>

              {/* Field Content */}
              {isExpanded && (
                <div className={cn("border-t px-4 py-3", BORDER.subtle)}>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={value}
                        onChange={(e) =>
                          updateBMCField(fieldId, e.target.value)
                        }
                        rows={4}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingField(null)}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p
                        className={cn(
                          TYPOGRAPHY.body.md,
                          value ? "" : "text-muted-foreground italic",
                        )}
                      >
                        {value || "No data extracted for this field"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingField(field)}
                        className="gap-2"
                      >
                        <Edit2 className="h-3 w-3" />
                        {value ? "Edit" : "Add"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <Button variant="ghost" onClick={onBack} size="sm">
          ← Back
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button onClick={handleConfirm} size="sm" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
