import { Card, CardContent } from '@synapse/ui-kit';
import { SectionTitle, ComparisonTable, InfoBox } from '../components/docs-primitives';
import type { ComparisonColumn, ComparisonRow } from '../components/docs-primitives';
import { CodeBlock } from '../components/CodeBlock';

// ── Data: Routing Comparison ──
const routingColumns: ComparisonColumn[] = [
  { header: 'Kategori' },
  { header: 'Pendekatan 1: Nested Routing (Disarankan)', highlight: true },
  { header: 'Pendekatan 2: Independent Routes' },
];

const routingRows: ComparisonRow[] = [
  {
    criteria: 'Bentuk Export',
    values: [
      '',
      'Mengekspor 1 Component `App.tsx` berisi `<Routes>...</Routes>`',
      'Mengekspor tiap halaman satu per satu (Login, Register).',
    ],
  },
  {
    criteria: 'Coupling dengan Shell',
    values: [
      '',
      'Sangat rendah. MFE bebas atur sub-path tanpa ubah Shell.',
      'Tinggi. Shell harus mapping rute satu per satu.',
    ],
  },
  {
    criteria: 'Penggunaan Umum',
    values: [
      '',
      'Aplikasi bisnis seperti MFE Produk, MFE Transaksi.',
      'Halaman lepas yang URL-nya sejajar, contoh MFE Auth (/login & /register).',
    ],
  },
];

export function DocsRoutingSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <SectionTitle
          icon="🗺️"
          title="4. React Router di Module Federation"
          description="Panduan dan Best Practices dalam mengatur routing (React Router DOM) pada arsitektur Micro Frontend."
        />

        <section>
          <InfoBox variant="red" title="Aturan Emas: Hanya Satu BrowserRouter!">
            Di dalam arsitektur Module Federation dengan React Router DOM, **Shell bertindak sebagai
            satu-satunya pemilik `BrowserRouter`**.
            <br />
            <br />
            Micro Frontend (Remote) **tidak boleh** membalut komponen mereka dengan `BrowserRouter`.
            Jika dipaksa, akan terjadi konflik history syncing dan URL tidak akan update dengan
            benar saat navigasi.
          </InfoBox>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Pola 1: Nested Routing (Paling Disarankan)
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Ini adalah standar industri (Container/Shell-led Routing) di mana{' '}
            <strong>Shell hanya mendefinisikan URL awalan (prefix)</strong>, lalu mendelegasikan
            sisanya ke MFE terkait. Pola ini digunakan oleh <strong>Generator MFE</strong> kita.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Langkah 1: Setup di MFE
              </h4>
              <p className="text-xs text-neutral-500 mb-2">
                Export sebuah komponen yang mereturn <code>{'<Routes>'}</code> dari React Router
                DOM.
              </p>
              <CodeBlock language="tsx">{`// apps/mfe-produk/src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path=":id" element={<ProductDetail />} />
    </Routes>
  );
}`}</CodeBlock>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Langkah 2: Setup Vite Config
              </h4>
              <p className="text-xs text-neutral-500 mb-2">
                Export <code>App.tsx</code> agar bisa digunakan Shell.
              </p>
              <CodeBlock language="typescript">{`// apps/mfe-produk/vite.config.ts
exposes: {
  './App': './src/App.tsx',
}`}</CodeBlock>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Langkah 3: Panggil di Shell menggunakan Wildcard (/*)
              </h4>
              <p className="text-xs text-neutral-500 mb-2">
                Gunakan <code>/*</code> di ujung path agar sub-path bisa diteruskan ke MFE.
              </p>
              <CodeBlock language="tsx">{`// apps/shell/src/router.tsx
import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

const RemoteProdukApp = lazy(() => import('produkMfe/App'));

export function AppRouter() {
  return (
    <Routes>
       <Route path="/produk/*" element={<RemoteProdukApp />} />
    </Routes>
  );
}`}</CodeBlock>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Perbandingan Pola Routing MFE
          </h3>
          <ComparisonTable columns={routingColumns} rows={routingRows} />
        </section>

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Pola Pembantu: Standalone Development
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Saat MFE berjalan mandiri (Standalone) via{' '}
            <code className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
              pnpm run serve
            </code>
            , MFE tetap membutuhkan <code>BrowserRouter</code> agar routing-nya jalan saat didevelop
            lokal. Oleh karena itu, kita **hanya menaruh `BrowserRouter` di file `main.tsx`**.
          </p>

          <CodeBlock language="tsx">{`// apps/mfe-produk/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter HANYA ditaruh di sini, karena file ini tidak pernah diexpose ke Shell */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);`}</CodeBlock>

          <InfoBox variant="emerald" title="✅ Hasil Akhir yang Diinginkan">
            - Saat berdiri sendiri (Standalone):{' '}
            <code className="text-xs">
              Browser {'->'} BrowserRouter (main.tsx) {'->'} Routes (App.tsx)
            </code>
            <br />- Saat berjalan di Shell:{' '}
            <code className="text-xs">
              Browser {'->'} BrowserRouter (Shell) {'->'} RemoteLoader {'->'} Routes (App.tsx)
            </code>
          </InfoBox>
        </section>
      </CardContent>
    </Card>
  );
}
