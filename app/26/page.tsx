import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TwentySixLockedScreen } from "./TwentySixLockedScreen";

import { TWENTY_SIX_UNLOCKED } from "@/config/featureFlags";

export const metadata: Metadata = {
  title: "'26 - Buffalo Projects",
  description:
    "Something special for Buffalo's builder community. Unlocks January 1st, 2026.",
  openGraph: {
    title: "'26 - Buffalo Projects",
    description: "Something special unlocking January 1st, 2026",
  },
};

/**
 * '26 Page
 * - Before Jan 1, 2026: Shows locked page with countdown and waitlist
 * - After Jan 1, 2026: Redirects to /programs
 */
export default function TwentySixPage() {
  // If '26 has unlocked, redirect to programs
  if (TWENTY_SIX_UNLOCKED) {
    redirect("/programs");
  }

  // Show locked page with countdown
  return <TwentySixLockedScreen />;
}
