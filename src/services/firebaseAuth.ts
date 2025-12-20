import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { logger } from "../utils/logger";

import { auth, db, requireFirebaseAuth, requireFirestore } from "./firebase";

import type { User } from "@/types";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type { User };

class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private authStateCallbacks: ((user: User | null) => void)[] = [];

  private constructor() {
    const authInstance = auth;

    if (!authInstance) {
      logger.warn(
        "Firebase Auth is not initialized; auth state listener disabled",
      );
      return;
    }

    // Initialize auth state listener
    onAuthStateChanged(authInstance, (firebaseUser) => {
      void this.handleAuthStateChange(firebaseUser);
    });
  }

  private async handleAuthStateChange(
    firebaseUser: FirebaseUser | null,
  ): Promise<void> {
    try {
      const user = firebaseUser
        ? await this.createUserFromFirebase(firebaseUser)
        : null;
      this.authStateCallbacks.forEach((callback) => callback(user));
    } catch (error) {
      logger.error("Failed to process Firebase auth state", error);
    }
  }

  static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateCallbacks.push(callback);
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  // Create user object from Firebase user + Firestore profile
  private async createUserFromFirebase(
    firebaseUser: FirebaseUser,
  ): Promise<User> {
    let profileData: Partial<User> = {};

    const firestore = db;
    if (firestore) {
      try {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
        profileData = (userDoc.data() as Partial<User>) ?? {};
      } catch (error) {
        logger.warn("Failed to load user profile from Firestore:", error);
      }
    } else {
      logger.debug(
        "Firestore not initialized; returning basic Firebase user data",
      );
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      ...profileData, // Merge Firestore profile data
    };
  }

  // Register new user
  async register(
    email: string,
    password: string,
    profile: {
      firstName?: string;
      lastName?: string;
      buffaloConnection?: string;
      entrepreneurshipExperience?:
        | "student"
        | "first_time"
        | "serial"
        | "educator";
    },
  ): Promise<User> {
    try {
      const authInstance = requireFirebaseAuth();
      const firestore = requireFirestore();

      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password,
      );

      // Update display name
      const displayName =
        profile.firstName && profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile.firstName || "";

      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Create user profile in Firestore
      const userProfile = {
        email: firebaseUser.email,
        displayName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        buffaloConnection: profile.buffaloConnection,
        entrepreneurshipExperience: profile.entrepreneurshipExperience,

        // Defaults
        theme: "dark",
        notificationsEnabled: true,
        isMentor: false,
        emailNotifications: true,
        onboardingCompleted: false,
        subscriptionTier: "free",
        subscriptionStatus: "active",
        areasOfInterest: [],

        // Timestamps
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      } satisfies Record<string, unknown>;

      await setDoc(doc(firestore, "users", firebaseUser.uid), userProfile, {
        merge: true,
      });

      return await this.createUserFromFirebase(firebaseUser);
    } catch (error) {
      logger.error("Registration error:", error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string): Promise<User> {
    try {
      const authInstance = requireFirebaseAuth();
      const firestore = requireFirestore();

      const { user: firebaseUser } = await signInWithEmailAndPassword(
        authInstance,
        email,
        password,
      );

      // Update last login time
      await setDoc(
        doc(firestore, "users", firebaseUser.uid),
        { lastLoginAt: serverTimestamp() } satisfies Record<string, unknown>,
        { merge: true },
      );

      return await this.createUserFromFirebase(firebaseUser);
    } catch (error) {
      logger.error("Sign in error:", error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const authInstance = requireFirebaseAuth();
      await signOut(authInstance);
    } catch (error) {
      logger.error("Sign out error:", error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      const authInstance = requireFirebaseAuth();
      await sendPasswordResetEmail(authInstance, email);
    } catch (error) {
      logger.error("Password reset error:", error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<User> {
    const authInstance = requireFirebaseAuth();
    const firestore = requireFirestore();
    const currentUser = authInstance.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user");
    }

    try {
      // Update Firebase Auth profile if display name changed
      if (updates.displayName !== undefined) {
        await updateProfile(currentUser, { displayName: updates.displayName });
      }

      // Update Firestore profile
      await setDoc(
        doc(firestore, "users", currentUser.uid),
        {
          ...updates,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      return await this.createUserFromFirebase(currentUser);
    } catch (error) {
      logger.error("Profile update error:", error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const authInstance = auth;
    if (!authInstance || !authInstance.currentUser) {
      return null;
    }

    // This is synchronous and might not have Firestore data
    // For complete user data, use onAuthStateChange
    return {
      uid: authInstance.currentUser.uid,
      email: authInstance.currentUser.email,
      displayName: authInstance.currentUser.displayName,
      photoURL: authInstance.currentUser.photoURL,
      emailVerified: authInstance.currentUser.emailVerified,
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth && !!auth.currentUser;
  }

  // Handle Firebase Auth errors
  private handleAuthError(error: AuthError): Error {
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return new Error("Invalid email or password");
      case "auth/email-already-in-use":
        return new Error("Email address is already registered");
      case "auth/weak-password":
        return new Error("Password must be at least 6 characters");
      case "auth/invalid-email":
        return new Error("Invalid email address");
      case "auth/too-many-requests":
        return new Error("Too many failed attempts. Please try again later");
      case "auth/network-request-failed":
        return new Error("Network error. Please check your connection");
      default:
        return new Error(error.message || "Authentication failed");
    }
  }

  // Utility method to wait for auth initialization
  async waitForAuthInit(): Promise<User | null> {
    const authInstance = auth;
    if (!authInstance) {
      logger.warn(
        "Firebase Auth not initialized; resolving waitForAuthInit with null",
      );
      return null;
    }

    const initPromise = new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
        unsubscribe();
        void (async () => {
          try {
            const user = firebaseUser
              ? await this.createUserFromFirebase(firebaseUser)
              : null;
            resolve(user);
          } catch (error) {
            logger.error("Failed to initialize auth state", error);
            resolve(null);
          }
        })();
      });
    });

    // Enforce a 5s timeout to avoid indefinite loading states in UI
    const timeoutPromise = new Promise<User | null>((resolve) => {
      setTimeout(() => {
        logger.warn("Auth init timeout after 5s");
        resolve(null);
      }, 5000);
    });

    return await Promise.race([initPromise, timeoutPromise]);
  }
}

// Export singleton instance
export const authService = FirebaseAuthService.getInstance();
