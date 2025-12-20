/**
 * Firebase Mock Setup for Vitest
 *
 * This file provides mock implementations of Firebase modules for testing.
 * It's automatically loaded before tests run via vitest.config.ts setupFiles.
 */

import { vi } from "vitest";

// ============================================================================
// Firestore Mocks
// ============================================================================

export const mockFirestoreDoc: any = {
  id: "mock-doc-id",
  exists: () => true,
  data: () => ({ mockData: true }),
};

export const mockFirestoreCollection = {
  id: "mock-collection-id",
};

// Mock Timestamp class for instanceof checks
class MockTimestamp {
  seconds: number;
  nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate() {
    return new Date(this.seconds * 1000);
  }

  static now() {
    return new MockTimestamp(Math.floor(Date.now() / 1000), 0);
  }

  static fromDate(date: Date) {
    return new MockTimestamp(Math.floor(date.getTime() / 1000), 0);
  }
}

export const mockFirestoreTimestamp = MockTimestamp;

// Mock Firestore functions
export const mockCollection = vi.fn(() => mockFirestoreCollection);
export const mockDoc = vi.fn(() => mockFirestoreDoc);
export const mockGetDoc = vi.fn(async () => mockFirestoreDoc);
export const mockGetDocs = vi.fn(async () => ({
  docs: [mockFirestoreDoc],
  empty: false,
  size: 1,
}));
export const mockSetDoc = vi.fn(() => Promise.resolve());
export const mockUpdateDoc = vi.fn(() => Promise.resolve());
export const mockDeleteDoc = vi.fn(() => Promise.resolve());
export const mockAddDoc = vi.fn(async () => mockFirestoreDoc);
export const mockQuery = vi.fn((collection) => collection);
export const mockWhere = vi.fn(() => ({}));
export const mockOrderBy = vi.fn(() => ({}));
export const mockLimit = vi.fn(() => ({}));
export const mockOnSnapshot = vi.fn(() => vi.fn()); // Returns unsubscribe function

// ============================================================================
// Auth Mocks
// ============================================================================

export const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
  emailVerified: true,
};

export const mockAuth: any = {
  currentUser: mockUser,
  onAuthStateChanged: vi.fn((callback) => {
    callback(mockUser);
    return vi.fn(); // Unsubscribe function
  }),
};

export const mockSignInWithEmailAndPassword = vi.fn(async () => ({
  user: mockUser,
}));
export const mockSignOut = vi.fn(() => Promise.resolve());
export const mockOnAuthStateChanged = vi.fn((_auth, callback) => {
  callback(mockUser);
  return vi.fn(); // Unsubscribe
});

// ============================================================================
// Storage Mocks
// ============================================================================

export const mockStorageRef = {
  fullPath: "mock/path",
  name: "mock-file",
};

export const mockRef = vi.fn(() => mockStorageRef);
export const mockUploadBytes = vi.fn(async () => ({ ref: mockStorageRef }));
export const mockGetDownloadURL = vi.fn(
  async () => "https://example.com/mock-download-url",
);
export const mockDeleteObject = vi.fn(() => Promise.resolve());

// ============================================================================
// Firebase App Mocks
// ============================================================================

export const mockFirebaseApp = {
  name: "[DEFAULT]",
  options: {
    apiKey: "mock-api-key",
    authDomain: "mock-app.firebaseapp.com",
    projectId: "mock-project",
  },
  automaticDataCollectionEnabled: false,
};

export const mockInitializeApp = vi.fn(() => mockFirebaseApp);
export const mockGetApp = vi.fn(() => mockFirebaseApp);
export const mockGetApps = vi.fn(() => [mockFirebaseApp]);

// ============================================================================
// Set up global mocks
// ============================================================================

// Mock firebase/firestore
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({ type: "firestore" })),
  collection: mockCollection,
  doc: mockDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  addDoc: mockAddDoc,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  onSnapshot: mockOnSnapshot,
  Timestamp: mockFirestoreTimestamp,
  serverTimestamp: () => mockFirestoreTimestamp.now(),
}));

// Mock firebase/auth
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => mockAuth),
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
}));

// Mock firebase/storage
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({ type: "storage" })),
  ref: mockRef,
  uploadBytes: mockUploadBytes,
  getDownloadURL: mockGetDownloadURL,
  deleteObject: mockDeleteObject,
}));

// Mock firebase/app
vi.mock("firebase/app", () => ({
  initializeApp: mockInitializeApp,
  getApp: mockGetApp,
  getApps: mockGetApps,
}));

// ============================================================================
// Helper functions for tests
// ============================================================================

/**
 * Reset all Firebase mocks to their initial state
 * Call this in beforeEach() to ensure test isolation
 */
export function resetFirebaseMocks() {
  mockCollection.mockClear();
  mockDoc.mockClear();
  mockGetDoc.mockClear();
  mockGetDocs.mockClear();
  mockSetDoc.mockClear();
  mockUpdateDoc.mockClear();
  mockDeleteDoc.mockClear();
  mockAddDoc.mockClear();
  mockQuery.mockClear();
  mockWhere.mockClear();
  mockOrderBy.mockClear();
  mockLimit.mockClear();
  mockOnSnapshot.mockClear();
  mockSignInWithEmailAndPassword.mockClear();
  mockSignOut.mockClear();
  mockOnAuthStateChanged.mockClear();
  mockRef.mockClear();
  mockUploadBytes.mockClear();
  mockGetDownloadURL.mockClear();
  mockDeleteObject.mockClear();
  mockInitializeApp.mockClear();
  mockGetApp.mockClear();
  mockGetApps.mockClear();
}

/**
 * Configure mock Firestore to return specific data
 */
export function mockFirestoreData(data: any) {
  mockFirestoreDoc.data = () => data;
  mockGetDoc.mockResolvedValue({
    ...mockFirestoreDoc,
    exists: () => true,
    data: () => data,
  });
}

/**
 * Configure mock Firestore to return "not found"
 */
export function mockFirestoreNotFound() {
  mockGetDoc.mockResolvedValue({
    ...mockFirestoreDoc,
    exists: () => false,
    data: () => undefined,
  });
}

/**
 * Configure mock Auth to have no user (signed out)
 */
export function mockAuthSignedOut() {
  mockAuth.currentUser = null;
  mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
    callback(null);
    return vi.fn();
  });
}

/**
 * Configure mock Auth to have a signed-in user
 */
export function mockAuthSignedIn(user = mockUser) {
  mockAuth.currentUser = user;
  mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
    callback(user);
    return vi.fn();
  });
}

// Export all mocks for use in tests
export const firebaseMocks = {
  // Firestore
  collection: mockCollection,
  doc: mockDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  addDoc: mockAddDoc,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  onSnapshot: mockOnSnapshot,

  // Auth
  auth: mockAuth,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,

  // Storage
  ref: mockRef,
  uploadBytes: mockUploadBytes,
  getDownloadURL: mockGetDownloadURL,
  deleteObject: mockDeleteObject,

  // App
  initializeApp: mockInitializeApp,
  getApp: mockGetApp,
  getApps: mockGetApps,

  // Helpers
  resetFirebaseMocks,
  mockFirestoreData,
  mockFirestoreNotFound,
  mockAuthSignedOut,
  mockAuthSignedIn,
};

// Log that mocks are loaded
if (process.env["VITEST"]) {
  console.log("Firebase mocks loaded");
}
