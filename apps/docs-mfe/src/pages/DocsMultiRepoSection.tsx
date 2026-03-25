import { CodeBlock, InfoBox, StepList } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import {
  LuGitBranch as GitBranch,
  LuPackage as Package,
  LuServer as Server,
  LuShield as Shield,
  LuTerminal as Terminal,
  LuTriangleAlert as AlertTriangle,
} from 'react-icons/lu';

const repoStructure = `# Rekomendasi Struktur Multi-Repo
#
# Repo 1: synapse-libs (monorepo kecil, publish ke npm)
synapse-libs/
├── libs/
│   ├── ui-kit/
│   ├── shared-types/
│   ├── shared-api/
│   ├── shared-components/
│   ├── shared-monitoring/
│   └── mock-api/
└── CI: publish ke npm registry on merge

# Repo 2–N: masing-masing MFE
synapse-shell/         ← Host app
synapse-auth-mfe/      ← Remote: auth domain
synapse-docs-mfe/      ← Remote: docs
synapse-<nama>-mfe/    ← Remote: domain baru`;

export function DocsMultiRepoSection() {
  return (
    <div className="space-y-6">
      {/* ══ Intro ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-400 text-sm font-bold">
              21
            </span>
            <GitBranch className="h-5 w-5" />
            Multi-Repo Separation
          </CardTitle>
          <CardDescription>Panduan memisahkan setiap MFE ke repository independen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Arsitektur Synapse MFE sudah didesain agar setiap{' '}
            <strong>Micro-Frontend bisa dipisah ke repo masing-masing</strong>. Shell menggunakan
            Module Federation dengan <em>dynamic remotes</em> berbasis{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              remotes.json
            </code>{' '}
            + environment variable override, sehingga tidak perlu rebuild shell saat MFE remote
            di-deploy ulang.
          </p>

          <InfoBox variant="blue" title="Backward Compatible">
            Semua perubahan bersifat <strong>backward-compatible</strong> — monorepo tetap bisa
            dijalankan seperti biasa dengan <code>pnpm run dev</code>. Perubahan ini hanya
            menambahkan kemampuan agar setiap MFE <em>juga</em> bisa berjalan standalone di repo
            terpisah.
          </InfoBox>

          <CodeBlock language="bash" codeString={repoStructure} />
        </CardContent>
      </Card>

      {/* ══ 1. Shared Libs ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-sky-600" />
            1. Shared Libs → Private NPM
          </CardTitle>
          <CardDescription>Publish @synapse/* ke GitLab/GitHub Packages (private)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Semua shared libs sekarang <strong>publishable</strong>. Konfigurasi{' '}
            <code>publishConfig</code> sudah ditambahkan ke setiap <code>libs/*/package.json</code>:
          </p>
          <CodeBlock
            language="json"
            codeString={`// libs/ui-kit/package.json (contoh)
{
  "name": "@synapse/ui-kit",
  "version": "0.1.0",
  "publishConfig": {
    "access": "restricted",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts --outDir dist"
  }
}`}
          />
          <p>Build & publish semua libs sekaligus:</p>
          <CodeBlock
            language="bash"
            codeString={`# Build semua shared libs (ESM + DTS)
pnpm libs:build

# Build + publish ke private registry
pnpm libs:publish`}
          />
          <InfoBox variant="amber" title="Registry Private">
            <code>access: "restricted"</code> memastikan paket hanya bisa diakses oleh anggota
            organisasi GitLab/GitHub kamu. Orang luar <strong>tidak</strong> bisa install. Registry
            ditentukan oleh file <code>.npmrc</code> (lihat langkah 4).
          </InfoBox>
        </CardContent>
      </Card>

      {/* ══ 2. Vite Auto-Detect ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-emerald-600" />
            2. Vite Auto-Detect Monorepo
          </CardTitle>
          <CardDescription>Aliases otomatis aktif di monorepo, off di standalone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Setiap MFE sekarang punya <strong>deteksi otomatis</strong> apakah ia berjalan di dalam
            monorepo atau di repo standalone:
          </p>
          <CodeBlock
            language="typescript"
            codeString={`// vite.config.ts (semua MFE)
import { existsSync } from 'fs';

// Jika ../../libs ada → monorepo, pakai local source
// Jika tidak ada → standalone, resolve dari node_modules
const isMonorepo = existsSync(path.resolve(__dirname, '../../libs'));

export default defineConfig({
  resolve: {
    alias: isMonorepo
      ? {
          '@synapse/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
          '@synapse/shared-api':   path.resolve(__dirname, '../../libs/shared-api/src/index.ts'),
          '@synapse/ui-kit':       path.resolve(__dirname, '../../libs/ui-kit/src/index.ts'),
          // ... aliases lainnya
        }
      : undefined,  // standalone → resolve otomatis dari node_modules
  },
});`}
          />
          <p className="text-xs text-neutral-500">
            Di monorepo → pakai source langsung (hot reload). Di repo terpisah → pakai versi
            published dari <code>node_modules</code>.
          </p>
        </CardContent>
      </Card>

      {/* ══ 3. Cara Extract ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-orange-600" />
            3. Cara Extract MFE ke Repo Sendiri
          </CardTitle>
          <CardDescription>Langkah-langkah praktis saat siap memisahkan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <StepList
            steps={[
              {
                title: 'Publish shared libs',
                content: (
                  <span>
                    Jalankan <code>pnpm libs:publish</code> dari monorepo. Pastikan semua libs sudah
                    ter-publish ke registry private.
                  </span>
                ),
              },
              {
                title: 'Copy folder MFE ke repo baru',
                content: (
                  <span>
                    Contoh: <code>cp -r apps/auth-mfe ~/repos/synapse-auth-mfe</code>
                  </span>
                ),
              },
              {
                title: 'Rename tsconfig.standalone.json → tsconfig.json',
                content: (
                  <span>
                    File ini sudah berisi semua compiler options tanpa depend ke{' '}
                    <code>../../tsconfig.base.json</code>.
                  </span>
                ),
              },
              {
                title: 'Copy .npmrc.template → .npmrc',
                content: (
                  <span>
                    Isi <code>GITLAB_TOKEN</code> (atau <code>GITHUB_TOKEN</code>) dan ganti{' '}
                    <code>&lt;PROJECT_ID&gt;</code> dengan ID proyek GitLab kamu.
                  </span>
                ),
              },
              {
                title: 'Copy standalone.env.example → .env.local',
                content: <span>Sesuaikan URL sesuai environment (local/staging/production).</span>,
              },
              {
                title: 'Ganti workspace:* → semver',
                content: (
                  <span>
                    Di <code>package.json</code>, ganti{' '}
                    <code>"@synapse/ui-kit": "workspace:*"</code> menjadi{' '}
                    <code>"@synapse/ui-kit": "^0.1.0"</code>.
                  </span>
                ),
              },
              {
                title: 'Install & run',
                content: <code>pnpm install && pnpm run serve</code>,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ══ 4. Setup .npmrc ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            4. Setup .npmrc (Private Registry)
          </CardTitle>
          <CardDescription>
            Konfigurasi supaya <code>@synapse/*</code> di-resolve dari registry private
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Setiap repo standalone butuh file <code>.npmrc</code> agar bisa resolve{' '}
            <code>@synapse/*</code>. Template sudah tersedia di <code>.npmrc.template</code>.
          </p>

          {/* — GitLab — */}
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Opsi 1: GitLab Package Registry
            </h4>
            <CodeBlock
              language="bash"
              codeString={`# .npmrc — GitLab (Ganti "gitlab.com" dengan URL GitLab kantormu jika self-hosted)
@synapse:registry=https://gitlab.com/api/v4/projects/<PROJECT_ID>/packages/npm/
//gitlab.com/api/v4/projects/<PROJECT_ID>/packages/npm/:_authToken=\${GITLAB_TOKEN}`}
            />

            <InfoBox variant="emerald" title="Apakah VPN wajib untuk Public Website? 🤔">
              <p className="space-y-2 mt-1">
                <strong>TIDAK.</strong> Akses VPN ke GitLab internal kantor{' '}
                <strong>hanya dibutuhkan pada saat proses build</strong> (saat menjalankan{' '}
                <code>pnpm install</code> oleh Developer atau di server CI/CD).
              </p>
              <p className="mt-2">
                Setelah aplikasi di-build (via <code>pnpm build</code>), hasilnya adalah file
                JS/CSS/HTML statis. Pengunjung website/publik <strong>tidak akan pernah</strong>{' '}
                menembak URL NPM registry mapun server GitLab kamu.
              </p>
            </InfoBox>

            <InfoBox variant="blue" title="Dimana menemukan PROJECT_ID?">
              <ol className="list-decimal ml-4 space-y-1.5 mt-1">
                <li>
                  Buka proyek kamu di <strong>GitLab</strong> (misal:{' '}
                  <code>gitlab.kantor.com/nama-org/synapse-libs</code>)
                </li>
                <li>
                  Di halaman utama proyek, lihat tepat di bawah nama proyek — ada teks kecil{' '}
                  <strong>"Project ID: 12345678"</strong>
                </li>
                <li>
                  Atau buka <strong>Settings → General</strong>, ID proyek terlihat di bagian atas
                </li>
                <li>
                  Ganti <code>&lt;PROJECT_ID&gt;</code> di <code>.npmrc</code> dengan angka tersebut
                </li>
              </ol>
            </InfoBox>

            <InfoBox variant="amber" title="Cara Buat GITLAB_TOKEN">
              <ol className="list-decimal ml-4 space-y-1 mt-1">
                <li>
                  Buka <strong>GitLab → User Settings → Access Tokens</strong>
                </li>
                <li>
                  Buat token baru dengan scope: <code>read_package_registry</code> +{' '}
                  <code>write_package_registry</code>
                </li>
                <li>
                  Set environment variable <code>GITLAB_TOKEN</code> di terminal/CI
                </li>
              </ol>
            </InfoBox>
          </div>

          {/* — GitHub — */}
          <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Opsi 2: GitHub Packages (alternatif)
            </h4>
            <CodeBlock
              language="bash"
              codeString={`# .npmrc — GitHub
@synapse:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`}
            />
          </div>

          <CodeBlock
            language="bash"
            codeString={`# Tambahkan di kedua opsi:
auto-install-peers=true
strict-peer-dependencies=false`}
          />
        </CardContent>
      </Card>

      {/* ══ 5. Zustand State Sharing ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            5. Zustand State Sharing
          </CardTitle>
          <CardDescription>
            Memastikan global state (seperti Auth Token) tersinkronisasi antar MFE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Di dalam monorepo, Vite resolver bisa membuat instance Zustand menjadi singleton secara
            otomatis. Namun, ketika MFE dipisah ke repo masing-masing, tiap MFE akan memiliki{' '}
            <code>node_modules</code> sendiri-sendiri.
          </p>
          <InfoBox variant="amber" title="Wajib Konfigurasi Shared Module">
            Agar state login dari <strong>auth-mfe</strong> terbaca oleh <strong>shell</strong> dan
            remote lainnya, <code>zustand</code> dan <code>@synapse/shared-types</code>{' '}
            <strong>wajib</strong> didaftarkan sebagai{' '}
            <code className="text-amber-800 dark:text-amber-200">singleton</code> di konfigurasi
            Module Federation.
          </InfoBox>
          <CodeBlock
            language="typescript"
            codeString={`// vite.config.ts (Di SEMUA MFE: shell, auth, docs, dll)
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'myMfe',
      // ...
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        
        // 👉 WAJIB DITAMBAHKAN UNTUK MULTI-REPO:
        zustand: { singleton: true },
        '@synapse/shared-types': { singleton: true },
      },
    }),
  ],
});`}
          />
          <p className="text-xs text-neutral-500">
            Tanpa konfigurasi di atas, tiap MFE akan membuat instance store yang berbeda di memory,
            sehingga event login tidak mempengaruhi MFE lain.
          </p>
        </CardContent>
      </Card>

      {/* ══ 6. Environment Variables ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            6. Environment Variables
          </CardTitle>
          <CardDescription>URL remote MFE untuk deployment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>Shell membutuhkan URL remote MFE saat deployment:</p>
          <CodeBlock
            language="bash"
            codeString={`# apps/shell/.env.production
VITE_AUTH_MFE_URL=https://auth.synapse.com
VITE_DOCS_MFE_URL=https://docs.synapse.com

# Remote MFE perlu tahu URL Shell:
VITE_SHELL_URL=https://app.synapse.com`}
          />
          <p className="text-xs text-neutral-500">
            Template: <code>standalone.env.example</code> di setiap folder MFE.
          </p>
        </CardContent>
      </Card>

      {/* ══ Risiko & Mitigasi ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Risiko & Mitigasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800 text-left">
                  <th className="px-4 py-2 font-medium">Risiko</th>
                  <th className="px-4 py-2 font-medium">Dampak</th>
                  <th className="px-4 py-2 font-medium">Mitigasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <tr>
                  <td className="px-4 py-2">Version drift shared libs</td>
                  <td className="px-4 py-2">
                    <span className="text-red-600 font-medium">Tinggi</span>
                  </td>
                  <td className="px-4 py-2">Semver strict + Renovate bot</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Dev experience menurun</td>
                  <td className="px-4 py-2">
                    <span className="text-amber-600 font-medium">Sedang</span>
                  </td>
                  <td className="px-4 py-2">Docker compose / dev script</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Breaking change di ui-kit</td>
                  <td className="px-4 py-2">
                    <span className="text-red-600 font-medium">Tinggi</span>
                  </td>
                  <td className="px-4 py-2">CI integration/contract tests</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">CI/CD complexity naik</td>
                  <td className="px-4 py-2">
                    <span className="text-amber-600 font-medium">Sedang</span>
                  </td>
                  <td className="px-4 py-2">Shared CI/CD pipeline templates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* ══ 7. Cara Test Lokal ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-teal-600" />
            7. Simulasi Test Lokal (Tanpa Publish)
          </CardTitle>
          <CardDescription>
            Cara menguji ekstraksi MFE di komputer lokal tanpa harus mem-publish ke GitLab/GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Jika kamu ingin mengetes pemisahan MFE sekarang juga{' '}
            <strong>tanpa mengotori private registry</strong>, kamu bisa menggunakan fitur{' '}
            <code>pnpm pack</code> untuk membuat file <em>tarball</em> lokal.
          </p>
          <StepList
            steps={[
              {
                title: 'Build semua libs',
                content: <CodeBlock language="bash" codeString="pnpm libs:build" />,
              },
              {
                title: 'Pack tiap library menjadi file .tgz',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`cd libs/ui-kit && pnpm pack
cd ../shared-types && pnpm pack
# (Lakukan untuk semua 6 libs)
# Ini akan membuat file seperti: synapse-ui-kit-0.1.0.tgz`}
                  />
                ),
              },
              {
                title: 'Copy MFE ke luar monorepo',
                content: (
                  <CodeBlock language="bash" codeString="cp -r apps/docs-mfe ../test-docs-mfe" />
                ),
              },
              {
                title: 'Ubah dependensi package.json MFE',
                content: (
                  <div className="space-y-2 mt-2">
                    <p>
                      Buka <code>../test-docs-mfe/package.json</code> dan arahkan ke file local:
                    </p>
                    <CodeBlock
                      language="json"
                      codeString={`"dependencies": {
  "@synapse/ui-kit": "file:../synapse-template/libs/ui-kit/synapse-ui-kit-0.1.0.tgz",
  "@synapse/shared-types": "file:../synapse-template/libs/shared-types/synapse-shared-types-0.1.0.tgz"
  // ...ubah sisanya ke file masing-masing
}`}
                    />
                  </div>
                ),
              },
              {
                title: 'Rename TS Config di folder baru',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`cd ../test-docs-mfe
mv tsconfig.standalone.json tsconfig.json`}
                  />
                ),
              },
              {
                title: 'Install & Jalankan',
                content: <CodeBlock language="bash" codeString="pnpm install && pnpm run serve" />,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
