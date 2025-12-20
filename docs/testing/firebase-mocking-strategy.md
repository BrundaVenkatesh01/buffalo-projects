# Firebase Testing Strategy

## Goal

Provide a repeatable approach for unit testing Firebase-dependent services (`firebaseDatabase`, `commentService`, `notificationService`) without hitting real Firestore or Auth during Vitest runs.

## Approach

- **In-memory Firestore harness**: Build a lightweight harness that mimics the subset of Firestore APIs our services call (`collection`, `doc`, `addDoc`, `setDoc`, `updateDoc`, `getDoc`, `getDocs`, `query`, `where`, `orderBy`, `limit`, `serverTimestamp`, `increment`, `arrayUnion`, `arrayRemove`, `getCountFromServer`, and `onSnapshot`).
- **Module mocks**: In each test, call `vi.mock("firebase/firestore", () => harness.exports)` _before_ importing the service under test. Pair this with `vi.mock("@/services/firebase", () => ({ db: harness.db, auth: harness.auth, storage: null }))` to wire in-memory instances.
- **Sentinel handling**: The harness tracks special FieldValues (increment, array ops, timestamps) so that service logic like `adjustCommentCount` can be exercised without Firebase.
- **Subscription support**: `onSnapshot` triggers registered listeners immediately with the in-memory snapshot, enabling tests to assert notification/comment listeners.
- **Auth helpers**: Provide helpers to seed the mock auth state (`setCurrentUser`, `clearCurrentUser`) so comment/notification flows that require `auth.currentUser` can be validated.
- **Reset between tests**: Expose `reset()` to wipe collections, listeners, and auth state in `beforeEach` hooks.

## Next Steps

1. Implement the harness in `src/services/__tests__/firebaseTestHarness.ts`.
2. Add shared helpers for seeding documents (`seedCollection`, `createWorkspaceDoc`) to reduce boilerplate in unit tests.
3. Write first Firebase-backed unit test (`notificationService.test.ts`) using the harness and iterate on missing API surface as needed.
