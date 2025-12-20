import type { Timestamp } from "firebase/firestore";

/**
 * '26 Waitlist Entry
 * Users who want early access to Programs, Field Guide, and Resources
 */
export interface TwentySixWaitlist {
  id: string;
  email: string;
  name: string;
  joinedAt: Timestamp;
  notified: boolean; // Set true on Jan 1, 2026 when we email them
  interests: string[]; // Which parts of '26 they're interested in
  referralSource?: string; // How they heard about Buffalo Projects
}

/**
 * Waitlist interests (what user wants access to)
 */
export const WAITLIST_INTERESTS = {
  SEASONS: "seasons",
  FIELD_GUIDE: "field_guide",
  RESOURCES: "resources",
  RITUALS: "rituals",
  ALL: "all",
} as const;

export type WaitlistInterest =
  (typeof WAITLIST_INTERESTS)[keyof typeof WAITLIST_INTERESTS];
