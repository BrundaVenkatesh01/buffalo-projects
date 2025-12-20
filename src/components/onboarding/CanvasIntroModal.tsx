/**
 * Canvas Intro Modal
 *
 * First-time introduction to the Project Canvas editor.
 * Explains the 9 blocks and how to get started.
 * Shows only once per user, with state persisted in onboardingStore.
 */

"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/unified";
import {
  Layers3,
  Target,
  Users,
  Zap,
  ArrowRight,
  Lightbulb,
  HelpCircle,
} from "@/icons";
import { useOnboardingStore } from "@/stores/onboardingStore";

interface CanvasIntroModalProps {
  /** Override for testing - forces modal to show */
  forceShow?: boolean;
}

export function CanvasIntroModal({ forceShow = false }: CanvasIntroModalProps) {
  const hasSeenCanvasIntro = useOnboardingStore(
    (state) => state.hasSeenCanvasIntro,
  );
  const markCanvasIntroSeen = useOnboardingStore(
    (state) => state.markCanvasIntroSeen,
  );
  const showBMCHints = useOnboardingStore((state) => state.showBMCHints);
  const setPendingBlockFocus = useOnboardingStore(
    (state) => state.setPendingBlockFocus,
  );

  const [isOpen, setIsOpen] = useState(false);

  // Show modal on mount if user hasn't seen it
  useEffect(() => {
    if (forceShow || !hasSeenCanvasIntro) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setIsOpen(true), 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [forceShow, hasSeenCanvasIntro]);

  const handleDismiss = () => {
    setIsOpen(false);
    markCanvasIntroSeen();
  };

  const handleBlockClick = (blockId: "valuePropositions" | "customerSegments" | null) => {
    if (blockId) {
      // Set the pending block focus BEFORE closing the modal
      setPendingBlockFocus(blockId);
    }
    handleDismiss();
  };

  const blocks = [
    {
      icon: Target,
      title: "What Makes It Special",
      description: "What unique value does your project deliver?",
      color: "text-primary",
      isCore: true,
      blockId: "valuePropositions" as const,
    },
    {
      icon: Users,
      title: "Who It's For",
      description: "Who will benefit from what you're building?",
      color: "text-emerald-400",
      isCore: true,
      blockId: "customerSegments" as const,
    },
    {
      icon: Zap,
      title: "7 Supporting Blocks",
      description: "How you reach people, your resources, partners, costs, and more",
      color: "text-muted-foreground",
      isCore: false,
      blockId: null,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-6 pt-8 pb-6">
          {/* Ambient effects */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />

          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/30 border border-primary/20">
                <Layers3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Your Project Canvas
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  A visual tool to map and iterate on your idea
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* What is the Canvas */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Project Canvas helps you think through and document your idea visually.
              It&apos;s made up of 9 interconnected blocks that describe how your project
              creates, delivers, and captures value—whether you&apos;re building a startup,
              design system, research project, or creative work.
            </p>
          </div>

          {/* Key Blocks */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Start with the Core Blocks
            </p>
            {blocks.map((block, i) => (
              <m.button
                key={block.title}
                type="button"
                onClick={() => handleBlockClick(block.blockId)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={block.isCore ? { scale: 1.02 } : undefined}
                whileTap={block.isCore ? { scale: 0.98 } : undefined}
                className={`flex items-start gap-3 p-3 rounded-lg border w-full text-left transition-all ${
                  block.isCore
                    ? "border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 cursor-pointer"
                    : "border-white/5 bg-white/[0.02] cursor-default"
                }`}
                disabled={!block.isCore}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    block.isCore ? "bg-primary/20" : "bg-white/10"
                  }`}
                >
                  <block.icon className={`h-4 w-4 ${block.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    {block.title}
                    {block.isCore && (
                      <span className="ml-2 text-[10px] font-medium text-primary bg-primary/20 px-1.5 py-0.5 rounded">
                        START HERE
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {block.description}
                  </p>
                </div>
                {block.isCore && (
                  <ArrowRight className="h-4 w-4 text-primary/50 flex-shrink-0 mt-1" />
                )}
              </m.button>
            ))}
          </div>

          {/* Tips */}
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-amber-400">
                  Getting Started Tips
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400/60">•</span>
                    <span>Click any block to start filling it in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400/60">•</span>
                    <span>Your changes auto-save every few seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400/60">•</span>
                    <span>
                      Look for the{" "}
                      <HelpCircle className="inline h-3 w-3 text-muted-foreground" />{" "}
                      icons for explanations and examples
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hints status */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Block hints are{" "}
              <span className={showBMCHints ? "text-amber-400 font-medium" : "text-foreground"}>
                {showBMCHints ? "enabled" : "disabled"}
              </span>
              . You can toggle them in the canvas toolbar.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={handleDismiss} className="flex-1">
              Start Building
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
