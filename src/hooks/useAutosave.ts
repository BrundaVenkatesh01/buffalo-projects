/**
 * useAutosave Hook
 *
 * Handles workspace autosave with:
 * - Mutex-based concurrency control (prevents race conditions)
 * - Debouncing with configurable interval
 * - Retry logic on failure
 * - Optimistic updates with rollback
 * - Queue for pending saves
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { failureNotificationService } from "@/services/failureNotificationService";

interface AutosaveOptions {
  /** Debounce interval in milliseconds */
  interval?: number;
  /** Maximum retry attempts on failure */
  maxRetries?: number;
  /** Callback when save succeeds */
  onSuccess?: (timestamp: string) => void;
  /** Callback when save fails */
  onError?: (error: Error) => void;
}

interface AutosaveState {
  /** Is a save operation currently in progress? */
  isSaving: boolean;
  /** Is autosave pending (debouncing)? */
  isPending: boolean;
  /** Has unsaved changes? */
  isDirty: boolean;
  /** Last successful save timestamp */
  lastSaved: string | null;
  /** Number of failed retry attempts */
  retryCount: number;
}

/**
 * Custom hook for autosave functionality with race condition prevention
 *
 * @example
 * ```tsx
 * const { performSave, cancelPending, state } = useAutosave({
 *   interval: 10000,
 *   onSuccess: (timestamp) => console.log('Saved at', timestamp),
 *   onError: (error) => console.error('Save failed', error),
 * });
 *
 * // Trigger save on change
 * useEffect(() => {
 *   performSave(async () => {
 *     await saveToFirebase(data);
 *     return new Date().toISOString();
 *   });
 * }, [data]);
 * ```
 */
export function useAutosave(options: AutosaveOptions = {}) {
  const { interval = 5000, maxRetries = 3, onSuccess, onError } = options;

  const [state, setState] = useState<AutosaveState>({
    isSaving: false,
    isPending: false,
    isDirty: false,
    lastSaved: null,
    retryCount: 0,
  });

  // Mutex to prevent concurrent saves
  const saveMutexRef = useRef<boolean>(false);

  // Debounce timer
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Queue for pending save operations
  const saveQueueRef = useRef<Array<() => Promise<string>>>([]);

  // AbortController for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Acquire save mutex
   * @returns true if acquired, false if already locked
   */
  const acquireMutex = useCallback((): boolean => {
    if (saveMutexRef.current) {
      return false;
    }
    saveMutexRef.current = true;
    return true;
  }, []);

  /**
   * Release save mutex
   */
  const releaseMutex = useCallback(() => {
    saveMutexRef.current = false;
  }, []);

  /**
   * Execute save operation with mutex protection
   */
  const executeSave = useCallback(
    async (saveFn: () => Promise<string>): Promise<void> => {
      // Try to acquire mutex
      if (!acquireMutex()) {
        // Another save is in progress - queue this one
        saveQueueRef.current.push(saveFn);
        return;
      }

      // Create abort controller for this save
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setState((prev) => ({ ...prev, isSaving: true, isPending: false }));

      try {
        // Check if aborted
        if (signal.aborted) {
          throw new Error("Save operation cancelled");
        }

        // Execute save function
        const timestamp = await saveFn();

        // Check if aborted after save
        if (signal.aborted) {
          throw new Error("Save operation cancelled");
        }

        // Success
        setState((prev) => ({
          ...prev,
          isSaving: false,
          isDirty: false,
          lastSaved: timestamp,
          retryCount: 0,
        }));

        onSuccess?.(timestamp);

        // Process next item in queue
        const nextSave = saveQueueRef.current.shift();
        if (nextSave) {
          releaseMutex();
          // Small delay to prevent tight loop
          setTimeout(() => {
            void executeSave(nextSave);
          }, 100);
        } else {
          releaseMutex();
        }
      } catch (error) {
        // Check if this was a cancellation
        if (
          signal.aborted ||
          (error as Error).message === "Save operation cancelled"
        ) {
          setState((prev) => ({ ...prev, isSaving: false }));
          releaseMutex();
          return;
        }

        // Save failed - handle retry
        const nextRetryCount = state.retryCount + 1;

        if (nextRetryCount <= maxRetries) {
          // Retry after exponential backoff
          const backoffMs = Math.min(1000 * Math.pow(2, nextRetryCount), 10000);

          setState((prev) => ({
            ...prev,
            isSaving: false,
            retryCount: nextRetryCount,
          }));

          // Report transient failure with retry info
          failureNotificationService.reportTransientFailure(
            error,
            {
              operation: "Autosave",
              category: "autosave",
              message: "Save failed",
              isTransient: true,
              recovery: "retry",
            },
            nextRetryCount,
            maxRetries,
          );

          setTimeout(() => {
            releaseMutex();
            void executeSave(saveFn);
          }, backoffMs);
        } else {
          // Max retries exceeded
          setState((prev) => ({
            ...prev,
            isSaving: false,
            isDirty: true,
            retryCount: 0,
          }));

          const err = error instanceof Error ? error : new Error(String(error));
          onError?.(err);

          // Report permanent failure
          failureNotificationService.reportPermanentFailure(err, {
            operation: "Save changes",
            category: "autosave",
            message: "Unable to save changes",
            isTransient: false,
            recovery: "ignore",
          });

          releaseMutex();
        }
      }
    },
    [
      acquireMutex,
      releaseMutex,
      maxRetries,
      onSuccess,
      onError,
      state.retryCount,
    ],
  );

  /**
   * Perform save with debouncing
   */
  const performSave = useCallback(
    (saveFn: () => Promise<string>) => {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Mark as dirty and pending
      setState((prev) => ({ ...prev, isDirty: true, isPending: true }));

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        void executeSave(saveFn);
      }, interval);
    },
    [interval, executeSave],
  );

  /**
   * Perform immediate save (bypasses debounce)
   */
  const saveNow = useCallback(
    async (saveFn: () => Promise<string>): Promise<void> => {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Mark as dirty
      setState((prev) => ({ ...prev, isDirty: true }));

      // Execute immediately
      await executeSave(saveFn);
    },
    [executeSave],
  );

  /**
   * Cancel pending save
   */
  const cancelPending = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState((prev) => ({ ...prev, isPending: false }));
  }, []);

  /**
   * Clear queue (used on unmount or workspace switch)
   */
  const clearQueue = useCallback(() => {
    saveQueueRef.current = [];
    cancelPending();
  }, [cancelPending]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearQueue();
      releaseMutex();
    };
  }, [clearQueue, releaseMutex]);

  return {
    /** Trigger debounced save */
    performSave,
    /** Trigger immediate save (bypasses debounce) */
    saveNow,
    /** Cancel pending save */
    cancelPending,
    /** Clear save queue */
    clearQueue,
    /** Current autosave state */
    state,
  };
}
