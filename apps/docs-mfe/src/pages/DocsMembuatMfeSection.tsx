import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';
import { DocsStep } from '../components/DocsStep';

export function DocsMembuatMfeSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
              3
            </span>
            Membuat MFE Baru (Step-by-Step)
          </CardTitle>
          <CardDescription>5 langkah membuat Micro-Frontend baru dari nol</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DocsStep title="Step 1: Generate via Nx CLI" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Perintah ini membuat folder React+Vite+Module Federation+Tailwind v4 secara otomatis
              dan mendaftarkannya ke{' '}
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                shell/public/remotes.json
              </code>
              .
            </p>
            <CodeBlock
              language="bash"
              codeString={`# Format: pnpm nx g @synapse/tools:mfe <nama-mfe> --port=<port>
pnpm nx g @synapse/tools:mfe reporting-mfe --port=4004`}
            />
          </DocsStep>

          <DocsStep title="Step 2: Restart Server (Wajib)" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Script generator di atas otomatis mendaftarkan MFE Anda ke dalam{' '}
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                apps/shell/src/router.tsx
              </code>
              ! Karena ada MFE baru yang disuntikkan, Anda wajib mematikan Vite Dev Server yang
              sedang berjalan saat ini (Tekan{' '}
              <kbd className="font-sans px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border rounded-md">
                Ctrl+C
              </kbd>{' '}
              di terminal), lalu bersihkan cache dan *restart* dengan command khusus di bawah.
            </p>
            <CodeBlock
              language="bash"
              codeString={`# 1. Matikan server lama (Ctrl+C)
# 2. Hancurkan cache Nx & MF, lalu hidupkan ulang
pnpm run dev:new`}
            />
          </DocsStep>

          <DocsStep title="Step 3: Tambah Menu di Sidebar" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Tambah entry di{' '}
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                apps/shell/src/data/mock-menus.ts
              </code>{' '}
              untuk menampilkan menu MFE Anda di sidebar navigation.
            </p>
            <CodeBlock
              language="tsx"
              codeString={`// apps/shell/src/data/mock-menus.ts
{
  id: 'reporting',
  label: 'Reporting',
  icon: 'BarChart3',    // Nama icon Lucide
  path: '/reporting-mfe',
}`}
            />
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-300">⚠️ Penting</p>
              <p className="text-amber-700 dark:text-amber-400">
                Di dalam MFE Anda, selalu gunakan komponen{' '}
                <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-1 rounded">
                  &lt;NavLink&gt;
                </code>
                {' atau '}
                <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-1 rounded">
                  &lt;Link&gt;
                </code>{' '}
                dari <strong>react-router</strong> untuk navigasi internal, <strong>BUKAN</strong>{' '}
                <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-1 rounded">
                  &lt;a href="..."&gt;
                </code>
                ! Penggunaan tag lurus &lt;a&gt; akan memicu *full page reload* (Browser Refresh)
                yang membuat state otentikasi (Zustand) dan MFE remotes hilang!
              </p>
            </div>
          </DocsStep>

          <DocsStep title="Step 3.1: Ubah Base Route MFE (Opsional)" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Jika ingin mengubah route default (misal dari{' '}
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                /reporting-mfe
              </code>{' '}
              menjadi{' '}
              <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
                /reporting
              </code>
              ), sinkronkan 3 file berikut:
            </p>
            <CodeBlock
              language="json"
              codeString={`// 1) apps/shell/public/remotes.json
"reporting-mfe": {
  "name": "reportingmfe",
  "entry": "http://localhost:4004/mf-manifest.json",
  "activeWhenPath": "/reporting"
}`}
            />
            <CodeBlock
              language="tsx"
              codeString={`// 2) apps/shell/src/router.tsx
<Route
  path="reporting/*"
  element={
    <RemoteLoader>
      <RemoteReportingmfe />
    </RemoteLoader>
  }
/>`}
            />
            <CodeBlock
              language="tsx"
              codeString={`// 3) apps/shell/src/data/mock-menus.ts
{
  id: 'reporting',
  label: 'Reporting',
  icon: 'BarChart3',
  path: '/reporting',
}`}
            />
            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-3 text-sm">
              <p className="font-semibold text-sky-800 dark:text-sky-300">Catatan</p>
              <p className="text-sky-700 dark:text-sky-400">
                Setelah ubah base route, restart server dengan{' '}
                <code className="text-xs bg-sky-100 dark:bg-sky-900/50 px-1 rounded">
                  pnpm run dev:new
                </code>{' '}
                agar registry remote dan router ter-refresh.
              </p>
            </div>
          </DocsStep>

          <DocsStep title="Step 4: Gunakan Library Bersama" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Gunakan library bersama yang telah disediakan Platform. Jangan buang waktu membuat
              interceptor axios sendiri!
            </p>
            <CodeBlock
              language="tsx"
              codeString={`// Di MFE baru Anda:
import { Button, Input, Card } from '@synapse/ui-kit';
import { useAuthStore } from '@synapse/shared-types';
import { apiClient } from '@synapse/shared-api';

// Contoh fetch data
const res = await apiClient.get('/api/reports');
// ↑ Header Authorization diinject otomatis via interceptor!`}
            />
          </DocsStep>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
              ✅ Checklist MFE Baru (100% Plug & Play)
            </h4>
            <ul className="space-y-1.5 text-sm text-emerald-700 dark:text-emerald-400">
              <li>
                ☐ Generate CLI:{' '}
                <code className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  pnpm nx g @synapse/tools:mfe nama-mfe --port=PORT
                </code>
              </li>
              <li>
                ☐ Restart Server via{' '}
                <code className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  pnpm run dev:new
                </code>
              </li>
              <li>
                ☐ Route & Remotes{' '}
                <strong className="font-semibold underline">sudah terdaftar otomatis</strong> oleh
                generator.
              </li>
              <li>
                ☐ Menu entry di{' '}
                <code className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  mock-menus.ts
                </code>
              </li>
              <li>
                ☐ Icon terdaftar di{' '}
                <code className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  icon-map.ts
                </code>
              </li>
              <li>
                ☐ Pakai{' '}
                <code className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  @synapse/ui-kit
                </code>{' '}
                dan{' '}
                <code className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  @synapse/shared-api
                </code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-bold">
              !
            </span>
            Menghapus MFE (Otomatis)
          </CardTitle>
          <CardDescription>
            Membatalkan pembuatan MFE dan membersihkan semua injeksi konfigurasi di Shell
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Jika Anda berubah pikiran atau melakukan kesalahan saat *generate* nama MFE, Anda tidak
            perlu menghapus file, route, dan remotes secara manual satu per satu. Platform
            menyediakan kebalikan dari proses *Generate* yaitu *Remove*.
          </p>

          <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm mb-2">
              Jalankan Generator Penghapus
            </h4>
            <p className="text-xs text-red-700 dark:text-red-400 mb-3">
              Perintah ini akan membaca AST *router*, *remotes*, dan *vite configs* di Shell untuk
              menghapus injeksi secara aman, lalu menghapus direktori *apps/nama-mfe* secara fisik.
            </p>
            <CodeBlock
              language="bash"
              codeString={`# Format: pnpm nx g @synapse/tools:remove-mfe <nama-mfe>
pnpm nx g @synapse/tools:remove-mfe reporting-mfe`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
