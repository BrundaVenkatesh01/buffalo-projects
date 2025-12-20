/**
 * Gives & Asks Explainer
 *
 * Explains the peer exchange system: what Gives and Asks are,
 * why they matter, and how they help builders connect.
 */

"use client";

import type { ReactElement } from "react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Badge } from "@/components/unified";
import { Gift, HandHelping, Users, Sparkles, HelpCircle } from "@/icons";

interface GivesAsksExplainerProps {
  /** Optional custom trigger */
  trigger?: ReactElement;
}

export function GivesAsksExplainer({ trigger }: GivesAsksExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const askExamples = [
    "Design feedback on my landing page",
    "Beta testers for mobile app",
    "Mentorship from founders",
  ];

  const giveExamples = [
    "Frontend development help",
    "User research guidance",
    "Product strategy sessions",
  ];

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <span onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-3 w-3" />
          <span className="underline underline-offset-2">What is this?</span>
        </button>
      )}

      {/* Explainer Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-emerald-500/20 via-amber-500/10 to-transparent px-6 pt-6 pb-4">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/30 to-amber-400/30 border border-white/10">
                  <Users className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    Community Exchange
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Give and receive help from fellow builders
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-5">
            {/* What is it */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Buffalo is built on the idea that builders help builders. The <strong>Gives & Asks</strong> system
                lets you share what help you need and what skills you can offer—making it easy
                for the community to connect and support each other.
              </p>
            </div>

            {/* Two columns for Asks and Gives */}
            <div className="grid grid-cols-2 gap-4">
              {/* Asks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20">
                    <HandHelping className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400">Asks</h4>
                    <p className="text-[10px] text-muted-foreground">What you need</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {askExamples.map((example) => (
                    <Badge
                      key={example}
                      variant="secondary"
                      className="block text-xs bg-amber-400/10 text-amber-300 border-amber-400/20 truncate"
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Gives */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20">
                    <Gift className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400">Gives</h4>
                    <p className="text-[10px] text-muted-foreground">What you offer</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {giveExamples.map((example) => (
                    <Badge
                      key={example}
                      variant="secondary"
                      className="block text-xs bg-emerald-400/10 text-emerald-300 border-emerald-400/20 truncate"
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-primary">How Matching Works</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary flex-shrink-0">
                    1
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You add what you&apos;re looking for (Asks) and what you can offer (Gives)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary flex-shrink-0">
                    2
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The gallery shows projects that match—their Gives match your Asks, or vice versa
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary flex-shrink-0">
                    3
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reach out to collaborate, offer feedback, or simply connect
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Tips:</p>
              <ul className="space-y-1 ml-3">
                <li>• Be specific—&quot;Frontend React help&quot; is better than &quot;Development help&quot;</li>
                <li>• List multiple items to increase your match potential</li>
                <li>• Update your Gives & Asks as your project evolves</li>
              </ul>
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
