import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';
import {
  SectionTitle,
  FeatureGrid,
  ComparisonTable,
  InfoBox,
  KeyValueCard,
} from '@synapse/shared-components';
import type { ComparisonColumn, ComparisonRow } from '@synapse/shared-components';

/* ═══════════════════════════════════════════════
   Section: Kenapa Module Federation?
   ═══════════════════════════════════════════════ */

// ── Data: MF approach comparison ──
const approachColumns: ComparisonColumn[] = [
  { header: 'Module Federation', highlight: true },
  { header: 'iframe' },
  { header: 'Single SPA' },
  { header: 'Import Map / ESM' },
];

const approachRows: ComparisonRow[] = [
  {
    criteria: 'Shared Dependencies',
    values: [
      '✅ Singleton, deduplicated',
      '❌ Duplikat di setiap iframe',
      '⚠️ Butuh konfigurasi manual',
      '⚠️ Bertanggung jawab sendiri',
    ],
  },
  {
    criteria: 'State Sharing',
    values: [
      '⚠️ Bisa langsung jika store dikontrak sebagai shared singleton',
      '❌ Hanya via postMessage',
      '⚠️ Custom event bus',
      '⚠️ Custom event bus',
    ],
  },
  {
    criteria: 'Build Tool',
    values: ['✅ Vite (fast, native ESM)', '✅ Bebas', '⚠️ Webpack dominan', '✅ Bebas'],
  },
  {
    criteria: 'CSS Isolation',
    values: [
      '✅ Tailwind shared config',
      '✅ Full isolation',
      '⚠️ Manual namespace',
      '⚠️ Manual namespace',
    ],
  },
  {
    criteria: 'Routing',
    values: ['✅ React Router shared', '❌ URL sync kompleks', '✅ Built-in', '⚠️ Manual'],
  },
  {
    criteria: 'TypeScript Support',
    values: ['✅ Full, shared types', '❌ Tidak bisa share types', '⚠️ Partial', '⚠️ Partial'],
  },
  {
    criteria: 'Performa Runtime',
    values: ['✅ Lazy load remotes', '❌ Berat, duplikat runtime', '✅ Lazy', '✅ Native lazy'],
  },
  {
    criteria: 'DX (Developer Experience)',
    values: ['✅ Hot reload, manifest', '❌ Debug sulit', '⚠️ Setup kompleks', '⚠️ Setup manual'],
  },
  {
    criteria: 'Error Isolation',
    values: [
      '✅ Error Boundary per remote',
      '✅ Full sandbox',
      '✅ App-level boundary',
      '⚠️ Manual',
    ],
  },
  {
    criteria: 'Deploy Independen',
    values: ['✅ Manifest-based discovery', '✅ URL-based', '✅ Import map', '✅ Import map'],
  },
];

// ── Data: MF implementation comparison ──
const implColumns: ComparisonColumn[] = [
  { header: '@module-federation/vite', highlight: true },
  { header: 'Webpack 5 MF' },
  { header: 'Rspack MF' },
  { header: 'Turbopack' },
];

const implRows: ComparisonRow[] = [
  {
    criteria: 'Bundler',
    values: [
      '✅ Vite (ESM-first, cepat di dev loop)',
      '✅ Webpack (paling mature untuk MF)',
      '✅ Rspack (Rust, fast)',
      '❌ Belum support MF',
    ],
  },
  {
    criteria: 'Dev Server Speed',
    values: [
      '✅ Cepat (bergantung ukuran proyek)',
      '⚠️ Umumnya lebih berat dari Vite/Rspack',
      '✅ Cepat',
      '✅ Cepat',
    ],
  },
  {
    criteria: 'React 19 Support',
    values: ['✅ Full support', '✅ Support', '✅ Support', '⚠️ Experimental'],
  },
  {
    criteria: 'Manifest-based Discovery',
    values: ['✅ Built-in mf-manifest.json', '⚠️ Manual remoteEntry.js', '✅ Built-in', '❌ N/A'],
  },
  {
    criteria: 'Shared Deps Singleton',
    values: [
      '✅ Via konfigurasi shared/singleton',
      '✅ Via konfigurasi shared/singleton',
      '✅ Via konfigurasi shared/singleton',
      '❌ N/A',
    ],
  },
  {
    criteria: 'TypeScript DX',
    values: [
      '⚠️ Dukungan d.ts tersedia, perlu konfigurasi',
      '⚠️ Umumnya perlu setup tambahan d.ts',
      '⚠️ Dukungan d.ts tersedia, perlu konfigurasi',
      '❌ N/A',
    ],
  },
  {
    criteria: 'Nx / Monorepo',
    values: [
      '⚠️ Bisa dipakai di Nx monorepo, bukan jalur utama docs Nx MF',
      '✅ Nx generator mature',
      '✅ Didukung pada ekosistem Nx MF',
      '⚠️ Turborepo only',
    ],
  },
  {
    criteria: 'Production Maturity',
    values: [
      '✅ Siap produksi dengan guardrail yang baik',
      '✅ Paling mature',
      '⚠️ Adopsi meningkat',
      '❌ Belum tersedia',
    ],
  },
  {
    criteria: 'ESM Output',
    values: ['✅ Native ESM', '❌ CommonJS default', '✅ ESM support', '✅ ESM'],
  },
  {
    criteria: 'Community / Ecosystem',
    values: [
      '✅ Growing, same team as WP MF',
      '✅ Terbesar',
      '⚠️ Kecil tapi growing',
      '❌ Belum ada',
    ],
  },
];

// ── Data: Monorepo vs Polyrepo comparison ──
const monorepoColumns: ComparisonColumn[] = [
  { header: 'Kriteria' },
  { header: 'Hybrid Monorepo (Nx)', highlight: true },
  { header: 'Polyrepo Tradisional' },
];

const monorepoRows: ComparisonRow[] = [
  {
    criteria: 'Shared Libraries (@synapse/ui-kit)',
    values: [
      '',
      '✅ Single Source of Truth, instan',
      '❌ Membutuhkan publish & update manual berkala',
    ],
  },
  {
    criteria: 'Standarisasi Tooling',
    values: [
      '',
      '✅ Terpusat via Nx Generators, 100% kongruen',
      '❌ Rentan deviasi (Webpack vs Vite, versi linting berbeda)',
    ],
  },
  {
    criteria: 'Kecepatan CI/CD Build',
    values: [
      '',
      '✅ Diferensial parsial via Affected Graph & Caching',
      '✅ Terisolasi sepenuhnya antar repositori',
    ],
  },
  {
    criteria: 'Visibilitas Lintas Tim',
    values: [
      '',
      '✅ Transparan, refaktor lintas-MFE dapat dieksekusi secara atomik',
      '❌ Silo, membutuhkan PR lintas repositori yang kompleks',
    ],
  },
];

export function DocsWhyMfSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <SectionTitle
          icon="🏗️"
          title="Kenapa Module Federation?"
          description="Perbandingan pendekatan Micro Frontend dan alasan memilih Vite Module Federation untuk arsitektur Synapse MFE."
        />

        {/* ── Masalah ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Masalah yang Ingin Diselesaikan
          </h3>
          <FeatureGrid
            items={[
              {
                icon: '👥',
                title: 'Tim Paralel',
                desc: 'Beberapa tim harus bisa bekerja bersamaan tanpa saling mengganggu',
              },
              {
                icon: '🚀',
                title: 'Deploy Independen',
                desc: 'Setiap modul bisa di-deploy tanpa rebuild keseluruhan',
              },
              {
                icon: '🔒',
                title: 'Isolasi Kegagalan',
                desc: 'Satu modul crash tidak boleh mematikan seluruh aplikasi',
              },
              {
                icon: '⚡',
                title: 'Performa Build',
                desc: 'Build time harus cepat dan konsisten di berbagai environment development',
              },
            ]}
          />
        </section>

        {/* ── Approach Comparison ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Perbandingan Micro Frontend Approaches
          </h3>
          <ComparisonTable columns={approachColumns} rows={approachRows} />
        </section>

        {/* ── Why Not Others ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Kenapa Bukan yang Lain?
          </h3>
          <div className="space-y-3">
            <InfoBox variant="red" title="❌ iframe">
              Setiap iframe me-load seluruh React runtime terpisah — berat untuk mobile, tidak bisa
              share state langsung, dan routing synchronization sangat kompleks. URL bar tidak
              mencerminkan state child app.
            </InfoBox>
            <InfoBox variant="amber" title="⚠️ Single SPA">
              Single-spa bersifat bundler-agnostic dan bisa dipakai dengan Vite. Trade-off utamanya
              ada di level orkestrasi: shared dependency policy, runtime contracts, dan integrasi
              antar-app biasanya membutuhkan wiring yang lebih manual dibandingkan Module
              Federation.
            </InfoBox>
            <InfoBox variant="amber" title="⚠️ Import Map / Native ESM">
              Pendekatan paling "pure" tapi butuh banyak boilerplate untuk state management,
              versioning, dan fallback. Tidak ada built-in support untuk shared singleton — harus
              dikelola manual. Cocok untuk project kecil, tidak untuk enterprise.
            </InfoBox>
          </div>
        </section>

        {/* ── Implementation Comparison ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Perbandingan Implementasi Module Federation
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Setelah memilih pendekatan Module Federation, ada beberapa <em>implementasi</em> yang
            tersedia:
          </p>
          <ComparisonTable columns={implColumns} rows={implRows} />

          <div className="space-y-3 mt-4">
            <InfoBox variant="amber" title="⚠️ Webpack 5 Module Federation">
              Implementasi original dan paling mature. Di proyek ini kami memilih{' '}
              <strong>Vite</strong> untuk dev loop yang lebih ringan serta integrasi ESM-first,
              sambil tetap menggunakan ekosistem Module Federation yang sama.
            </InfoBox>
            <InfoBox variant="amber" title="⚠️ Rspack Module Federation">
              Rspack sangat cepat (Rust-based) dan support MF, tapi masih di tahap{' '}
              <strong>early adoption</strong>. Ecosystem plugin masih berkembang, dan workflow tim
              di proyek ini saat ini lebih matang di stack Vite. Bisa menjadi pilihan di masa depan.
            </InfoBox>
            <InfoBox variant="red" title="❌ Turbopack">
              Turbopack (dari Vercel/Next.js) belum mendukung Module Federation sama sekali.
              Fokusnya pada Next.js ecosystem, bukan general-purpose MFE. Eliminasi langsung.
            </InfoBox>
          </div>

          <InfoBox
            variant="emerald"
            title="✅ Kesimpulan: @module-federation/vite"
            className="mt-4"
          >
            <ul className="space-y-1.5 list-disc list-inside mt-1">
              <li>
                <strong>Ekosistem Module Federation yang sama</strong> dengan jalur konfigurasi yang
                konsisten lintas bundler
              </li>
              <li>
                <strong>Native Vite integration</strong> — langsung plug-in ke vite.config.ts
              </li>
              <li>
                <strong>Manifest-based discovery</strong> — mf-manifest.json bawaan
              </li>
              <li>
                <strong>ESM-first output</strong> — lebih ringan dan cepat di browser modern
              </li>
              <li>
                <strong>Type hinting plugin</strong> — dapat generate d.ts untuk remote exposes jika{' '}
                <code>dts</code> diaktifkan
              </li>
              <li>
                <strong>Production-ready</strong> — dengan kontrak shared deps yang disiplin
              </li>
            </ul>
          </InfoBox>

          <InfoBox variant="blue" title="Catatan Implementasi Repo Ini" className="mt-4">
            Saat ini konfigurasi federation di repo ini menggunakan <code>dts: false</code>. Artinya
            dukungan auto-generated type hints untuk remote belum diaktifkan secara runtime config.
          </InfoBox>
        </section>

        {/* ── Key Advantages ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Keunggulan Kunci yang Kita Manfaatkan
          </h3>
          <div className="space-y-4">
            <InfoBox variant="emerald" title="1. Manifest-based Dynamic Discovery">
              <p className="mb-3">
                Remote MFE URL tidak di-hardcode. Shell membaca <code>remotes.json</code> saat
                runtime — deploy versi baru tanpa rebuild Shell.
              </p>
              <CodeBlock
                codeString={`// shell/public/remotes.json
{
  "remotes": {
    "authMfe": {
      "name": "authMfe",
      "entry": "http://localhost:4001/mf-manifest.json",
      "activeWhenPath": "/auth"
    },
    "docs-mfe": {
      "name": "docsmfe",
      "entry": "http://localhost:4003/mf-manifest.json",
      "activeWhenPath": "/docs"
    }
  }
}

// Production — cukup ganti URL manifest:
{
  "remotes": {
    "authMfe": {
      "name": "authMfe",
      "entry": "https://auth.synapse.id/mf-manifest.json",
      "activeWhenPath": "/auth"
    },
    "docs-mfe": {
      "name": "docsmfe",
      "entry": "https://docs.synapse.id/mf-manifest.json",
      "activeWhenPath": "/docs"
    }
  }
}`}
                language="json"
              />
            </InfoBox>

            <InfoBox variant="blue" title="2. Shared Dependency Singleton">
              <p className="mb-3">
                React, React DOM, dan library berat lainnya hanya dimuat <strong>sekali</strong> di
                runtime. Semua MFE berbagi instance yang sama.
              </p>
              <CodeBlock
                codeString={`// vite.config.ts — shared dependency policy
shared: {
  react:       { singleton: true, requiredVersion: '^19.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
  'react-icons':  { singleton: false }, // boleh duplikat
}`}
                language="typescript"
              />
            </InfoBox>

            <InfoBox variant="purple" title="3. Resilience — Error Boundary per Remote">
              <p className="mb-3">
                Setiap remote dibungkus <code>React.Suspense</code> + <code>ErrorBoundary</code>.
                Jika auth-mfe crash, Shell dan remote lain tetap berjalan normal.
              </p>
              <CodeBlock
                codeString={`// Shell router — setiap remote terisolasi
<Route path="auth/*" element={
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<PageSkeleton />}>
      <RemoteAuthPage />
    </Suspense>
  </ErrorBoundary>
} />`}
                language="tsx"
              />
            </InfoBox>

            <InfoBox variant="orange" title="4. Zustand State — Shared by Contract">
              <p className="mb-3">
                Auth state, theme, notification — semua Zustand store didefinisikan di{' '}
                <code>shared-types</code> sehingga kontrak state konsisten lintas app. Untuk
                menjamin instance store tunggal lintas remote di runtime MF, dependency store perlu
                dikelola di kebijakan <code>shared</code>.
              </p>
              <CodeBlock
                codeString={`// Dari MFE manapun — state langsung sync:
import { useAuthStore } from '@synapse/shared-types';

function Header() {
  const user = useAuthStore((s) => s.user);
  return <span>Halo, {user?.name}!</span>;
}`}
                language="tsx"
              />
            </InfoBox>
          </div>
        </section>

        {/* ── Monorepo vs Polyrepo ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Arsitektur Hybrid Monorepo (Nx)
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Proyek ini menggunakan pendekatan <strong>Hybrid Monorepo</strong> yang diorkestrasi
            oleh <strong>Nx</strong>. Seluruh kode sumber dikelola dalam satu repositori terpusat,
            namun setiap modul di-<em>deploy</em> secara independen. Keputusan arsitektur ini
            diambil untuk mendobrak batasan manajerial pada ekosistem Multi-MFE:
          </p>
          <ComparisonTable columns={monorepoColumns} rows={monorepoRows} />

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            Pola rancangan ini sejalan dengan fondasi teknis skala <em>enterprise</em> yang
            dipelopori oleh organisasi seperti Google dan Meta. Referensi literatur arsitektur
            komprehensif dapat diakses melalui{' '}
            <a
              href="https://monorepo.tools/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline hover:text-blue-800"
            >
              dokumentasi resmi Nx (monorepo.tools)
            </a>{' '}
            serta pedoman fundamental dari{' '}
            <a
              href="https://martinfowler.com/articles/micro-frontends.html"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline hover:text-blue-800"
            >
              Martin Fowler
            </a>
            .
          </p>
        </section>

        {/* ── ADR ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Architecture Decision Record (ADR)
          </h3>
          <KeyValueCard
            entries={[
              { label: 'Status', value: 'Accepted', valueColor: 'text-emerald-600' },
              {
                label: 'Context',
                value:
                  'Sistem enterprise multi-modul (Auth, Customer Service, Produk, Inventaris) yang akan dikembangkan oleh tim paralel.',
              },
              {
                label: 'Decision',
                value: (
                  <>
                    Menggunakan <strong>Vite + @module-federation/vite</strong> dalam arsitektur{' '}
                    <strong>Nx Hybrid Monorepo</strong>, dengan Zustand shared stores dan
                    manifest-based discovery.
                  </>
                ),
              },
              {
                label: 'Consequences (+)',
                value:
                  'Deploy independen, shared singleton deps, full TypeScript support, fast Vite build, state sharing tanpa boilerplate.',
              },
              {
                label: 'Consequences (−)',
                value:
                  'Tim perlu memahami konsep MF, versioning shared deps perlu dijaga, debugging lintas-remote lebih kompleks.',
              },
            ]}
          />
        </section>

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Referensi Teknis
          </h3>
          <ul className="space-y-2 list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300">
            <li>
              Module Federation Vite Guide:{' '}
              <a
                href="https://module-federation.io/guide/basic/vite"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                module-federation.io/guide/basic/vite
              </a>
            </li>
            <li>
              Module Federation shared config:{' '}
              <a
                href="https://module-federation.io/configure/shared"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                module-federation.io/configure/shared
              </a>
            </li>
            <li>
              Webpack Module Federation plugin:{' '}
              <a
                href="https://webpack.js.org/plugins/module-federation-plugin/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                webpack.js.org/plugins/module-federation-plugin
              </a>
            </li>
            <li>
              single-spa recommended setup:{' '}
              <a
                href="https://single-spa.js.org/docs/recommended-setup/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                single-spa.js.org/docs/recommended-setup
              </a>
            </li>
            <li>
              Vite features/performance context:{' '}
              <a
                href="https://vite.dev/guide/features.html"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                vite.dev/guide/features
              </a>
            </li>
            <li>
              Nx Module Federation overview:{' '}
              <a
                href="https://nx.dev/concepts/module-federation/module-federation-and-nx"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                nx.dev/concepts/module-federation/module-federation-and-nx
              </a>{' '}
              dan{' '}
              <a
                href="https://nx.dev/technologies/module-federation/introduction"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                nx.dev/technologies/module-federation/introduction
              </a>
            </li>
            <li>
              Turbopack architecture/status:{' '}
              <a
                href="https://nextjs.org/docs/architecture/turbopack"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-blue-800"
              >
                nextjs.org/docs/architecture/turbopack
              </a>
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
