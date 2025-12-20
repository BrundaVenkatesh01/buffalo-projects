"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import AccessibilityProvider from "@/components/AccessibilityProvider";
import ConsentBanner from "@/components/common/ConsentBanner";
import { LazyMotionProvider, MotionProvider } from "@/components/motion";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/authStore";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth when app loads
  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <AccessibilityProvider>
      <LazyMotionProvider>
        <MotionProvider>
          <ConsentBanner />
          {children}
          <Toaster />
        </MotionProvider>
      </LazyMotionProvider>
    </AccessibilityProvider>
  );
}
