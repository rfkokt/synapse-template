import { CodeBlock } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import {
  LuGlobe as Globe,
  LuFolder as Folder,
  LuSettings as Settings,
  LuHandshake as Handshake,
  LuTriangleAlert as AlertTriangle,
  LuLightbulb as Lightbulb,
} from 'react-icons/lu';

export function DocsDynamicRemotesSection() {
  return (
    <div className="space-y-8">
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
  "remotes": {
    "authMfe": {
      "name": "authMfe",
      "entry": "http://localhost:4001/mf-manifest.json",
      "activeWhenPath": "/auth",
      "exposes": {
        "LoginPage": "./LoginPage",
        "RegisterPage": "./RegisterPage"
      }
    },
    "docs-mfe": {
      "name": "docsmfe",
      "entry": "http://localhost:4003/mf-manifest.json",
      "activeWhenPath": "/docs",
      "exposes": {
        "./App": "./App"
      }
    }
  }
}`}
          />
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              <span className="inline-flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Inject Dynamic URL via .env
              </span>
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 my-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                <span className="inline-flex items-center gap-2">
                  <Folder className="h-3.5 w-3.5" />
                  Dimana file .env diletakkan?
                </span>
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
              codeString={`# apps/shell/.env.production
VITE_AUTH_MFE_URL=https://auth.synapse.com
VITE_DOCS_MFE_URL=https://docs.synapse.com

# Alias kompatibilitas (remote.name = "docsmfe")
# VITE_DOCSMFE_URL=https://docs.synapse.com`}
            />
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Loader Shell akan mencari override URL berdasarkan key registry di{' '}
              <code>remotes.json</code> (contoh: <code>docs-mfe</code> →{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                VITE_DOCS_MFE_URL
              </code>{' '}
              ), dan tetap kompatibel dengan key berbasis <code>remote.name</code> (
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                VITE_DOCSMFE_URL
              </code>
              ). Sehingga kita tidak perlu repot mengubah{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">remotes.json</code>{' '}
              berkali-kali!
            </p>

            <h5 className="font-medium text-xs text-neutral-500 mb-2 uppercase tracking-wide">
              <span className="inline-flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" />
                Behind the scenes (Bagaimana Shell melakukannya)
              </span>
            </h5>
            <CodeBlock
              language="typescript"
              codeString={`// apps/shell/vite.config.ts
import { loadEnv } from 'vite';

function loadFederationRemotes(mode: string) {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // ... read remotes.json

  // dukung key registry + remote.name:
  // docs-mfe -> VITE_DOCS_MFE_URL
  // docsmfe  -> VITE_DOCSMFE_URL
  const envKeyFromRegistry = \`VITE_\${toEnvKeyName(registryKey)}_URL\`;
  const envKeyFromName = \`VITE_\${toEnvKeyName(remote.name)}_URL\`;
  const envBaseUrl = env[envKeyFromRegistry] || env[envKeyFromName];
  const entryUrl = envBaseUrl ? \`\${envBaseUrl}/mf-manifest.json\` : remote.entry;
  // ...
}`}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              <span className="inline-flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                Dipakai oleh Tim Lain
              </span>
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
  "remotes": {
    "docs-mfe": {
      "name": "docsmfe",
      "entry": "https://docs.synapse.com/mf-manifest.json",
      "activeWhenPath": "/docs",
      "exposes": { "./App": "./App" }
    },
    "authMfe": {
      "name": "authMfe",
      "entry": "https://auth.synapse.com/mf-manifest.json",
      "activeWhenPath": "/auth",
      "exposes": { "LoginPage": "./LoginPage", "RegisterPage": "./RegisterPage" }
    }
  }
}`}
            />
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Syarat Agar Bisa Diakses Tim Lain:
                </span>
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
              <span className="inline-flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5" />
                Selalu sediakan mock data sebagai fallback di{' '}
              </span>
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
