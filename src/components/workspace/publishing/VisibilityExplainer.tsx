/**
 * Visibility Explainer
 *
 * Explains what public vs private (draft) visibility means.
 * Helps users understand who can see their project before publishing.
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import type { ReactElement } from "react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/unified";
import { Globe, Lock, Eye, Shield, HelpCircle } from "@/icons";
import { cn } from "@/lib/utils";

interface VisibilityExplainerProps {
  /** Current visibility state */
  isPublic: boolean;
  /** Optional trigger - if not provided, uses default inline trigger */
  trigger?: ReactElement;
  /** Size variant */
  variant?: "inline" | "button";
}

export function VisibilityExplainer({
  isPublic,
  trigger,
  variant = "inline",
}: VisibilityExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const visibilityOptions = [
    {
      key: "private",
      icon: Lock,
      title: "Private (Draft)",
      description: "Only you can see this project",
      color: "text-muted-foreground",
      bg: "bg-white/10",
      details: [
        "Project is only visible to you when signed in",
        "Does not appear in the community gallery",
        "You can work on it without anyone seeing",
        "Great for iterating before you're ready to share",
      ],
    },
    {
      key: "public",
      icon: Globe,
      title: "Public (Published)",
      description: "Visible to the Buffalo community",
      color: "text-emerald-400",
      bg: "bg-emerald-400/20",
      details: [
        "Appears in the community gallery for discovery",
        "Other Buffalo members can view your project page",
        "Anyone with the link can see your project",
        "You can unpublish anytime to return to private",
      ],
    },
  ];

  const currentVisibility = visibilityOptions.find(
    (opt) => opt.key === (isPublic ? "public" : "private"),
  );

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <span onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      ) : variant === "button" ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          What does this mean?
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-3 w-3" />
          <span className="underline underline-offset-2">What does this mean?</span>
        </button>
      )}

      {/* Explainer Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-6 pt-6 pb-4">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/30 border border-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    Project Visibility
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Control who can see your project
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Current Status */}
            {currentVisibility && (
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  isPublic
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-white/10 bg-white/5",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    currentVisibility.bg,
                  )}
                >
                  <currentVisibility.icon
                    className={cn("h-4 w-4", currentVisibility.color)}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Your project is currently{" "}
                    <span className={currentVisibility.color}>
                      {currentVisibility.title.toLowerCase()}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Visibility Options */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Visibility Options
              </p>
              <AnimatePresence>
                {visibilityOptions.map((option, i) => (
                  <m.div
                    key={option.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border space-y-3",
                      option.key === (isPublic ? "public" : "private")
                        ? "border-primary/30 bg-primary/5"
                        : "border-white/5 bg-white/[0.02]",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0",
                          option.bg,
                        )}
                      >
                        <option.icon className={cn("h-4 w-4", option.color)} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {option.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-1.5 ml-12">
                      {option.details.map((detail, j) => (
                        <li
                          key={j}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <span className={cn("mt-1.5", option.color)}>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Privacy Note */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-primary">
                    Privacy First
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your workspaces are private by default. Publishing is always
                    an explicit action—we never share your work without your permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
