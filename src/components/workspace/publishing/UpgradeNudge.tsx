/**
 * Upgrade Nudge Component
 *
 * Shows after Quick Share publish to encourage users to enhance their listing.
 * Displays specific, actionable improvements with impact metrics.
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState, type ElementType } from "react";

import { Button } from "@/components/unified";
import { X, Image, Link, Users, Heart, ArrowRight, CheckCircle } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

interface NudgeItem {
  id: string;
  icon: ElementType;
  title: string;
  description: string;
  impact: string;
  section: "media" | "links" | "community" | "team";
  check: (workspace: Workspace) => boolean;
}

const NUDGE_ITEMS: NudgeItem[] = [
  {
    id: "cover",
    icon: Image,
    title: "Add a cover image",
    description: "Projects with cover images get significantly more clicks",
    impact: "+40% more clicks",
    section: "media",
    check: (w) => !!w.assets?.coverImage,
  },
  {
    id: "asks",
    icon: Users,
    title: "Set your Asks",
    description: "Tell the community what you need help with",
    impact: "+60% more matches",
    section: "community",
    check: (w) => (w.asks?.length ?? 0) > 0,
  },
  {
    id: "gives",
    icon: Heart,
    title: "Share your Gives",
    description: "What can you offer to other builders?",
    impact: "+35% more connections",
    section: "community",
    check: (w) => (w.gives?.length ?? 0) > 0,
  },
  {
    id: "demo",
    icon: Link,
    title: "Add a demo link",
    description: "Let people try your project directly",
    impact: "+50% engagement",
    section: "links",
    check: (w) => !!w.embeds?.demo,
  },
];

interface UpgradeNudgeProps {
  workspace: Workspace;
  onUpgrade: (section: "media" | "links" | "community" | "team") => void;
  onDismiss: () => void;
  className?: string;
}

export function UpgradeNudge({
  workspace,
  onUpgrade,
  onDismiss,
  className,
}: UpgradeNudgeProps) {
  const [dismissed, setDismissed] = useState(false);

  // Filter to only show incomplete items
  const incompleteItems = NUDGE_ITEMS.filter((item) => !item.check(workspace));

  // If all items are complete, don't show the nudge
  if (incompleteItems.length === 0 || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "rounded-2xl border border-primary/20 bg-primary/5 p-6",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-lg text-foreground">
              Enhance your listing
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quick improvements to stand out in the gallery
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nudge Items */}
        <div className="space-y-3">
          {incompleteItems.slice(0, 3).map((item) => (
            <m.button
              key={item.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onUpgrade(item.section)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl",
                "bg-white/5 border border-white/10",
                "hover:bg-white/10 hover:border-primary/30",
                "transition-colors text-left",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">
                    {item.title}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {item.impact}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </m.button>
          ))}
        </div>

        {/* Completed count */}
        {NUDGE_ITEMS.length - incompleteItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span>
              {NUDGE_ITEMS.length - incompleteItems.length} of{" "}
              {NUDGE_ITEMS.length} enhancements complete
            </span>
          </div>
        )}

        {/* Switch to Full Showcase CTA */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpgrade("media")}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Or switch to Full Showcase for all options
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </m.div>
    </AnimatePresence>
  );
}

export default UpgradeNudge;
