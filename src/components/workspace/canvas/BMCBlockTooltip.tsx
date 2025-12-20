/**
 * BMC Block Tooltip
 *
 * Educational tooltip for Business Model Canvas blocks.
 * Shows on hover when hints are enabled, providing:
 * - Block explanation
 * - Key question to answer
 * - Examples for inspiration
 * - Practical tip
 */

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBMCTooltip } from "@/constants/bmcTooltips";
import { HelpCircle, Lightbulb } from "@/icons";
import { cn } from "@/lib/utils";
import type { CanvasBlockId } from "@/types";

interface BMCBlockTooltipProps {
  /** The block ID to show tooltip for */
  blockId: CanvasBlockId;
  /** Whether hints are enabled globally */
  showHints?: boolean;
  /** Optional className for the trigger button */
  className?: string;
}

export function BMCBlockTooltip({
  blockId,
  showHints = true,
  className,
}: BMCBlockTooltipProps) {
  const tooltip = getBMCTooltip(blockId);

  if (!showHints) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-full p-1",
              "text-muted-foreground/60 hover:text-muted-foreground",
              "hover:bg-white/5 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              className,
            )}
            aria-label={`Help for ${tooltip.label}`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="max-w-sm p-0 bg-background/95 backdrop-blur-sm border-white/10"
        >
          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">
                {tooltip.label}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tooltip.explanation}
              </p>
            </div>

            {/* Key Question */}
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-xs font-medium text-primary">
                {tooltip.question}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Examples
              </p>
              <ul className="space-y-1">
                {tooltip.examples.map((example, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary/60 mt-0.5">•</span>
                    <span className="italic">&quot;{example}&quot;</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2 pt-2 border-t border-white/5">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-medium text-amber-400">Tip:</span>{" "}
                {tooltip.tip}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
