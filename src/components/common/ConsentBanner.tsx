"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui-next";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import AnalyticsService from "@/services/analyticsService";

const analyticsEnabled = env.getFlag("NEXT_PUBLIC_ENABLE_ANALYTICS", [
  "VITE_ENABLE_ANALYTICS",
]);

export default function ConsentBanner({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);
  const [consentState, setConsentState] = useState<
    "granted" | "denied" | "unset"
  >(AnalyticsService.getConsentState());

  useEffect(() => {
    if (!analyticsEnabled) {
      return;
    }

    const currentConsent = AnalyticsService.getConsentState();
    setConsentState(currentConsent);
    setVisible(currentConsent !== "granted");
  }, []);

  if (!analyticsEnabled || !visible) {
    return null;
  }

  const accept = () => {
    AnalyticsService.setConsent(true);
    setConsentState("granted");
    setVisible(false);
  };

  const decline = () => {
    AnalyticsService.setConsent(false);
    setConsentState("denied");
    setVisible(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 z-[60] mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-white/10 bg-[#0b0d0f]/95 px-6 py-5 text-sm text-muted-foreground shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      role="region"
      aria-label="Analytics consent banner"
    >
      <div className="space-y-2">
        <p className="font-display text-base text-foreground">
          Allow analytics cookies?
        </p>
        <p>
          We use PostHog and Google Analytics to understand how Buffalo builders
          use the platform. Declining keeps everything local. You can change
          this later in settings.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          variant="outline"
          className="rounded-full px-5"
          onClick={decline}
          aria-pressed={consentState === "denied"}
        >
          Decline
        </Button>
        <Button
          className="rounded-full px-5"
          onClick={accept}
          aria-pressed={consentState === "granted"}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
