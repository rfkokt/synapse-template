import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './server';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

describe('Mock API Server', () => {
  it('should be defined', () => {
    expect(server).toBeDefined();
  });
});
