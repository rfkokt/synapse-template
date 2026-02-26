import { useEffect, useState, type ReactNode } from 'react';
import { getDynamicOrigins } from '../origin';

/**
 * Origin Guard for Micro Frontends (MFE).
 * Memastikan MFE hanya bisa di-load (di-render) oleh host (origin) yang diizinkan.
 * Secara otomatis membaca registri `remotes.json` dari Shell untuk mengizinkan origin terdaftar.
 */
export function SharedOriginGuard({
  children,
  allowedOrigins = [],
}: {
  children: ReactNode;
  allowedOrigins?: string[];
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // SSR safeguard
  if (!isMounted || typeof window === 'undefined') {
    return null;
  }

  const currentOrigin = window.location.origin;

  // Kumpulkan origin dinamis secara otomatis
  const dynamicOrigins = getDynamicOrigins();

  // Gabungkan dengan origin opsional dari props
  const finalAllowedOrigins = [...dynamicOrigins, ...allowedOrigins];

  // Evaluasi kecocokan origin
  const isAllowed = finalAllowedOrigins.includes(currentOrigin);

  if (!isAllowed) {
    console.error(
      `[SharedOriginGuard] ⚠️ Akses MFE Ditolak. Host origin '${currentOrigin}' tidak terdaftar di allowlist.`
    );
  }

  // Jika ditolak, tampilkan fallback UI error Access Denied
  if (!isAllowed) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#fafafa',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #f87171',
            maxWidth: '500px',
          }}
        >
          <h1 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 'bold' }}>
            403 Forbidden: MFE Access Denied
          </h1>
          <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>
            Aplikasi ini mendeteksi percobaan pemuatan dari host yang tidak diotorisasi (
            <strong style={{ fontFamily: 'monospace' }}>{window.location.origin}</strong>).
          </p>
        </div>
      </div>
    );
  }

  // Origin diizinkan, render aplikasi MFE
  return <>{children}</>;
}
