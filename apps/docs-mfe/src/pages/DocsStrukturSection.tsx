import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsStrukturSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-400 text-sm font-bold">
            1
          </span>
          Struktur Proyek
        </CardTitle>
        <CardDescription>Bagaimana monorepo ini diorganisir</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Aplikasi (Micro-Frontends)
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 list-disc ml-4">
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                shell
              </code>{' '}
              — Aplikasi Induk (Port 4000). Mengelola layout & routing utama.
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                auth-mfe
              </code>{' '}
              — Domain Autentikasi (Port 4001). Pre-loaded remote module.
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                pendaftaran
              </code>{' '}
              — Modul pendaftaran dan jamaah (Port 4002).
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                docs-mfe
              </code>{' '}
              — Modul dokumentasi ini (Port 4003).
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Pustaka Utama (Shared Libs)
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 list-disc ml-4">
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                ui-kit
              </code>{' '}
              — Komponen standar UI (Tailwind v4 / Radix UI / Shadcn).
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                shared-types
              </code>{' '}
              — Contract TypeScript dan state login (Zustand).
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                shared-api
              </code>{' '}
              — Setup Axios dan Endpoint (dilindungi interceptor).
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                shared-components
              </code>{' '}
              — Komponen dokumentasi reusable (CodeBlock, InfoBox, ExampleTabs, dst).
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                shared-monitoring
              </code>{' '}
              — Setup observability (Sentry init, ErrorBoundary, profiler).
            </li>
            <li>
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                mock-api
              </code>{' '}
              — Mock API layer (MSW handlers + bootstrap helper).
            </li>
          </ul>
        </div>
        <CodeBlock
          language="bash"
          codeString={`synapse-hajj/
├── apps/
│   ├── shell/          ← Host (Port 4000)
│   ├── auth-mfe/       ← Login & Auth (Port 4001)
│   ├── pendaftaran/    ← Modul Pendaftaran (Port 4002)
│   └── docs-mfe/       ← Halaman ini (Port 4003)
├── libs/
│   ├── ui-kit/         ← Design System (@synapse/ui-kit)
│   ├── shared-types/   ← TypeScript contracts (@synapse/shared-types)
│   ├── shared-api/     ← Axios interceptors (@synapse/shared-api)
│   ├── shared-components/ ← Reusable docs primitives (@synapse/shared-components)
│   ├── shared-monitoring/ ← Monitoring helpers (@synapse/shared-monitoring)
│   └── mock-api/       ← MSW mocks (@synapse/mock-api)
├── tools/              ← Generator & scripts
├── components.json     ← Shadcn CLI config
└── package.json`}
        />
        <div className="mt-8 border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            🔌 Bagaimana Shell Mengakses Docs MFE?
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Untuk membuat Shell bisa mengakses{' '}
            <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded text-primary-600">
              docs-mfe
            </code>
            , ada 3 file utama yang saling beroperasi di{' '}
            <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded text-primary-600">
              apps/shell/
            </code>
            :
          </p>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                1. Mendaftarkan remote di{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  public/remotes.json
                </code>
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Shell butuh tahu daftar URL manifest dari MFE yang diizinkan untuk di-<em>load</em>:
              </p>
              <div className="pl-3 border-l-2 border-transparent">
                <CodeBlock
                  language="json"
                  codeString={`// apps/shell/public/remotes.json
"docs-mfe": {
  "name": "docsmfe",
  "entry": "http://localhost:4003/mf-manifest.json",
  "activeWhenPath": "/docs-mfe",
  "exposes": {
    "./App": "./App"
  }
}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                2. Dynamic Injector di{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  vite.config.ts
                </code>
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Vite plugin mengambil data dari JSON tersebut dan memasukkannya ke konfigurasi
                Module Federation ketika di build/host:
              </p>
              <div className="pl-3 border-l-2 border-transparent">
                <CodeBlock
                  language="typescript"
                  codeString={`// apps/shell/vite.config.ts
const federationRemotes = loadFederationRemotes();

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: federationRemotes, // Diinject dinamis dari remotes.json!
    })
  ]
})`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                3. Lazy Import di Router{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  src/router.tsx
                </code>
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Sekarang komponen MFE bisa dipanggil lazily layaknya file lokal (dengan pembungkus{' '}
                <em>RemoteLoader</em> berisi Error Boundary):
              </p>
              <div className="pl-3 border-l-2 border-transparent">
                <CodeBlock
                  language="tsx"
                  codeString={`// 1. Impor dari "docsmfe" yang terekspos ("./App")
const RemoteDocs = lazy(() => import('docsmfe/App'));

// 2. Render komponen pada path "docs/*"
<Route
  path="docs/*"
  element={
    <RemoteLoader>
      <RemoteDocs />
    </RemoteLoader>
  }
/>`}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
