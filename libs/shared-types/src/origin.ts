import remotesData from '../../../apps/shell/public/remotes.json';

/**
 * Mendapatkan daftar origin yang diizinkan (whitelist).
 * Secara dinamis membaca dari environment dan file remotes.json Shell.
 */
export function getDynamicOrigins(): string[] {
  const dynamicOrigins = new Set<string>();

  // Tambahkan origin saat ini
  if (typeof window !== 'undefined') {
    dynamicOrigins.add(window.location.origin);
  }

  // Default shell local
  dynamicOrigins.add('http://localhost:4000');

  // Gunakan type casting aman untuk mengindari error TS antar-environment
  if (typeof import.meta !== 'undefined') {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv && metaEnv.VITE_SHELL_URL) {
      dynamicOrigins.add(metaEnv.VITE_SHELL_URL);
    }
  }

  // Kumpulkan dari remotes.json
  Object.values(remotesData.remotes).forEach((remote: unknown) => {
    try {
      const url = new URL((remote as { entry: string }).entry);
      dynamicOrigins.add(url.origin);
    } catch {
      // Abaikan entri remote yang tidak valid
    }
  });

  return Array.from(dynamicOrigins);
}
