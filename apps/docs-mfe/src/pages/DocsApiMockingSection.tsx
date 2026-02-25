import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';
import { DocsStep } from '../components/DocsStep';

export function DocsApiMockingSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          🛡️ API Mocking (MSW)
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Panduan menggunakan Mock Service Worker (MSW) untuk pengembangan mandiri tanpa perlu
          bergantung pada backend sungguhan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apa itu MSW?</CardTitle>
          <CardDescription>
            MSW mengkarantina request jaringan di level Service Worker browser. Ini berarti kode{' '}
            <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded text-emerald-700 dark:text-emerald-400">
              apiClient
            </code>{' '}
            Anda akan memanggil URL endpoint yang sama persis seperti produksi, tanpa membedakan
            apakah itu mock atau asli.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DocsStep title="1. Cara Mengaktifkan Mocking" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Di setiap MFE, Service Worker MSW sudah terpasang. Untuk mengaktifkannya, buka file{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">.env</code> lokal
              Anda lalu tambahkan:
            </p>
            <CodeBlock language="bash" codeString="VITE_ENABLE_MSW=true" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Jangan lupa me-restart server Vite (
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                pnpm run dev:new
              </code>
              ). Apabila sukses, Anda akan melihat tulisan <strong>[MSW] Mocking enabled</strong> di
              konsol browser.
            </p>
          </DocsStep>

          <DocsStep title="2. Menambahkan Endpoint Mock Baru (Handler)" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Seluruh konfigurasi intercept API terpusat di dalam library{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                @synapse/mock-api
              </code>
              . Buka atau tambahkan file baru di{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                libs/mock-api/src/handlers/
              </code>
              . Gunakan{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">http</code> dari
              library msw.
            </p>
            <CodeBlock
              language="tsx"
              codeString={`import { http, HttpResponse } from 'msw';

export const pendaftaranHandlers = [
  http.get('/api/v1/pendaftaran/status', () => {
    return HttpResponse.json({ status: 'AKTIF', pendaftar: 15 });
  }),
];`}
            />

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Lalu daftarkan variabel <i>Array Handler</i> yang baru saja Anda buat ke dalam
              kerangka <code>browser.ts</code> dan <code>server.ts</code> utama agar dikenali oleh
              pekerja (Service Worker).
            </p>
            <CodeBlock
              language="tsx"
              codeString={`// libs/mock-api/src/browser.ts
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { pendaftaranHandlers } from './handlers/pendaftaran'; // <-- import

export const worker = setupWorker(
  ...authHandlers,
  ...pendaftaranHandlers // <-- pasang di sini
);`}
            />
          </DocsStep>

          <DocsStep title="3. Menyimpan Response Tebal (Fixtures/Database Palsu)" color="slate">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Jika respons API membutuhkan data yang tebal, sangat direkomendasikan untuk melempar
              skema JSON mentahnya ke dalam folder{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                libs/mock-api/src/fixtures/
              </code>
              . File tersebut kemudian dapat di-import langsung oleh file <i>handler</i> Anda tanpa
              menuh-menuhin baris kode fungsi.
            </p>
          </DocsStep>

          <DocsStep title="4. Contoh Penggunaan di Komponen Sehari-hari" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Bagian terbaik dari MSW adalah Anda{' '}
              <strong>
                tidak perlu merubah kode <i>frontend</i> Anda sama sekali
              </strong>
              . Komponen Anda akan mengira ia sedang berbicara dengan <i>backend</i> yang
              sesungguhnya. Gunakan{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">apiClient</code>{' '}
              standar dari{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                @synapse/shared-api
              </code>{' '}
              seperti biasa:
            </p>
            <CodeBlock
              language="tsx"
              codeString={`import { useEffect, useState } from 'react';
import { apiClient } from '@synapse/shared-api';

export function ProfilPengguna() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 👇 Request ini akan di-intercept otomatis oleh MSW (jika VITE_ENABLE_MSW=true) 
    // atau diteruskan ke backend betulan (jika VITE_ENABLE_MSW=false)
    apiClient.get('/api/v1/auth/user')
      .then(res => setUser(res.data.data))
      .catch(console.error);
  }, []);

  return <div>Halo, {user?.name || 'Loading...'}</div>;
}`}
            />
          </DocsStep>
        </CardContent>
      </Card>
    </div>
  );
}
