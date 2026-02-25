import { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────
   useIdleTimeout Hook
   Detects user inactivity and triggers callbacks
   PRD §6.4 — Session Timeout & Idle Detection
   ───────────────────────────────────────────── */

export interface UseIdleTimeoutOptions {
  /** Time in ms before warning fires (default: 30 min) */
  idleTime?: number;
  /** Time in ms after warning before timeout fires (default: 5 min) */
  warningTime?: number;
  /** Called when user has been idle for `idleTime` */
  onWarning: () => void;
  /** Called when user stays idle for `warningTime` after warning */
  onTimeout: () => void;
  /** Whether the hook is active (default: true) */
  enabled?: boolean;
}

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'pointerdown',
];

export function useIdleTimeout({
  idleTime = 30 * 60 * 1000, // 30 minutes
  warningTime = 5 * 60 * 1000, // 5 minutes
  onWarning,
  onTimeout,
  enabled = true,
}: UseIdleTimeoutOptions) {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWarningRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearTimers();
    isWarningRef.current = false;

    idleTimerRef.current = setTimeout(() => {
      // Idle threshold reached → fire warning
      isWarningRef.current = true;
      onWarning();

      // Start the final countdown
      warningTimerRef.current = setTimeout(() => {
        onTimeout();
      }, warningTime);
    }, idleTime);
  }, [clearTimers, idleTime, warningTime, onWarning, onTimeout]);

  /**
   * Call this to reset the idle timer (e.g. when user clicks "Stay Logged In").
   */
  const resetTimer = useCallback(() => {
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    const handleActivity = () => {
      // Only reset on activity if we haven't shown the warning yet.
      // Once the warning modal is visible, only an explicit resetTimer() call should dismiss it.
      if (!isWarningRef.current) {
        startIdleTimer();
      }
    };

    // Start initial timer
    startIdleTimer();

    // Attach listeners
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    return () => {
      clearTimers();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [enabled, startIdleTimer, clearTimers]);

  return { resetTimer };
}
