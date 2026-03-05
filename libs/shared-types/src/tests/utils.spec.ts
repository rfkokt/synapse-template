import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isAppError } from '../api-error';
import type { AppError } from '../api-error';

/* ─────────────────────────────────────────────
   isAppError
   ───────────────────────────────────────────── */

describe('isAppError', () => {
  it('should return true for a valid AppError object', () => {
    const error: AppError = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      statusCode: 400,
    };
    expect(isAppError(error)).toBe(true);
  });

  it('should return true for AppError with optional details', () => {
    const error: AppError = {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      statusCode: 404,
      details: { id: '123' },
    };
    expect(isAppError(error)).toBe(true);
  });

  it('should return false for a plain Error', () => {
    expect(isAppError(new Error('something went wrong'))).toBe(false);
  });

  it('should return false for null', () => {
    expect(isAppError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isAppError(undefined)).toBe(false);
  });

  it('should return false for a string', () => {
    expect(isAppError('error message')).toBe(false);
  });

  it('should return false for an incomplete object', () => {
    expect(isAppError({ code: 'ERR', message: 'fail' })).toBe(false); // missing statusCode
    expect(isAppError({ code: 'ERR', statusCode: 500 })).toBe(false); // missing message
    expect(isAppError({ message: 'fail', statusCode: 500 })).toBe(false); // missing code
  });
});

/* ─────────────────────────────────────────────
   getSafeRedirectTarget
   (mocking origin.ts because it imports remotes.json)
   ───────────────────────────────────────────── */

vi.mock('../origin', () => ({
  getDynamicOrigins: () => [
    'http://localhost:4000',
    'http://localhost:4001',
    'https://myapp.example.com',
  ],
}));

// Import after mock to ensure the mock is applied
const { getSafeRedirectTarget } = await import('../redirect');

describe('getSafeRedirectTarget', () => {
  it('should return null for null input', () => {
    expect(getSafeRedirectTarget(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(getSafeRedirectTarget(undefined)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(getSafeRedirectTarget('')).toBeNull();
    expect(getSafeRedirectTarget('  ')).toBeNull();
  });

  it('should accept a valid relative path', () => {
    expect(getSafeRedirectTarget('/dashboard')).toBe('/dashboard');
    expect(getSafeRedirectTarget('/auth/profile')).toBe('/auth/profile');
  });

  it('should reject protocol-relative URLs', () => {
    expect(getSafeRedirectTarget('//evil.com')).toBeNull();
  });

  it('should reject URLs with control characters', () => {
    expect(getSafeRedirectTarget('/redirect\x00evil')).toBeNull();
    expect(getSafeRedirectTarget('/redirect\nto')).toBeNull();
  });

  it('should accept whitelisted absolute URLs', () => {
    const result = getSafeRedirectTarget('http://localhost:4000/dashboard');
    expect(result).toBe('http://localhost:4000/dashboard');
  });

  it('should accept whitelisted https URLs', () => {
    const result = getSafeRedirectTarget('https://myapp.example.com/page');
    expect(result).toBe('https://myapp.example.com/page');
  });

  it('should reject non-whitelisted origins', () => {
    expect(getSafeRedirectTarget('https://evil.com/steal')).toBeNull();
    expect(getSafeRedirectTarget('http://localhost:9999/other')).toBeNull();
  });

  it('should reject non-http protocols', () => {
    expect(getSafeRedirectTarget('javascript:alert(1)')).toBeNull();
    expect(getSafeRedirectTarget('ftp://files.example.com')).toBeNull();
  });

  it('should reject malformed URLs gracefully', () => {
    expect(getSafeRedirectTarget('not-a-url-at-all')).toBeNull();
  });
});

/* ─────────────────────────────────────────────
   Notification Store
   ───────────────────────────────────────────── */

// Import notification store after all mocks
import { useNotificationStore } from '../notification-store';

describe('useNotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start with empty toasts', () => {
    expect(useNotificationStore.getState().toasts).toEqual([]);
  });

  it('addToast should add a toast with string payload', () => {
    const id = useNotificationStore.getState().addToast('Hello', 'info');
    const toasts = useNotificationStore.getState().toasts;

    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('Hello');
    expect(toasts[0].variant).toBe('info');
    expect(toasts[0].id).toBe(id);
  });

  it('addToast should add a toast with object payload', () => {
    useNotificationStore
      .getState()
      .addToast({ title: 'Error', message: 'Something failed', list: ['item1', 'item2'] }, 'error');
    const toasts = useNotificationStore.getState().toasts;

    expect(toasts).toHaveLength(1);
    expect(toasts[0].title).toBe('Error');
    expect(toasts[0].message).toBe('Something failed');
    expect(toasts[0].list).toEqual(['item1', 'item2']);
    expect(toasts[0].variant).toBe('error');
  });

  it('removeToast should remove a toast by ID', () => {
    const id = useNotificationStore.getState().addToast('Hello', 'info');
    useNotificationStore.getState().removeToast(id);

    expect(useNotificationStore.getState().toasts).toHaveLength(0);
  });

  it('success shortcut should create a success toast', () => {
    useNotificationStore.getState().success('Done!');
    const toasts = useNotificationStore.getState().toasts;

    expect(toasts).toHaveLength(1);
    expect(toasts[0].variant).toBe('success');
  });

  it('error shortcut should create an error toast', () => {
    useNotificationStore.getState().error('Failed!');
    expect(useNotificationStore.getState().toasts[0].variant).toBe('error');
  });

  it('warning shortcut should create a warning toast', () => {
    useNotificationStore.getState().warning('Watch out!');
    expect(useNotificationStore.getState().toasts[0].variant).toBe('warning');
  });

  it('info shortcut should create an info toast', () => {
    useNotificationStore.getState().info('FYI');
    expect(useNotificationStore.getState().toasts[0].variant).toBe('info');
  });
});
