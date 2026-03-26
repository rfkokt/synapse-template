import { CodeBlock, DocsStep, InfoBox } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { LuShieldCheck as ShieldCheck } from 'react-icons/lu';

export function DocsApiMockingSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          <span className="inline-flex items-center gap-3">
            <ShieldCheck className="h-7 w-7" />
            API Mocking (MSW)
          </span>
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

            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-xs text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300">
              <p className="font-semibold mb-2">Kredensial Mock Login (auth-mfe):</p>
              <p>
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">
                  admin@Synapse.com
                </code>{' '}
                /{' '}
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">password123</code>
              </p>
              <p>
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">
                  manager@Synapse.com
                </code>{' '}
                /{' '}
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">password123</code>
              </p>
              <p>
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">
                  dev@Synapse.com
                </code>{' '}
                /{' '}
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">password123</code>
              </p>
              <p>
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">
                  user@Synapse.com
                </code>{' '}
                /{' '}
                <code className="bg-white/80 dark:bg-indigo-900/50 px-1 rounded">password123</code>
              </p>
            </div>
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

export const reportingHandlers = [
  http.get('/api/v1/reports/status', () => {
    return HttpResponse.json({ status: 'ACTIVE', total: 15 });
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
import { reportingHandlers } from './handlers/reporting'; // <-- import

export const worker = setupWorker(
  ...authHandlers,
  ...reportingHandlers // <-- pasang di sini
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
          <DocsStep title="4. Contoh Endpoint Sidebar Menu (RBAC)" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Untuk kasus Shell, endpoint menu juga dimock agar alur RBAC bisa dites tanpa backend
              asli.
            </p>
            <CodeBlock
              language="tsx"
              codeString={`// libs/mock-api/src/handlers/menus.ts
import { http, HttpResponse, delay } from 'msw';
import menus from '../fixtures/menus.json';

export const menuHandlers = [
  http.get('/api/v1/menus', async () => {
    await delay(500);
    return HttpResponse.json(menus, { status: 200 });
  }),
];`}
            />
            <CodeBlock
              language="tsx"
              codeString={`// libs/mock-api/src/browser.ts
import { authHandlers } from './handlers/auth';
import { menuHandlers } from './handlers/menus';

export const worker = setupWorker(...authHandlers, ...menuHandlers);`}
            />
          </DocsStep>
          <DocsStep title="5. Contoh Penggunaan di Komponen Sehari-hari" color="indigo">
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
import { apiClient, API } from '@synapse/shared-api';

export function DaftarMenu() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    // Request ini akan di-intercept otomatis oleh MSW (jika VITE_ENABLE_MSW=true)
    // atau diteruskan ke backend betulan (jika VITE_ENABLE_MSW=false)
    apiClient.get(API.menu.list())
      .then(res => setMenus(Array.isArray(res.data) ? res.data : res.data?.data ?? []))
      .catch(console.error);
  }, []);

  return <div>Total menu: {menus.length}</div>;
}`}
            />
          </DocsStep>
          <DocsStep title="6. Update Menu Data (Sidebar Navigation)" color="amber">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Menu sidebar di-shell di-load dari <code>/api/v1/menus</code>. Saat development, data
              ini diambil dari{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                libs/mock-api/src/fixtures/menus.json
              </code>
              .
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Untuk menambah menu baru (misalnya dokumentasi baru):
            </p>
            <CodeBlock
              language="bash"
              codeString={`# 1. Update fixture JSON
# Edit: libs/mock-api/src/fixtures/menus.json

# 2. Update mock-menus.ts (fallback jika API gagal)
# Edit: apps/shell/src/data/mock-menus.ts

# 3. Restart server
pnpm run dev:new`}
            />
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              <p className="font-semibold mb-1">⚠️ Penting: Sinkronisasi Dua Lokasi</p>
              <p className="mb-2">
                Menu data ada di <strong>2 lokasi</strong> yang harus sinkron:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <code>libs/mock-api/src/fixtures/menus.json</code> — MSW mock data
                </li>
                <li>
                  <code>apps/shell/src/data/mock-menus.ts</code> — Fallback jika MSW gagal
                </li>
              </ul>
              <p className="mt-2">
                Pastikan struktur <code>children</code> array sama di kedua file!
              </p>
            </div>
          </DocsStep>
          <DocsStep title="7. Catatan CORS Saat Development" color="slate">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Saat MSW aktif dan client menggunakan{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                withCredentials
              </code>
              , gunakan API same-origin agar tidak kena preflight CORS lintas port.
            </p>
            <CodeBlock
              language="bash"
              codeString={`# .env.development (direkomendasikan saat mock aktif)
VITE_ENABLE_MSW=true
VITE_API_BASE_URL=/`}
            />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Jika MSW dimatikan (
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                VITE_ENABLE_MSW=false
              </code>
              ), arahkan{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                VITE_API_BASE_URL
              </code>{' '}
              ke backend sungguhan yang sudah dikonfigurasi CORS + credentials.
            </p>
          </DocsStep>
          <DocsStep title="8. Menambah Mock API Handler Baru" color="violet">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Untuk menambah endpoint mock baru, buat handler di{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                libs/mock-api/src/handlers/
              </code>
              :
            </p>
            <CodeBlock
              language="tsx"
              codeString={`// libs/mock-api/src/handlers/reports.ts
import { http, HttpResponse, delay } from 'msw';

export const reportHandlers = [
  http.get('/api/v1/reports', async () => {
    await delay(300); // simulasi network latency
    return HttpResponse.json({
      data: [
        { id: 1, name: 'Sales Report', status: 'completed' },
        { id: 2, name: 'Inventory Report', status: 'pending' },
      ],
    });
  }),
  http.post('/api/v1/reports', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: Date.now(), ...body, status: 'created' },
      { status: 201 }
    );
  }),
];`}
            />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Lalu daftarkan di{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">browser.ts</code>:
            </p>
            <CodeBlock
              language="tsx"
              codeString={`// libs/mock-api/src/browser.ts
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { menuHandlers } from './handlers/menus';
import { reportHandlers } from './handlers/reports'; // <-- import

export const worker = setupWorker(
  ...authHandlers,
  ...menuHandlers,
  ...reportHandlers // <-- tambahkan di sini
);`}
            />
          </DocsStep>
          <InfoBox variant="emerald" title="Multi-Repo? Publish via Verdaccio!">
            Perubahan di <code>@synapse/mock-api</code> (handler baru, fixture baru) perlu
            di-publish ulang ke Verdaccio: <code>pnpm run libs:publish:local</code>. Lihat panduan
            lengkap di <strong>/docs/verdaccio-registry</strong>.
          </InfoBox>{' '}
        </CardContent>
      </Card>
    </div>
  );
}
