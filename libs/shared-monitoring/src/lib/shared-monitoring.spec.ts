import { describe, it, expect, vi } from 'vitest';

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
  replayIntegration: vi.fn(() => ({})),
  ErrorBoundary: vi.fn(),
  withProfiler: vi.fn((component: unknown) => component),
}));

import { initMonitoring, ErrorBoundary, withProfiler } from './shared-monitoring';

describe('shared-monitoring', () => {
  it('exports monitoring primitives', () => {
    expect(typeof initMonitoring).toBe('function');
    expect(ErrorBoundary).toBeDefined();
    expect(withProfiler).toBeDefined();
  });

  it('initialization does not throw', () => {
    expect(() => initMonitoring()).not.toThrow();
  });
});
