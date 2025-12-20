"use client";

import { m, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/unified";
import { cn } from "@/lib/utils";

interface TwentySixResourceButtonProps {
  className?: string;
}

/**
 * TwentySix Resource Button
 *
 * Allows community members to volunteer as resources for future '26 cohorts.
 * Design matches the '26 program aesthetic (orange, glass morphism, animated).
 *
 * Use case: People who want to mentor, provide feedback, offer connections, etc.
 */
export function TwentySixResourceButton({
  className,
}: TwentySixResourceButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async () => {
    if (!name || !email || !expertise) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/twenty-six/resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          expertise,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      toast.success("You're in! We'll reach out when builders need your help.");
      setShowDialog(false);

      // Reset form
      setName("");
      setEmail("");
      setExpertise("");
    } catch (error) {
      console.error("Failed to submit resource sign-up:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button with '26 Branding */}
      <m.div
        className={cn("relative inline-block", className)}
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gentle pulsing glow with rainbow colors */}
        {!shouldReduceMotion && (
          <m.div
            className="absolute -inset-3 rounded-full blur-xl"
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Button with refined hover */}
        <m.div
          whileHover={
            shouldReduceMotion
              ? {}
              : {
                  scale: 1.03,
                }
          }
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Button
            size="lg"
            className="relative h-12 md:h-14 rounded-full px-10 md:px-12 text-sm md:text-base font-semibold
                       border border-white/[0.15] hover:border-white/[0.25]
                       transition-all duration-500
                       shadow-lg hover:shadow-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, rgb(168 85 247 / 0.9), rgb(236 72 153 / 0.9), rgb(59 130 246 / 0.9))",
              backgroundSize: "200% 100%",
              animation: "rainbow-shift 8s ease-in-out infinite",
            }}
            onClick={() => setShowDialog(true)}
          >
            <span className="relative z-10">Be a &apos;26 Resource</span>
          </Button>
        </m.div>
      </m.div>

      {/* Resource Sign-Up Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div>
              <DialogTitle className="text-3xl md:text-4xl font-bold mb-2">
                Join as a{" "}
                <span
                  className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "rainbow-shift 8s ease-in-out infinite",
                  }}
                >
                  &apos;26
                </span>{" "}
                Resource
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground/80">
                Give back to the next generation of builders
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Simplified Info */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-sm p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We&apos;ll occasionally reach out when builders need help in
                your area of expertise. No commitment required—help when you
                can, pass when you can&apos;t.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="resource-name"
                  className="block text-sm font-medium mb-2.5 text-foreground/90"
                >
                  Name <span className="text-purple-400">*</span>
                </label>
                <input
                  id="resource-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 text-sm
                             backdrop-blur-sm transition-all
                             placeholder:text-muted-foreground/50
                             focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="resource-email"
                  className="block text-sm font-medium mb-2.5 text-foreground/90"
                >
                  Email <span className="text-purple-400">*</span>
                </label>
                <input
                  id="resource-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 text-sm
                             backdrop-blur-sm transition-all
                             placeholder:text-muted-foreground/50
                             focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
                />
              </div>

              {/* Expertise */}
              <div>
                <label
                  htmlFor="resource-expertise"
                  className="block text-sm font-medium mb-2.5 text-foreground/90"
                >
                  How would you want to help?{" "}
                  <span className="text-purple-400">*</span>
                </label>
                <p className="text-xs text-muted-foreground/70 mb-3 leading-relaxed">
                  Could be as simple as a 1-hour coffee chat, an intro to
                  someone in your network, or sharing resources you&apos;ve
                  found helpful.
                </p>
                <input
                  id="resource-expertise"
                  type="text"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  placeholder="e.g., Product feedback, Investor intros, Technical review"
                  className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 text-sm
                             backdrop-blur-sm transition-all
                             placeholder:text-muted-foreground/50
                             focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
                />
              </div>

              {/* Optional Message - Removed for simplicity */}
            </div>

            {/* Privacy Note */}
            <div className="text-xs text-muted-foreground/70 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
              We&apos;ll reach out when builders need your help. No spam, ever.
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDialog(false);
                // Reset form on cancel
                setName("");
                setEmail("");
                setExpertise("");
              }}
              disabled={isSubmitting}
              className="rounded-full"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                void handleSubmit();
              }}
              disabled={!name || !email || !expertise || isSubmitting}
              className="rounded-full px-8
                         bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
                         hover:from-purple-600 hover:via-pink-600 hover:to-blue-600
                         disabled:from-muted disabled:via-muted disabled:to-muted
                         transition-all duration-300"
            >
              {isSubmitting ? "Joining..." : "Count Me In"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
