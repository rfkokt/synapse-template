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

  // Example test for a specific mock behavior, if you have user endpoints:
  // it('should mock user endpoint', async () => {
  //   const res = await fetch('http://localhost:4000/api/users/me');
  //   expect(res.status).toBe(200);
  // });
});
