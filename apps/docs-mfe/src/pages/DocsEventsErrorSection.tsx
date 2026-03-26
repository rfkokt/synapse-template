import { CodeBlock, InfoBox } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';

export function DocsEventsErrorSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-400 text-sm font-bold">
              10a
            </span>
            Custom Event Contract
          </CardTitle>
          <CardDescription>Komunikasi antar MFE via Browser Events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Untuk source of truth state sinkron (session/user), prioritaskan store dari{' '}
            <code>@nashta-hajj/shared-types</code>. Browser Events tetap dipakai sebagai kontrak
            integrasi host-remote untuk sinyal auth (login/logout/refresh) dan event lintas app yang
            one-off.
          </p>
          <CodeBlock
            language="typescript"
            codeString={`// source of truth: shared store
useAuthStore.getState().setAuth(user);

// integration signal: host-remote contract
dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_IN, {
  userId: user.id,
  user,
});`}
          />
          <p>
            <strong>Core Integration Events (aktif):</strong>
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                AUTH.USER_LOGGED_IN
              </code>
            </li>
            <li>
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                AUTH.USER_LOGGED_OUT
              </code>
            </li>
            <li>
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                AUTH.TOKEN_REFRESHED
              </code>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 text-sm font-bold">
              10b
            </span>
            Error Boundary & Resilience
          </CardTitle>
          <CardDescription>Jika MFE crash, Shell tetap jalan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Setiap remote import wajib dibungkus{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              RemoteLoader
            </code>{' '}
            (Suspense + ErrorBoundary wrapper).
          </p>
          <CodeBlock
            language="tsx"
            codeString={`<RemoteLoader>
  <AuthApp />
</RemoteLoader>`}
          />
          <p>
            <strong>Fallback UI:</strong>
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <strong>Loading:</strong> Skeleton shimmer (Suspense)
            </li>
            <li>
              <strong>Crash:</strong> Card error + tombol Retry
            </li>
            <li>
              <strong>Timeout:</strong> Pesan offline + Refresh
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-400 text-sm font-bold">
              10c
            </span>
            Offline MFE Resilience (Init Fallback)
          </CardTitle>
          <CardDescription>
            Shell dan MFE lain tidak akan crash meski ada MFE yang mati
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Vite Module Federation melakukan <code>init()</code> ke semua <em>remote</em> (MFE) saat
            Shell pertama kali dimuat. Sebelumnya, jika satu MFE saja mati (misal karena belum
            menjalankan <code>pnpm run serve</code> atau beda port), proses init akan gagal dan{' '}
            <strong>seluruh aplikasi Shell akan blank screen</strong>.
          </p>
          <p>
            Sekarang, hal ini sudah diatasi dengan <strong>Graceful Offline Initialization</strong>{' '}
            melalui plugin <code>apps/shell/src/mf-error-handler.ts</code>.
          </p>
          <CodeBlock
            language="typescript"
            codeString={`// Jika Shell gagal mem-fetch mf-manifest.json dari sebuah URL
// Plugin akan mereturn 'Mock Manifest' yang lengkap
if (id.includes('mf-manifest.json') || id.includes('remoteEntry.js')) {
  return {
    id: id,
    name: id,
    metaData: { ... },
    remotes: [],
    exposes: [ { path: 'offline_dummy' } ]
  };
}`}
          />
          <p>
            <strong>Hasilnya:</strong> Host App (Shell) dan MFE lainnya akan{' '}
            <strong>tetap berjalan 100% normal</strong>. Tidak peduli berapapun MFE yang didaftarkan
            di <code>remotes.json</code> mati, Shell tetap memuat. Jika user menavigasi ke halaman
            MFE yang mati tersebut, mereka hanya akan melihat <em>Fallback Error UI</em> dari{' '}
            <code>RemoteLoader</code> dengan elegan, tanpa mematikan sisa aplikasi.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 text-sm font-bold">
              10d
            </span>
            CSS Module Federation — Tidak Ter-load via Shell
          </CardTitle>
          <CardDescription>
            Masalah & solusi CSS tidak ter-apply saat MFE di-load oleh Shell
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            <strong className="text-error-600 dark:text-error-400">Masalah Umum:</strong> CSS yang
            normal di standalone mode (
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">:4003</code>)
            tidak ter-apply saat diakses via Shell (
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
              :4000/docs
            </code>
            ).
          </p>
          <p>
            <strong>Penyebab:</strong> CSS di-import di <code>main.tsx</code>, tapi Module
            Federation hanya men-expose <code>App.tsx</code>. Ketika Shell load remote{' '}
            <code>App</code>, CSS-nya tidak ikut ter-bundle.
          </p>
          <CodeBlock
            language="typescript"
            codeString={`// ❌ SALAH - CSS tidak ikut ter-load via MF
// main.tsx
import './styles.css';
import { App } from './App';

// vite.config.ts
federation({
  exposes: {
    './App': './src/App.tsx',  // Hanya ini yang ter-expose
  },
})`}
          />
          <p>
            <strong>Solusi 1: Expose CSS di Module Federation</strong>
          </p>
          <CodeBlock
            language="typescript"
            codeString={`// vite.config.ts
federation({
  name: 'docsmfe',
  exposes: {
    './App': './src/App.tsx',
    './styles': './src/styles.css',  // ← Expose CSS
    './theme': './src/theme.css',    // ← Expose theme
  },
})`}
          />
          <p>
            <strong>Solusi 2: Import CSS langsung di App.tsx</strong> (lebih direkomendasikan)
          </p>
          <CodeBlock
            language="tsx"
            codeString={`// App.tsx
import React from 'react';
import './styles.css';  // ← Import di App component
import './theme.css';  // ← Jadi ter-bundle bersama App

export function App() {
  return (
    <div className="docs-layout">
      {/* ... */}
    </div>
  );
}`}
          />
          <p>
            <strong>Kenapa Solusi 2 lebih direkomendasikan?</strong>
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>CSS otomatis ter-include saat component di-load</li>
            <li>Tidak perlu expose file CSS terpisah di config</li>
            <li>CSS ter-bundle langsung dengan component yang memakainya</li>
            <li>Lebih sesuai dengan prinsip "co-located" styles</li>
          </ul>
          <InfoBox variant="amber" title="Quick Checklist untuk Debugging CSS MF">
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Standalone mode works?</strong> → Cek{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">:PORT</code>{' '}
                langsung
              </li>
              <li>
                <strong>Via Shell broken?</strong> → CSS tidak ter-expose/ter-import di component
              </li>
              <li>
                <strong>Fix:</strong> Import CSS di exposed component (bukan di main.tsx saja)
              </li>
              <li>
                <strong>Restart required:</strong> Setelahubah config, restart dev server
              </li>
            </ul>
          </InfoBox>
        </CardContent>
      </Card>

      <InfoBox variant="emerald" title="Multi-Repo? Publish via Verdaccio!">
        Perubahan di <code>@nashta-hajj/shared-types</code> (events, auth store) perlu di-publish
        ulang ke Verdaccio: <code>pnpm run libs:publish:local</code>. Lihat panduan lengkap di{' '}
        <strong>/docs/verdaccio-registry</strong>.
      </InfoBox>
    </div>
  );
}
