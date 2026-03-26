import { CodeBlock, InfoBox, StepList } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import {
  LuBox as Package,
  LuTerminal as Terminal,
  LuServer as Server,
  LuShieldCheck as Shield,
  LuRefreshCw as RefreshCw,
  LuBookOpen as BookOpen,
} from 'react-icons/lu';

export function DocsVerdaccioSection() {
  return (
    <div className="space-y-8">
      {/* ══ Intro ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-teal-600" />
            Shared Libraries via Verdaccio
          </CardTitle>
          <CardDescription>
            Panduan lengkap menggunakan Verdaccio sebagai local NPM registry untuk develop, publish,
            dan konsumsi shared libraries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            <strong>Verdaccio</strong> adalah private NPM registry yang berjalan di komputer lokal.
            Dengan Verdaccio, kamu bisa:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Publish</strong> shared libs (<code>@synapse/ui-kit</code>,{' '}
              <code>@synapse/shared-types</code>, dll.) ke registry lokal tanpa internet
            </li>
            <li>
              <strong>Install</strong> shared libs di MFE standalone — persis seperti di production
            </li>
            <li>
              <strong>Test</strong> perubahan library sebelum publish ke GitLab/GitHub Packages
            </li>
            <li>
              <strong>Offline-friendly</strong> — tidak butuh VPN, token, atau koneksi internet
            </li>
          </ul>

          <InfoBox variant="blue" title="Sudah Terbundel di Template!">
            Konfigurasi Verdaccio sudah tersedia di <code>tools/verdaccio/config.yaml</code>.
            Anonymous publish diizinkan — tidak perlu login, buat akun, atau setup token.
          </InfoBox>
        </CardContent>
      </Card>

      {/* ══ Arsitektur ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-600" />
            Bagaimana Cara Kerjanya?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 font-mono text-xs leading-relaxed">
            <pre className="whitespace-pre-wrap">{`┌─────────────────────────────────┐
│         MONOREPO                │
│  libs/                          │
│    ├── ui-kit/                  │
│    ├── shared-types/            │
│    ├── shared-api/              │
│    ├── shared-components/       │   pnpm run
│    ├── shared-monitoring/       │──────────────►  ┌──────────────┐
│    └── mock-api/                │  libs:publish   │  Verdaccio   │
│                                 │     :local      │  :4873       │
└─────────────────────────────────┘                 └──────┬───────┘
                                                           │
                                    pnpm install           │
┌─────────────────────────────────┐◄───────────────────────┘
│    MFE STANDALONE (repo lain)   │
│    .npmrc → localhost:4873      │
│    "@synapse/ui-kit": "^0.1.0"  │
└─────────────────────────────────┘`}</pre>
          </div>
          <p>
            <strong>Alur:</strong> Monorepo build & publish 6 shared libs ke Verdaccio → MFE
            standalone install dari Verdaccio → seolah-olah install dari GitLab/GitHub Packages.
          </p>
        </CardContent>
      </Card>

      {/* ══ Quick Start ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-600" />
            Quick Start (3 Terminal)
          </CardTitle>
          <CardDescription>Cara tercepat memulai — buka 3 tab terminal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <StepList
            steps={[
              {
                title: 'Terminal 1 — Start Verdaccio',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Dari root monorepo:
pnpm run verdaccio:start

# ✅ Registry berjalan di http://localhost:4873
# ✅ Buka URL tersebut di browser untuk melihat UI Verdaccio`}
                  />
                ),
              },
              {
                title: 'Terminal 2 — Build & Publish Libs',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Dari root monorepo:
pnpm run libs:publish:local

# Ini menjalankan:
#   1. pnpm libs:build  → tsup build semua 6 libs
#   2. pnpm publish     → publish ke http://localhost:4873
#
# Output sukses: + @synapse/ui-kit@0.1.0 (×6 libs)`}
                  />
                ),
              },
              {
                title: 'Terminal 3 — Jalankan MFE Standalone',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`cd ../my-standalone-mfe
pnpm install    # Install dari Verdaccio
pnpm run serve  # Jalankan MFE`}
                  />
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ══ Konfigurasi Verdaccio ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            Konfigurasi & Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            File konfigurasi: <code>tools/verdaccio/config.yaml</code>
          </p>
          <CodeBlock
            language="yaml"
            codeString={`# tools/verdaccio/config.yaml
storage: ./tools/verdaccio/storage  # Package tersimpan di sini
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@synapse/*':
    access: $all        # Siapapun bisa lihat
    publish: $all       # Siapapun bisa publish (lokal only!)
    unpublish: $all
  '**':
    access: $all
    proxy: npmjs        # Package lain di-proxy ke npmjs

listen: 0.0.0.0:4873`}
          />

          <InfoBox variant="amber" title="Hanya untuk Development!">
            Konfigurasi <code>$all</code> berarti tanpa autentikasi. Ini aman karena Verdaccio hanya
            berjalan di <code>localhost</code>. <strong>Jangan</strong> expose Verdaccio ke jaringan
            publik dengan konfigurasi ini!
          </InfoBox>

          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">
            .npmrc untuk MFE Standalone
          </h4>
          <p>
            Setiap MFE standalone membutuhkan file <code>.npmrc</code> ini di root folder-nya:
          </p>
          <CodeBlock
            language="bash"
            codeString={`# .npmrc — di folder MFE standalone
@synapse:registry=http://localhost:4873/
//localhost:4873/:_authToken="anonymous"
auto-install-peers=true
strict-peer-dependencies=false`}
          />
          <p className="text-xs text-neutral-500">
            <strong>Catatan:</strong> Ganti <code>@synapse</code> dengan scope organisasimu jika
            sudah di-rebrand (misal: <code>@telkom</code>).
          </p>
        </CardContent>
      </Card>

      {/* ══ Workflow: Update Library ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Workflow: Update Shared Library
          </CardTitle>
          <CardDescription>
            Ketika ada perubahan di shared lib, bagaimana caranya MFE standalone mendapat versi
            terbaru?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <StepList
            steps={[
              {
                title: 'Edit library di monorepo',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Contoh: tambah komponen baru di ui-kit
# Edit libs/ui-kit/src/components/Datepicker.tsx
# Export di libs/ui-kit/src/index.ts`}
                  />
                ),
              },
              {
                title: 'Bump versi (opsional tapi recommended)',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Edit libs/ui-kit/package.json
# "version": "0.1.0" → "0.2.0"`}
                  />
                ),
              },
              {
                title: 'Re-publish ke Verdaccio',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`pnpm run libs:publish:local
# Verdaccio akan menyimpan versi baru`}
                  />
                ),
              },
              {
                title: 'Update di MFE standalone',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`cd ../my-standalone-mfe

# Jika bump versi:
# Edit package.json → "@synapse/ui-kit": "^0.2.0"

pnpm install   # Install versi terbaru dari Verdaccio
pnpm run serve # Test perubahan`}
                  />
                ),
              },
            ]}
          />
          <InfoBox variant="emerald" title="Tanpa Bump Versi?">
            Jika kamu tidak bump versi, Verdaccio akan menolak re-publish versi yang sama. Kamu
            bisa:
            <ul className="list-disc ml-4 mt-1">
              <li>
                Hapus storage lama: <code>rm -rf tools/verdaccio/storage/@synapse</code>
              </li>
              <li>Atau selalu bump versi sebelum re-publish (recommended)</li>
            </ul>
          </InfoBox>
        </CardContent>
      </Card>

      {/* ══ Daftar Shared Libs ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Daftar Shared Libraries
          </CardTitle>
          <CardDescription>6 library yang di-publish ke Verdaccio</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-neutral-600 dark:text-neutral-400">
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800 text-left">
                  <th className="px-4 py-2 font-medium">Package</th>
                  <th className="px-4 py-2 font-medium">Deskripsi</th>
                  <th className="px-4 py-2 font-medium">Versi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">@synapse/ui-kit</td>
                  <td className="px-4 py-2">
                    Komponen UI dasar (Button, Input, Card, Modal, Table, dll.)
                  </td>
                  <td className="px-4 py-2">0.1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">@synapse/shared-types</td>
                  <td className="px-4 py-2">
                    TypeScript types, Zustand stores (auth, theme, menu), events
                  </td>
                  <td className="px-4 py-2">0.1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">@synapse/shared-api</td>
                  <td className="px-4 py-2">
                    Axios client dengan interceptor token &amp; refresh flow
                  </td>
                  <td className="px-4 py-2">0.1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">@synapse/shared-components</td>
                  <td className="px-4 py-2">
                    Komponen docs reusable (CodeBlock, InfoBox, StepList)
                  </td>
                  <td className="px-4 py-2">0.1.0</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">@synapse/shared-monitoring</td>
                  <td className="px-4 py-2">Helper Sentry &amp; monitoring integration</td>
                  <td className="px-4 py-2">0.0.1</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">@synapse/mock-api</td>
                  <td className="px-4 py-2">MSW handlers untuk API mocking di development</td>
                  <td className="px-4 py-2">0.0.1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ══ Script Reference ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-neutral-600" />
            Script Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-neutral-600 dark:text-neutral-400">
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800 text-left">
                  <th className="px-4 py-2 font-medium">Command</th>
                  <th className="px-4 py-2 font-medium">Apa yang dilakukan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">pnpm run verdaccio:start</td>
                  <td className="px-4 py-2">
                    Start Verdaccio dengan config <code>tools/verdaccio/config.yaml</code>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">pnpm run libs:build</td>
                  <td className="px-4 py-2">Build semua 6 shared libs via tsup</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">pnpm run libs:publish:local</td>
                  <td className="px-4 py-2">Build + publish ke Verdaccio (localhost:4873)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">pnpm run libs:publish</td>
                  <td className="px-4 py-2">
                    Build + publish ke registry production (GitLab/GitHub)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ══ Troubleshooting ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">⚠️ Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 p-3 rounded-r-lg">
              <p className="font-semibold text-red-800 dark:text-red-300 text-xs mb-1">
                Error: ENEEDAUTH / E401
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                Pastikan pakai <code>pnpm run verdaccio:start</code> (bukan{' '}
                <code>npx verdaccio</code> langsung). Command bawaan template menggunakan config
                anonymous publish di <code>tools/verdaccio/config.yaml</code>.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 p-3 rounded-r-lg">
              <p className="font-semibold text-red-800 dark:text-red-300 text-xs mb-1">
                Error: Cannot re-publish same version
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                Verdaccio menolak publish versi yang sudah ada. Solusi:{' '}
                <code>rm -rf tools/verdaccio/storage/@synapse</code> lalu re-publish, atau bump
                versi di <code>package.json</code> lib.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 p-3 rounded-r-lg">
              <p className="font-semibold text-red-800 dark:text-red-300 text-xs mb-1">
                Error: command not found: verdaccio
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                Script <code>verdaccio:start</code> sudah menggunakan <code>npx</code> sehingga akan
                auto-download Verdaccio. Pastikan kamu punya koneksi internet saat pertama kali
                menjalankan.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 p-3 rounded-r-lg">
              <p className="font-semibold text-red-800 dark:text-red-300 text-xs mb-1">
                pnpm install gagal di MFE standalone
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                Pastikan file <code>.npmrc</code> ada di folder MFE dan Verdaccio sudah berjalan di
                port 4873. Cek dengan membuka <code>http://localhost:4873</code> di browser.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
