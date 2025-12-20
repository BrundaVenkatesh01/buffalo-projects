"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import { SPACING, TYPOGRAPHY } from "@/components/unified";
import { CheckCircle2, Loader2, AlertCircle, Zap } from "@/icons";
import { cn } from "@/lib/utils";

interface ProcessingStage {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete" | "error";
  message?: string;
}

interface ImportProcessingStepProps {
  fileName?: string;
  stages: ProcessingStage[];
  progress: number;
  onComplete?: () => void;
}

export function ImportProcessingStep({
  fileName,
  stages,
  progress,
  onComplete,
}: ImportProcessingStepProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // Call onComplete when done
  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [progress, onComplete]);

  const getStatusIcon = (status: ProcessingStage["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
        );
    }
  };

  return (
    <div className={cn("flex flex-col", SPACING.lg)}>
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h3 className={cn(TYPOGRAPHY.heading.lg, "mb-2")}>
          Analyzing Your Project
        </h3>
        {fileName && (
          <p className={cn(TYPOGRAPHY.muted.md)}>
            Extracting data from{" "}
            <span className="font-medium text-foreground">{fileName}</span>
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={animatedProgress} className="h-2" />
        <p className={cn(TYPOGRAPHY.muted.sm, "text-center")}>
          {animatedProgress}% complete
        </p>
      </div>

      {/* Processing Stages */}
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-start gap-3">
            <div className="mt-0.5">{getStatusIcon(stage.status)}</div>
            <div className="flex-1">
              <p
                className={cn(
                  TYPOGRAPHY.body.md,
                  stage.status === "complete"
                    ? "text-foreground"
                    : stage.status === "processing"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                )}
              >
                {stage.label}
              </p>
              {stage.message && (
                <p
                  className={cn(
                    TYPOGRAPHY.muted.sm,
                    "mt-1",
                    stage.status === "error" && "text-destructive",
                  )}
                >
                  {stage.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Note */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className={cn(TYPOGRAPHY.muted.sm, "text-center")}>
          <Zap className="mr-1 inline-block h-4 w-4 text-primary" />
          Our AI is analyzing your content to extract Business Model Canvas
          information. This usually takes 10-20 seconds.
        </p>
      </div>
    </div>
  );
}
