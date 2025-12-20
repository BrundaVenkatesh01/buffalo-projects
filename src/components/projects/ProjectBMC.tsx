"use client";

import { useState } from "react";

import { Button, Card, CardContent } from "@/components/unified";
import { BMC_FIELDS } from "@/constants/bmcFields";
import { ChevronDown, ChevronUp, Briefcase } from "@/icons";
import { cn } from "@/lib/utils";
import { PROJECT_PAGE } from "@/tokens/semantic/project-page";
import type { Workspace } from "@/types";

interface ProjectBMCProps {
  workspace: Workspace;
  className?: string;
}

/**
 * ProjectBMC Component
 *
 * Collapsible Business Model Canvas viewer for public project pages.
 * Only renders if the workspace has BMC data.
 */
export function ProjectBMC({ workspace, className }: ProjectBMCProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if workspace has any BMC data
  const hasBMCData =
    workspace.bmcData &&
    BMC_FIELDS.some((field) => {
      const content = workspace.bmcData[field.id];
      return content && String(content).trim().length > 0;
    });

  if (!hasBMCData) {
    return null;
  }

  // Get filled blocks count
  const filledBlocks = BMC_FIELDS.filter((field) => {
    const content = workspace.bmcData[field.id];
    return content && String(content).trim().length > 0;
  }).length;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header with Expand/Collapse */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={cn(
              PROJECT_PAGE.section.header.size,
              PROJECT_PAGE.section.header.tracking,
              PROJECT_PAGE.section.header.transform,
              PROJECT_PAGE.section.header.weight,
              PROJECT_PAGE.section.header.color,
            )}
          >
            Business Model Canvas
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {filledBlocks} of {BMC_FIELDS.length} blocks completed
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              Hide Canvas
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View Canvas
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Collapsible BMC Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-300">
          {BMC_FIELDS.map((field) => {
            const content = workspace.bmcData[field.id];
            const hasContent = content && String(content).trim().length > 0;

            return (
              <Card
                key={field.id}
                className={cn(
                  "transition-all duration-200",
                  hasContent
                    ? "border-primary/20 bg-card"
                    : "border-dashed opacity-60",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {field.title}
                      </h3>
                      {hasContent ? (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {String(content)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Not specified
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/10 p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Briefcase className="h-5 w-5" />
            <span>
              This project includes a detailed business model canvas. Click
              &quot;View Canvas&quot; to explore the strategy and planning
              behind it.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
