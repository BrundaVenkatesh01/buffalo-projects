"use client";

import { useState } from "react";

import { Badge, Button, Textarea } from "@/components/unified";
import { BORDER, TYPOGRAPHY } from "@/components/unified";
import { CheckCircle2, AlertCircle, Edit2, Loader2, Circle } from "@/icons";
import { cn } from "@/lib/utils";
import type { CanvasBlockId } from "@/types";

export type FieldExtractionStatus =
  | "pending"
  | "extracting"
  | "extracted"
  | "needs-review"
  | "empty";

export interface BMCFieldCardProps {
  fieldId: CanvasBlockId;
  label: string;
  value: string;
  confidence?: number; // 0-1 confidence score
  status: FieldExtractionStatus;
  onChange: (value: string) => void;
  autoExpand?: boolean; // Auto-expand low-confidence fields
}

export function BMCFieldCard({
  fieldId,
  label,
  value,
  confidence = 0,
  status,
  onChange,
  autoExpand = false,
}: BMCFieldCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(
    autoExpand || status === "needs-review",
  );

  const getStatusIcon = () => {
    switch (status) {
      case "extracting":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "extracted":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "needs-review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "empty":
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
        );
    }
  };

  const getConfidenceBadge = () => {
    if (status !== "extracted" && status !== "needs-review") {
      return null;
    }

    const confidencePercent = Math.round(confidence * 100);
    const variant =
      confidencePercent >= 80
        ? "default"
        : confidencePercent >= 60
          ? "secondary"
          : "outline";

    const color =
      confidencePercent >= 80
        ? "text-green-500"
        : confidencePercent >= 60
          ? "text-yellow-500"
          : "text-amber-500";

    return (
      <Badge variant={variant} className="ml-2 text-xs">
        <span className={color}>{confidencePercent}%</span>
      </Badge>
    );
  };

  const getBorderStyle = () => {
    if (status === "extracted" && confidence >= 0.8) {
      return "border-green-500/30 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent";
    }
    if (
      status === "needs-review" ||
      (status === "extracted" && confidence < 0.6)
    ) {
      return "border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent";
    }
    if (status === "extracting") {
      return "border-primary/50 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 animate-shimmer bg-[length:200%_100%]";
    }
    return BORDER.subtle;
  };

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-300",
        "transform hover:scale-[1.01] hover:shadow-lg",
        getBorderStyle(),
        status === "extracted" && "animate-fadeIn",
      )}
      style={{
        animationDelay: status === "extracted" ? "0.1s" : "0s",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5"
        aria-expanded={isExpanded}
        aria-controls={`field-${fieldId}`}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={cn(TYPOGRAPHY.heading.xs)}>{label}</span>
          {getConfidenceBadge()}
        </div>

        {/* Preview text when collapsed */}
        {!isExpanded && value && (
          <span className={cn(TYPOGRAPHY.muted.sm, "max-w-md truncate")}>
            {value}
          </span>
        )}

        {/* Status message when extracting */}
        {!isExpanded && status === "extracting" && (
          <span
            className={cn(
              TYPOGRAPHY.muted.sm,
              "flex items-center gap-1.5 text-primary",
            )}
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Extracting...
          </span>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id={`field-${fieldId}`}
          className={cn("border-t px-4 py-3", BORDER.subtle)}
        >
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                autoFocus
                placeholder={`Enter ${label.toLowerCase()}...`}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
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
                {value || status === "extracting"
                  ? value || "Analyzing..."
                  : `No ${label.toLowerCase()} data found`}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
                disabled={status === "extracting"}
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
}
