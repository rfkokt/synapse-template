import { getDynamicOrigins } from './origin';

/**
 * Returns a safe redirect target or null if invalid.
 *
 * Allowed:
 * - Absolute path in current origin (must start with "/" but not "//")
 * - Absolute URL with http/https protocol and origin included in whitelist
 */
export function getSafeRedirectTarget(rawRedirect: string | null | undefined): string | null {
  if (!rawRedirect) return null;

  const redirect = rawRedirect.trim();
  if (!redirect) return null;

  // Reject control characters and protocol-relative redirects.
  const hasControlCharacters = Array.from(redirect).some((char) => {
    const code = char.charCodeAt(0);
    return code <= 31 || code === 127;
  });

  if (hasControlCharacters || redirect.startsWith('//')) {
    return null;
  }

  // Relative app path redirect (same origin).
  if (redirect.startsWith('/')) {
    return redirect;
  }

  try {
    const parsed = new URL(redirect);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    const whitelistedOrigins = getDynamicOrigins();
    if (!whitelistedOrigins.includes(parsed.origin)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
