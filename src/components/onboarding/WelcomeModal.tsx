/**
 * Welcome Modal
 *
 * Dismissible overlay modal shown to first-time users on dashboard.
 * Explains what Buffalo Projects is, the core loop, and key actions.
 * Persists dismissal via onboardingStore so it only shows once.
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
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "@/icons";
import { useOnboardingStore } from "@/stores/onboardingStore";

interface WelcomeModalProps {
  /** Override for testing - forces modal to show */
  forceShow?: boolean;
}

export function WelcomeModal({ forceShow = false }: WelcomeModalProps) {
  const hasSeenWelcomeModal = useOnboardingStore(
    (state) => state.hasSeenWelcomeModal,
  );
  const markWelcomeModalSeen = useOnboardingStore(
    (state) => state.markWelcomeModalSeen,
  );

  const [isOpen, setIsOpen] = useState(false);

  // Show modal on mount if user hasn't seen it
  useEffect(() => {
    if (forceShow || !hasSeenWelcomeModal) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [forceShow, hasSeenWelcomeModal]);

  const handleDismiss = () => {
    setIsOpen(false);
    markWelcomeModalSeen();
  };

  const features = [
    {
      icon: Layers3,
      title: "Private Canvas",
      description: "Iterate safely using the Project Canvas editor",
      color: "text-primary",
      bg: "bg-primary/20",
    },
    {
      icon: Users,
      title: "Community Gallery",
      description: "Publish to a curated, auth-only showcase when ready",
      color: "text-emerald-400",
      bg: "bg-emerald-400/20",
    },
    {
      icon: MessageSquare,
      title: "Peer Comments",
      description: "Get validation and feedback from fellow builders",
      color: "text-amber-400",
      bg: "bg-amber-400/20",
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
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Welcome to Buffalo Projects
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Your community-owned peer validation platform
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Core Loop Description */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Buffalo is where builders of all kinds—designers, researchers, indie hackers,
              and creators—document their work privately, publish to the community, and
              receive authentic feedback from peers.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${feature.bg}`}
                >
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </m.div>
            ))}
          </div>

          {/* The Core Loop */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
              The Core Loop
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Private Canvas</span>
              <ArrowRight className="h-3 w-3 text-primary/60" />
              <span className="font-medium">Community Gallery</span>
              <ArrowRight className="h-3 w-3 text-primary/60" />
              <span className="font-medium">Peer Comments</span>
              <ArrowRight className="h-3 w-3 text-primary/60" />
              <span className="font-medium">Iterate</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={handleDismiss} className="flex-1">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Privacy note */}
          <p className="text-[10px] text-center text-muted-foreground/60">
            Your workspaces are private by default. Publishing is always an explicit action.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
