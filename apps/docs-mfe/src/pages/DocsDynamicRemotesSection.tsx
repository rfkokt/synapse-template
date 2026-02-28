import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsDynamicRemotesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400 text-sm font-bold">
              7a
            </span>
            Dynamic Remotes
          </CardTitle>
          <CardDescription>Module Federation berbasis konfigurasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Shell membaca daftar MFE dari{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              remotes.json
            </code>{' '}
            saat runtime — bukan hardcoded.
          </p>
          <p>
            Tim infra bisa repoint URL (misal ke versi MFE lama saat error) tanpa build ulang Shell.
          </p>
          <CodeBlock
            language="json"
            codeString={`// shell/public/remotes.json
{
  "authMfe": "http://localhost:4001",
  "pendaftaran": "http://localhost:4002",
  "docsMfe": "http://localhost:4003"
}`}
          />
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              🌍 Inject Dynamic URL via .env
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 my-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                📁 Dimana file .env diletakkan?
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                File <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">.env</code>{' '}
                (atau{' '}
                <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                  .env.production
                </code>
                ) diletakkan <strong>di dalam folder aplikasi Shell</strong> (
                <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                  apps/shell/.env
                </code>
                ), bukan di folder <em>root</em> monorepo. Hal ini dikarenakan Vite akan membacanya
                dari <em>Current Working Directory</em> (CWD) aplikasi tersebut.
              </p>
            </div>
            <p className="mb-2">
              Di aplikasi Shell, kita bisa mengganti URL MFE yang ada di <code>remotes.json</code>{' '}
              secara dinamis lewat <em>environment variables</em>. Ini sangat berguna untuk Deploy
              Production & Staging:
            </p>
            <CodeBlock
              language="bash"
              codeString={`# shell/.env.production
VITE_DOCS_MFE_URL=https://docs.Synapse.com
VITE_AUTH_MFE_URL=https://auth.Synapse.com`}
            />
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Vite otomatis meresolusi nama MFE di <code>remotes.json</code> (contoh:{' '}
              <code>docsMfe</code>) mencari nilai ENV{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                VITE_DOCS_MFE_URL
              </code>{' '}
              dan{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                VITE_AUTH_MFE_URL
              </code>
              . Sehingga kita tidak perlu repot mengubah{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">remotes.json</code>{' '}
              berkali-kali!
            </p>

            <h5 className="font-medium text-xs text-neutral-500 mb-2 uppercase tracking-wide">
              ⚙️ Behind the scenes (Bagaimana Shell melakukannya)
            </h5>
            <CodeBlock
              language="typescript"
              codeString={`// apps/shell/vite.config.ts
import { loadEnv } from 'vite';

function loadFederationRemotes(mode: string) {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // ... read remotes.json
  
  // Format camelCase dari remotes.json direplace jadi ENV CONSTANT
  // authMfe -> VITE_AUTH_MFE_URL
  const envKeyName = remote.name.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toUpperCase();
  const envKey = \`VITE_\${envKeyName}_URL\`;
  
  // Timpa URL di remotes.json dengan variabel lingkungan (jika ada)
  const entryUrl = env[envKey] ? \`\${env[envKey]}/mf-manifest.json\` : remote.entry;
  // ...
}`}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              🤝 Dipakai oleh Tim Lain
            </h4>
            <p className="mb-2">
              Ya! Orang lain atau tim lain sangat bisa menghubungkan aplikasinya ke MFE yang sudah
              kita deploy. Mereka hanya perlu mendaftarkan <strong>URL Production</strong> MFE
              tersebut di file{' '}
              <code className="text-primary-700 bg-primary-50 px-1 rounded">remotes.json</code>{' '}
              mereka sendiri.
            </p>
            <CodeBlock
              language="json"
              codeString={`// remotes.json (Di aplikasi milik tim lain)
{
  "docsMfe": "https://docs.Synapse.com/mf-manifest.json",
  "authMfe": "https://auth.Synapse.com/mf-manifest.json"
}`}
            />
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                ⚠️ Syarat Agar Bisa Diakses Tim Lain:
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-400 list-disc ml-4 mt-1 space-y-1">
                <li>
                  Server MFE (Cloudflare/S3) harus memperbolehkan <strong>CORS</strong> (Header{' '}
                  <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">
                    Access-Control-Allow-Origin
                  </code>{' '}
                  tidak di-block).
                </li>
                <li>
                  Kebijakan <strong>CSP</strong> (Content Security Policy) di aplikasi mereka harus
                  mengizinkan script dari domain kita.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-400 text-sm font-bold">
              7b
            </span>
            Dynamic Menu dari Backend
          </CardTitle>
          <CardDescription>Sidebar navigasi dari API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Menu sidebar di-fetch dari{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              GET /api/v1/menus
            </code>
            , dengan fallback ke mock data.
          </p>
          <CodeBlock
            language="tsx"
            codeString={`// TypeScript contract
interface MenuItem {
  id: string;
  label: string;
  icon: string;         // Lucide icon name
  path: string;
  roles?: string[];     // ['admin', 'manager'] atau ['*']
  children?: MenuItem[];
  badge?: string;       // "NEW" atau "3"
}

interface MenuGroup {
  title: string;        // "MENU", "LAINNYA"
  roles?: string[];
  items: MenuItem[];
}`}
          />
          <CodeBlock
            language="tsx"
            codeString={`import { apiClient, API } from '@synapse/shared-api';
import { filterMenuGroupsByRole } from '@synapse/shared-types';

const response = await apiClient.get(API.menu.list());
const menus = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
const roleAwareMenus = filterMenuGroupsByRole(menus, user.role);`}
          />
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              💡 Selalu sediakan mock data sebagai fallback di{' '}
              <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                mock-menus.ts
              </code>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Detail RBAC sidebar ada di <code>/docs/sidebar-rbac</code>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
