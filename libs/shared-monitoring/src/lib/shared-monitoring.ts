import * as Sentry from '@sentry/react';

export function initMonitoring() {
  if (import.meta.env.DEV) {
    console.log('[Monitoring] development mode, disabling Sentry');
    return;
  }

  Sentry.init({
    dsn: (import.meta.env as any).VITE_SENTRY_DSN || '',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const ErrorBoundary = Sentry.ErrorBoundary;
export const withProfiler = Sentry.withProfiler;
