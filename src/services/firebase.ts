// Firebase configuration and initialization
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import {
  initializeFirestore,
  getFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import { getStorage, connectStorageEmulator } from "firebase/storage";

import { getFirebaseConfig } from "../utils/env";
import { logger } from "../utils/logger";

const firebaseConfig: FirebaseOptions = getFirebaseConfig();
const hasMeasurementId =
  typeof firebaseConfig.measurementId === "string" &&
  firebaseConfig.measurementId.trim().length > 0;

// Opt-in flag to force emulator usage in dev/test
const useEmulator =
  (process.env["NEXT_PUBLIC_FIREBASE_EMULATOR"] ?? "").toString() === "1" ||
  (process.env["NEXT_PUBLIC_FIREBASE_EMULATOR"] ?? "")
    .toString()
    .toLowerCase() === "true";

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ] as const;

  const missing = requiredFields.filter((key) => !firebaseConfig[key]);

  // Check if we're in a build phase (Vercel, local build, etc.)
  const isBuildPhase =
    process.env["NEXT_PHASE"] === "phase-production-build" ||
    (process.env["VERCEL"] === "1" && typeof window === "undefined");

  // In development or build phase, warn but don't crash if config is missing
  if (!useEmulator && missing.length > 0) {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev || isBuildPhase) {
      logger.warn(`Missing Firebase configuration: ${missing.join(", ")}`);
      logger.warn(
        "Firebase features will be disabled during build. Add environment variables to enable.",
      );
      return false; // Signal that Firebase should not be initialized
    } else {
      throw new Error(
        `Missing required Firebase configuration: ${missing.join(", ")}`,
      );
    }
  }

  // Validate API key format only in production runtime (not during build)
  const apiKey = firebaseConfig.apiKey;
  const isProd = process.env.NODE_ENV === "production";
  const isBuild = process.env["NEXT_PHASE"] === "phase-production-build";

  // Check for placeholder values (common during development/build)
  const hasPlaceholderValues =
    typeof apiKey === "string" &&
    (apiKey.includes("your_") || apiKey.includes("_here") || apiKey === "");

  if (!useEmulator && hasPlaceholderValues) {
    if (isProd && !isBuild) {
      // Only fail in actual production runtime, not during builds
      throw new Error(
        "Invalid Firebase API key format - placeholder values detected",
      );
    }
    logger.warn(
      "Placeholder Firebase API key detected. Firebase features disabled.",
    );
    return false;
  }

  if (
    !useEmulator &&
    isProd &&
    !isBuild &&
    typeof apiKey === "string" &&
    !apiKey.startsWith("AIza")
  ) {
    throw new Error("Invalid Firebase API key format");
  }

  // Only warn about project ID format in production
  const projectId = firebaseConfig.projectId;
  if (
    isProd &&
    typeof projectId === "string" &&
    !projectId.includes("buffalo-projects")
  ) {
    logger.warn(
      "Firebase project ID does not match expected Buffalo Projects format",
    );
  }

  return true; // Firebase can be initialized
};

// Check if Firebase should be initialized
const shouldInitializeFirebase = validateFirebaseConfig() || useEmulator;

// Initialize Firebase conditionally
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (shouldInitializeFirebase) {
  // Initialize Firebase only if we have valid configuration
  const initializedApp = initializeApp(firebaseConfig);
  app = initializedApp;

  // Initialize Firebase services
  auth = getAuth(initializedApp);

  // Use modern persistent local cache API (browser-only)
  // Falls back to getFirestore for Node.js/SSR environments
  if (typeof window !== "undefined" && !useEmulator) {
    try {
      db = initializeFirestore(initializedApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch (error) {
      // Fallback to standard Firestore if initialization fails
      logger.warn("Failed to initialize persistent cache, using standard Firestore:", error);
      db = getFirestore(initializedApp);
    }
  } else {
    // Use standard Firestore for Node.js, SSR, or emulator mode
    db = getFirestore(initializedApp);
  }

  storage = getStorage(initializedApp);

  // Connect to emulators when requested
  if (useEmulator) {
    try {
      connectAuthEmulator(
        auth,
        process.env["FIREBASE_AUTH_EMULATOR_URL"] || "http://localhost:9099",
        { disableWarnings: true },
      );
    } catch {
      // no-op
    }
    try {
      connectFirestoreEmulator(
        db,
        process.env["FIRESTORE_EMULATOR_HOST"]?.split(":")[0] || "localhost",
        Number(process.env["FIRESTORE_EMULATOR_HOST"]?.split(":")[1]) || 8080,
      );
    } catch {
      // no-op
    }
    try {
      connectStorageEmulator(
        storage,
        process.env["FIREBASE_STORAGE_EMULATOR_HOST"]?.split(":")[0] ||
          "localhost",
        Number(process.env["FIREBASE_STORAGE_EMULATOR_HOST"]?.split(":")[1]) ||
          9199,
      );
    } catch {
      // no-op
    }
  }

  // Initialize Analytics only if supported (browser environment)
  const browserHasNetwork =
    typeof navigator === "undefined" || navigator.onLine !== false;
  const canInitializeAnalytics =
    typeof window !== "undefined" &&
    !useEmulator &&
    hasMeasurementId &&
    browserHasNetwork;

  if (canInitializeAnalytics) {
    void isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(initializedApp);
        }
      })
      .catch(() => {
        logger.warn("Firebase Analytics is not supported in this environment");
      });
  }
} else {
  // Create mock services for development without Firebase
  logger.warn("Running without Firebase. Using local storage only.");

  // Export null services that components can check
  auth = null;
  db = null;
  storage = null;
  analytics = null;
}

export const isFirebaseConfigured = shouldInitializeFirebase;

export function requireFirebaseApp(): FirebaseApp {
  if (!app) {
    throw new Error("Firebase app has not been initialized");
  }
  return app;
}

export function requireFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error("Firebase Auth has not been initialized");
  }
  return auth;
}

export function requireFirestore(): Firestore {
  if (!db) {
    throw new Error("Firebase Firestore has not been initialized");
  }
  return db;
}

export function requireFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error("Firebase Storage has not been initialized");
  }
  return storage;
}

export { analytics, auth, db, storage };

// Development emulator setup (commented out for production)
// Note: Uncomment below to use Firebase emulators in development
// if (
//   import.meta.env.DEV &&
//   typeof window !== "undefined" &&
//   shouldInitializeFirebase
// ) {
//   // Only connect to emulators in development and if Firebase is initialized
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099");
//     connectFirestoreEmulator(db, "localhost", 8080);
//     connectStorageEmulator(storage, "localhost", 9199);
//   } catch (error) {
//     // Emulators might already be connected, ignore connection errors
//     console.error("Firebase emulators connection info:", error);
//   }
// }

export default app;
