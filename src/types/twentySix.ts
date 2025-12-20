/**
 * TwentySix Program - Types and Interfaces
 * Domain models for TwentySix cohort resources and volunteers
 */

import type { Timestamp } from "firebase/firestore";

/**
 * TwentySix Resource Volunteer
 *
 * Represents a community member who has volunteered to help future '26 cohorts.
 * These are mentors, advisors, connectors who offer their expertise to builders.
 */
export interface TwentySixResource {
  id: string; // Firestore document ID
  name: string; // Volunteer's full name
  email: string; // Contact email
  expertise: string; // How they want to help (e.g., "Product feedback, Investor intros")

  // Status tracking
  status: "pending" | "contacted" | "active" | "inactive";

  // Metadata
  createdAt: string; // ISO timestamp
  lastContactedAt?: string; // ISO timestamp of last outreach
  notes?: string; // Internal notes about this resource (admin only)

  // Analytics (optional)
  helpedCount?: number; // Number of builders helped
  responseRate?: number; // 0-100, how often they respond to requests
}

/**
 * Input for creating a new TwentySix resource sign-up
 */
export interface CreateTwentySixResourceInput {
  name: string;
  email: string;
  expertise: string;
}

/**
 * Firestore-compatible version with Timestamp objects
 */
export interface FirebaseTwentySixResource
  extends Omit<TwentySixResource, "createdAt" | "lastContactedAt"> {
  createdAt: Timestamp;
  lastContactedAt?: Timestamp;
}
