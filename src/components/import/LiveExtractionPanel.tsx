"use client";

import { useMemo } from "react";

import { BMCFieldCard, type FieldExtractionStatus } from "./BMCFieldCard";

import { Progress, Alert, AlertDescription } from "@/components/unified";
import { BORDER, TYPOGRAPHY } from "@/components/unified";
import { Zap, AlertCircle, CheckCircle2 } from "@/icons";
import { cn } from "@/lib/utils";
import type { ImportResult } from "@/services/importService";
import type { CanvasBlockId } from "@/types";

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

export interface LiveExtractionPanelProps {
  isExtracting: boolean;
  progress: number; // 0-100
  statusMessage?: string;
  result: Partial<ImportResult> | null;
  onFieldChange: (fieldId: CanvasBlockId, value: string) => void;
  className?: string;
}

export function LiveExtractionPanel({
  isExtracting,
  progress,
  statusMessage,
  result,
  onFieldChange,
  className,
}: LiveExtractionPanelProps) {
  // Determine field statuses based on extraction progress
  const fieldStatuses = useMemo(() => {
    const statuses: Record<CanvasBlockId, FieldExtractionStatus> = {
      valuePropositions: "pending",
      customerSegments: "pending",
      channels: "pending",
      customerRelationships: "pending",
      revenueStreams: "pending",
      keyResources: "pending",
      keyActivities: "pending",
      keyPartners: "pending",
      costStructure: "pending",
    };

    if (!result) {
      return statuses;
    }

    // Mark extracted fields
    Object.keys(BMC_FIELD_LABELS).forEach((fieldId) => {
      const field = fieldId as CanvasBlockId;
      const value = result.bmcData?.[field];
      const wasExtracted = result.extractedFields?.includes(fieldId);

      if (isExtracting && !value) {
        statuses[field] = "pending";
      } else if (isExtracting && value) {
        statuses[field] = "extracting";
      } else if (wasExtracted && value) {
        // Use per-field confidence if available, otherwise fall back to overall confidence
        const fieldConfidence =
          result.fieldConfidences?.[fieldId] ?? result.confidence ?? 0;
        statuses[field] = fieldConfidence < 0.6 ? "needs-review" : "extracted";
      } else if (value) {
        statuses[field] = "extracted";
      } else {
        statuses[field] = "empty";
      }
    });

    return statuses;
  }, [result, isExtracting]);

  // Group fields by quality for smart ordering
  const groupedFields = useMemo(() => {
    const fields = Object.keys(BMC_FIELD_LABELS) as CanvasBlockId[];

    return {
      needsReview: fields.filter((f) => fieldStatuses[f] === "needs-review"),
      extracted: fields.filter((f) => fieldStatuses[f] === "extracted"),
      extracting: fields.filter((f) => fieldStatuses[f] === "extracting"),
      empty: fields.filter(
        (f) => fieldStatuses[f] === "empty" || fieldStatuses[f] === "pending",
      ),
    };
  }, [fieldStatuses]);

  const extractedCount = result?.extractedFields?.length || 0;
  const totalFields = Object.keys(BMC_FIELD_LABELS).length;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header with Progress */}
      <div
        className={cn(
          "flex flex-col gap-2.5 border-b px-4 py-2.5 shrink-0",
          BORDER.subtle,
        )}
      >
        <div className="flex items-center justify-between">
          <span className={cn(TYPOGRAPHY.heading.xs)}>Extraction Progress</span>
          <span className={cn(TYPOGRAPHY.muted.sm)}>
            {extractedCount}/{totalFields} fields
          </span>
        </div>

        {/* Progress Bar with Glow Effect */}
        {isExtracting && (
          <div className="space-y-2">
            <div className="relative">
              <Progress value={progress} className="h-1.5 animate-pulse-glow" />
              <div
                className="absolute top-0 h-1.5 rounded-full bg-primary/50 blur-sm transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 animate-pulse text-primary" />
              <p
                className={cn(TYPOGRAPHY.muted.sm, "text-primary font-medium")}
              >
                {statusMessage || "Analyzing content..."}
              </p>
            </div>
          </div>
        )}

        {/* Overall Confidence Badge */}
        {!isExtracting && result?.confidence && (
          <div className="flex items-center gap-2">
            <span className={cn(TYPOGRAPHY.muted.sm)}>Overall confidence:</span>
            <span
              className={cn(
                TYPOGRAPHY.heading.sm,
                result.confidence >= 0.8
                  ? "text-green-500"
                  : result.confidence >= 0.6
                    ? "text-yellow-500"
                    : "text-amber-500",
              )}
            >
              {Math.round(result.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Warnings */}
      {result?.warnings && result.warnings.length > 0 && (
        <div className="mx-4 mt-4">
          <Alert
            variant="default"
            className="border-yellow-500/30 bg-yellow-500/10"
          >
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm text-yellow-500">
              {result.warnings[0]}
              {result.warnings.length > 1 &&
                ` (+${result.warnings.length - 1} more)`}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Suggestions */}
      {result?.suggestions && result.suggestions.length > 0 && (
        <div className="mx-4 mt-2">
          <Alert variant="default" className="border-primary/30 bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              {result.suggestions[0]}
              {result.suggestions.length > 1 &&
                ` (+${result.suggestions.length - 1} more)`}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* BMC Fields - Smart Grouped (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-3">
          {/* Needs Review Section */}
          {groupedFields.needsReview.length > 0 && (
            <div
              className="space-y-2 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <h4
                className={cn(
                  TYPOGRAPHY.heading.xs,
                  "text-yellow-500 flex items-center gap-2",
                )}
              >
                <AlertCircle className="h-4 w-4" />
                Needs Review ({groupedFields.needsReview.length})
              </h4>
              <div className="space-y-2">
                {groupedFields.needsReview.map((fieldId, index) => (
                  <div
                    key={fieldId}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                  >
                    <BMCFieldCard
                      fieldId={fieldId}
                      label={BMC_FIELD_LABELS[fieldId]}
                      value={result?.bmcData?.[fieldId] || ""}
                      confidence={
                        result?.fieldConfidences?.[fieldId] ||
                        result?.confidence ||
                        0
                      }
                      status={fieldStatuses[fieldId]}
                      onChange={(value) => onFieldChange(fieldId, value)}
                      autoExpand
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracting Section */}
          {groupedFields.extracting.length > 0 && (
            <div className="space-y-2">
              <h4 className={cn(TYPOGRAPHY.heading.xs, "text-primary")}>
                Extracting... ({groupedFields.extracting.length})
              </h4>
              <div className="space-y-2">
                {groupedFields.extracting.map((fieldId) => (
                  <BMCFieldCard
                    key={fieldId}
                    fieldId={fieldId}
                    label={BMC_FIELD_LABELS[fieldId]}
                    value={result?.bmcData?.[fieldId] || ""}
                    confidence={result?.confidence || 0}
                    status={fieldStatuses[fieldId]}
                    onChange={(value) => onFieldChange(fieldId, value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Extracted Section */}
          {groupedFields.extracted.length > 0 && (
            <div
              className="space-y-2 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <h4
                className={cn(
                  TYPOGRAPHY.heading.xs,
                  "text-green-500 flex items-center gap-2",
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                Extracted ({groupedFields.extracted.length})
              </h4>
              <div className="space-y-2">
                {groupedFields.extracted.map((fieldId, index) => (
                  <div
                    key={fieldId}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${0.35 + index * 0.05}s` }}
                  >
                    <BMCFieldCard
                      fieldId={fieldId}
                      label={BMC_FIELD_LABELS[fieldId]}
                      value={result?.bmcData?.[fieldId] || ""}
                      confidence={
                        result?.fieldConfidences?.[fieldId] ||
                        result?.confidence ||
                        0
                      }
                      status={fieldStatuses[fieldId]}
                      onChange={(value) => onFieldChange(fieldId, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty/Pending Section */}
          {groupedFields.empty.length > 0 && !isExtracting && (
            <div className="space-y-2">
              <h4
                className={cn(TYPOGRAPHY.heading.xs, "text-muted-foreground")}
              >
                Not Found ({groupedFields.empty.length})
              </h4>
              <div className="space-y-2">
                {groupedFields.empty.map((fieldId) => (
                  <BMCFieldCard
                    key={fieldId}
                    fieldId={fieldId}
                    label={BMC_FIELD_LABELS[fieldId]}
                    value={result?.bmcData?.[fieldId] || ""}
                    confidence={0}
                    status={fieldStatuses[fieldId]}
                    onChange={(value) => onFieldChange(fieldId, value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
