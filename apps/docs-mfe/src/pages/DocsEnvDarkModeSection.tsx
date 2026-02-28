import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsEnvDarkModeSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900 text-lime-700 dark:text-lime-400 text-sm font-bold">
              11a
            </span>
            Environment Variables
          </CardTitle>
          <CardDescription>Konfigurasi .env per environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Semua variabel wajib prefix{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              VITE_
            </code>
            .
          </p>
          <CodeBlock
            language="bash"
            codeString={`# .env.development
VITE_AUTH_MFE_URL=http://localhost:4001
VITE_DOCS_MFE_URL=http://localhost:4003
VITE_API_BASE_URL=/
# Jika MSW dimatikan, arahkan ke backend beneran
# VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_AUTH_MFE_URL=https://auth.synapse.com
VITE_DOCS_MFE_URL=https://docs.synapse.com
VITE_API_BASE_URL=https://api.synapse.com`}
          />

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 mt-4">
            <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              📌 Fallback Override remotes.json (Skala Prioritas)
            </h4>
            <ul className="text-xs text-emerald-700 dark:text-emerald-400 list-decimal ml-4 space-y-2">
              <li>
                <strong>Prioritas Utama:</strong> Variabel di file{' '}
                <code className="font-mono bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  .env
                </code>{' '}
                otomatis menimpa URL apapun. Sangat dianjurkan digunakan untuk konfigurasi port
                lokal (misal: kolega backend punya URL test tersendiri) agar terhindar dari bentrok{' '}
                <em>Merge Conflict Git</em>.
              </li>
              <li>
                <strong>Cadangan (Fallback):</strong> Jika variabel MFE di{' '}
                <code className="font-mono bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  .env
                </code>{' '}
                dibiarkan kosong, Shell akan menoleh kembali dan menggunakan URL <em>default</em>{' '}
                yang ada secara Hardcoded menetap di{' '}
                <code className="font-mono bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                  apps/shell/public/remotes.json
                </code>
                .
              </li>
            </ul>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-3 italic border-t border-emerald-200 dark:border-emerald-800 pt-2">
              💡 Buka file template{' '}
              <code className="font-mono bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">
                apps/shell/.env.example
              </code>{' '}
              untuk melihat referensi konfigurasi Override Lokal.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 text-sm font-bold">
              11b
            </span>
            Dark Mode
          </CardTitle>
          <CardDescription>Toggle tema gelap/terang</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Class-based dark mode. Toggle menambah/menghapus{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              .dark
            </code>{' '}
            pada &lt;html&gt;.
          </p>
          <p>
            <strong>Prioritas:</strong> User preference → System preference → Default (light).
          </p>
          <p>
            User preference tersimpan di{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              localStorage
            </code>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
