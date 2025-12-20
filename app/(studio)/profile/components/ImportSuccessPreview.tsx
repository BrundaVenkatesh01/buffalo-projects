"use client";
/* eslint-disable no-case-declarations */

import { m } from "framer-motion";
import React from "react";

import { Badge } from "@/components/unified";
import {
  CheckCircle2,
  FileText,
  Tag,
  Star,
  GitFork,
  Calendar,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  AlertCircle,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { UnifiedImportResult } from "@/services/urlAnalyzerService";

interface ImportSuccessPreviewProps {
  result: UnifiedImportResult;
  className?: string;
}

interface FieldMappingItem {
  label: string;
  value: string | number | string[] | undefined;
  icon: React.ReactNode;
  type: "text" | "badge" | "number" | "tags" | "confidence";
  category: "core" | "details" | "metrics";
}

export function ImportSuccessPreview({
  result,
  className,
}: ImportSuccessPreviewProps) {
  // Build field mappings from import result
  const fieldMappings: FieldMappingItem[] = [
    // Core fields
    {
      label: "Project Name",
      value: result.projectName,
      icon: <FileText className="h-4 w-4" />,
      type: "text" as const,
      category: "core" as const,
    },
    {
      label: "One Liner",
      value: result.oneLiner,
      icon: <Lightbulb className="h-4 w-4" />,
      type: "text" as const,
      category: "core" as const,
    },
    {
      label: "Stage",
      value: result.stage,
      icon: <Target className="h-4 w-4" />,
      type: "badge" as const,
      category: "core" as const,
    },
    {
      label: "Description",
      value: result.description,
      icon: <FileText className="h-4 w-4" />,
      type: "text" as const,
      category: "details" as const,
    },
    {
      label: "Tags",
      value: result.tags,
      icon: <Tag className="h-4 w-4" />,
      type: "tags" as const,
      category: "details" as const,
    },

    // Metrics (if GitHub)
    ...(result.githubStats
      ? [
          {
            label: "Stars",
            value: result.githubStats.stars,
            icon: <Star className="h-4 w-4" />,
            type: "number" as const,
            category: "metrics" as const,
          },
          {
            label: "Forks",
            value: result.githubStats.forks,
            icon: <GitFork className="h-4 w-4" />,
            type: "number" as const,
            category: "metrics" as const,
          },
          {
            label: "Contributors",
            value: result.githubStats.contributors,
            icon: <Users className="h-4 w-4" />,
            type: "number" as const,
            category: "metrics" as const,
          },
          {
            label: "Last Commit",
            value: result.githubStats.lastCommit
              ? new Date(result.githubStats.lastCommit).toLocaleDateString()
              : undefined,
            icon: <Calendar className="h-4 w-4" />,
            type: "text" as const,
            category: "metrics" as const,
          },
        ]
      : []),

    // Extraction confidence
    {
      label: "Extraction Quality",
      value: result.confidence,
      icon: <TrendingUp className="h-4 w-4" />,
      type: "confidence" as const,
      category: "details" as const,
    },
  ].filter(
    (item) =>
      item.value !== undefined && item.value !== null && item.value !== "",
  );

  // Categorize fields
  const coreFields = fieldMappings.filter((f) => f.category === "core");
  const detailFields = fieldMappings.filter((f) => f.category === "details");
  const metricFields = fieldMappings.filter((f) => f.category === "metrics");

  const bmcFieldsCount = Object.values(result.bmcData || {}).filter(
    (v) => v && String(v).trim().length > 0,
  ).length;

  const confidenceLevel =
    result.confidence > 0.7
      ? "high"
      : result.confidence > 0.4
        ? "medium"
        : "low";

  const confidenceColor =
    confidenceLevel === "high"
      ? "text-green-600 dark:text-green-500"
      : confidenceLevel === "medium"
        ? "text-amber-600 dark:text-amber-500"
        : "text-orange-600 dark:text-orange-500";

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">
            {result.projectName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {result.oneLiner || result.description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="text-xs capitalize">
              {result.stage}
            </Badge>
            <span className={cn("text-xs font-medium", confidenceColor)}>
              {confidenceLevel.charAt(0).toUpperCase() +
                confidenceLevel.slice(1)}{" "}
              confidence ({Math.round(result.confidence * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Field Mappings */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Extracted Fields
        </h4>

        {/* Core Fields */}
        {coreFields.length > 0 && (
          <div className="space-y-2">
            {coreFields.map((field, index) => (
              <FieldRow key={`core-${index}`} field={field} />
            ))}
          </div>
        )}

        {/* Detail Fields */}
        {detailFields.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {detailFields.map((field, index) => (
              <FieldRow key={`detail-${index}`} field={field} />
            ))}
          </div>
        )}

        {/* Metric Fields (GitHub) */}
        {metricFields.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              GitHub Metrics
            </p>
            <div className="grid grid-cols-2 gap-2">
              {metricFields.map((field, index) => (
                <FieldRow key={`metric-${index}`} field={field} compact />
              ))}
            </div>
          </div>
        )}

        {/* BMC Data Summary */}
        {bmcFieldsCount > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                <strong>{bmcFieldsCount}</strong> Business Model Canvas fields
                extracted
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Warnings
          </h4>
          <ul className="space-y-1">
            {result.warnings.map((warning, index) => (
              <li
                key={index}
                className="text-xs text-amber-600 dark:text-amber-500 flex items-start gap-2"
              >
                <span className="mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </m.div>
  );
}

interface FieldRowProps {
  field: FieldMappingItem;
  compact?: boolean;
}

function FieldRow({ field, compact = false }: FieldRowProps) {
  const renderValue = () => {
    switch (field.type) {
      case "text":
        return (
          <span
            className={cn("text-foreground", compact ? "text-xs" : "text-sm")}
          >
            {String(field.value)}
          </span>
        );

      case "badge":
        return (
          <Badge variant="secondary" className="text-xs capitalize">
            {String(field.value)}
          </Badge>
        );

      case "number":
        return (
          <span
            className={cn(
              "font-medium text-foreground",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {typeof field.value === "number"
              ? field.value.toLocaleString()
              : field.value}
          </span>
        );

      case "tags":
        return (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(field.value) &&
              field.value.slice(0, 5).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            {Array.isArray(field.value) && field.value.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{field.value.length - 5}
              </Badge>
            )}
          </div>
        );

      case "confidence":
        const confidence = Number(field.value);
        const confidenceLevel =
          confidence > 0.7 ? "high" : confidence > 0.4 ? "medium" : "low";
        const color =
          confidenceLevel === "high"
            ? "text-green-600 dark:text-green-500"
            : confidenceLevel === "medium"
              ? "text-amber-600 dark:text-amber-500"
              : "text-orange-600 dark:text-orange-500";
        return (
          <span className={cn("text-xs font-medium", color)}>
            {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)}{" "}
            ({Math.round(confidence * 100)}%)
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-md transition-colors hover:bg-muted/50",
        compact && "gap-2 p-1.5",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center shrink-0 rounded-md bg-primary/10 text-primary",
          compact ? "h-6 w-6" : "h-8 w-8",
        )}
      >
        {field.icon}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className={cn(
            "font-medium text-muted-foreground",
            compact ? "text-xs" : "text-xs",
          )}
        >
          {field.label}
        </p>
        <div className="break-words">{renderValue()}</div>
      </div>
    </div>
  );
}
