import { CodeBlock, InfoBox } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';

export function DocsMenjalankanSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 text-sm font-bold">
              2
            </span>
            Menjalankan Aplikasi
          </CardTitle>
          <CardDescription>Perintah CLI untuk pengembangan lokal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Monorepo (Semua MFE Sekaligus)
          </h4>
          <CodeBlock
            language="bash"
            codeString={`# Install dependencies (jika baru pertama kali clone)
pnpm install

# Jalankan SEMUA modul sekaligus + Clear NX Cache (Sangat Direkomendasikan)
pnpm run dev:new

# Atau jalankan secara spesifik tanpa clear cache
pnpm nx run-many --target=serve --projects=shell,auth-mfe,docs-mfe --parallel

# Buka di browser
# Shell:         http://localhost:4000
# Auth MFE:      http://localhost:4001
# Docs MFE:      http://localhost:4003`}
          />
        </CardContent>
      </Card>

      <Card className="border-teal-200 dark:border-teal-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 text-sm font-bold">
              ↗
            </span>
            MFE Standalone (Multi-Repo)
          </CardTitle>
          <CardDescription>
            Menjalankan MFE di repo terpisah — butuh Verdaccio untuk shared libs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <CodeBlock
            language="bash"
            codeString={`# ═══ Terminal 1: Start Verdaccio (di monorepo) ═══
cd synapse
pnpm run verdaccio:start        # Registry di http://localhost:4873

# ═══ Terminal 2: Publish shared libs (di monorepo) ═══
cd synapse
pnpm run libs:publish:local     # Build + publish 6 libs ke Verdaccio

# ═══ Terminal 3: Jalankan MFE standalone ═══
cd ../my-standalone-mfe
pnpm install                    # Install dari Verdaccio
pnpm run serve                  # Start MFE

# ═══ Terminal 4: Jalankan Shell (di monorepo) ═══
cd synapse
pnpm run dev:new                # Shell + MFE monorepo
# Shell otomatis load MFE standalone via remotes.json`}
          />

          <InfoBox variant="blue" title="Pastikan remotes.json Sudah Benar!">
            Shell hanya akan me-load MFE yang terdaftar di{' '}
            <code>apps/shell/public/remotes.json</code>. Pastikan URL <code>entry</code> mengarah ke
            port MFE standalone kamu (misal: <code>http://localhost:4005/mf-manifest.json</code>).
            Lihat <strong>/docs/membuat-mfe-baru</strong> untuk guide lengkap.
          </InfoBox>
        </CardContent>
      </Card>
    </div>
  );
}
