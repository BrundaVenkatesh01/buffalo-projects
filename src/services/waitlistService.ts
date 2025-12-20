import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/services/firebase";
import type { WaitlistInterest } from "@/types/waitlist";

const WAITLIST_COLLECTION = "twenty_six_waitlist";

interface AddToWaitlistParams {
  email: string;
  name: string;
  interests: WaitlistInterest[];
  referralSource?: string;
}

/**
 * Add user to '26 waitlist
 */
export async function addToWaitlist({
  email,
  name,
  interests,
  referralSource,
}: AddToWaitlistParams): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      throw new Error("Firebase not initialized");
    }

    // Check if email already exists
    const existingQuery = query(
      collection(db, WAITLIST_COLLECTION),
      where("email", "==", email.toLowerCase()),
    );
    const existingDocs = await getDocs(existingQuery);

    if (!existingDocs.empty) {
      return {
        success: false,
        error: "This email is already on the waitlist.",
      };
    }

    // Add to waitlist
    await addDoc(collection(db, WAITLIST_COLLECTION), {
      email: email.toLowerCase(),
      name: name.trim(),
      interests,
      referralSource: referralSource?.trim(),
      joinedAt: serverTimestamp(),
      notified: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return {
      success: false,
      error: "Failed to join waitlist. Please try again.",
    };
  }
}

/**
 * Check if email is already on waitlist
 */
export async function isOnWaitlist(email: string): Promise<boolean> {
  try {
    if (!db) {
      return false;
    }

    const q = query(
      collection(db, WAITLIST_COLLECTION),
      where("email", "==", email.toLowerCase()),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking waitlist:", error);
    return false;
  }
}
