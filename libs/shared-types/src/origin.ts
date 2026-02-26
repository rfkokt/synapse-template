import remotesData from '../../../apps/shell/public/remotes.json';

/**
 * Mendapatkan daftar origin yang diizinkan (whitelist).
 * Sumber whitelist:
 * - VITE_SHELL_URL
 * - VITE_ALLOWED_ORIGINS (comma-separated, optional)
 * - apps/shell/public/remotes.json
 *
 * Catatan keamanan:
 * Jangan pernah otomatis menambahkan window.location.origin ke whitelist,
 * karena itu membuat guard menjadi ineffective.
 */
export function getDynamicOrigins(): string[] {
  const dynamicOrigins = new Set<string>(['http://localhost:4000']);

  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

  const shellOrigin = normalizeHttpOrigin(metaEnv?.VITE_SHELL_URL);
  if (shellOrigin) {
    dynamicOrigins.add(shellOrigin);
  }

  const envOrigins = metaEnv?.VITE_ALLOWED_ORIGINS;
  if (envOrigins) {
    for (const candidate of envOrigins.split(',')) {
      const origin = normalizeHttpOrigin(candidate.trim());
      if (origin) {
        dynamicOrigins.add(origin);
      }
    }
  }

  Object.values(remotesData.remotes).forEach((remote: unknown) => {
    const entry = (remote as { entry?: string }).entry;
    const origin = normalizeHttpOrigin(entry);
    if (origin) {
      dynamicOrigins.add(origin);
    }
  });

  return [...dynamicOrigins];
}

function normalizeHttpOrigin(input: string | undefined): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}
