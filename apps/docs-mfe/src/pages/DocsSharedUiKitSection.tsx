import { CodeBlock, InfoBox, StepList } from '@synapse/shared-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';

export function DocsSharedUiKitSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-400 text-sm font-bold">
              8
            </span>
            Shared UI Kit & Shadcn CLI
          </CardTitle>
          <CardDescription>Konsistensi desain antar MFE</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Jangan buat komponen dari awal! Gunakan{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              @synapse/ui-kit
            </code>{' '}
            untuk konsistensi.
          </p>
          <CodeBlock
            language="tsx"
            codeString={`import { Button, Input, Card, Badge, Modal } from '@synapse/ui-kit';

<Card className="p-4">
  <Input placeholder="Ketik sesuatu..." />
  <Button variant="outline">Simpan</Button>
</Card>`}
          />
          <p>
            <strong>Menambah komponen Shadcn baru:</strong>
          </p>
          <CodeBlock
            language="bash"
            codeString={`# Otomatis install + fix imports + auto-export ke barrel
pnpm add:ui accordion

# Langsung bisa import:
# import { Accordion } from '@synapse/ui-kit';`}
          />
          <p>
            <strong>Menghapus komponen UI Kit:</strong>
          </p>
          <CodeBlock
            language="bash"
            codeString={`# Hapus satu komponen
pnpm remove:ui accordion

# Hapus beberapa komponen sekaligus
pnpm remove:ui accordion calendar`}
          />
          <p>
            Lihat galeri lengkap di halaman <strong>/docs/ui-kit</strong> di sidebar.
          </p>
        </CardContent>
      </Card>

      {/* ══ Share ke Standalone MFE via Verdaccio ══ */}
      <Card className="border-teal-200 dark:border-teal-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 text-sm font-bold">
              ↗
            </span>
            Share Komponen Baru ke MFE Standalone
          </CardTitle>
          <CardDescription>
            Setelah menambah komponen baru di ui-kit, bagaimana cara MFE di luar monorepo
            mendapatkannya?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <InfoBox variant="blue" title="Monorepo vs Multi-Repo">
            Di dalam <strong>monorepo</strong>, komponen baru langsung tersedia via{' '}
            <code>workspace:*</code> — tidak perlu publish. Langkah di bawah hanya diperlukan jika
            MFE jalan di <strong>repo terpisah</strong> (standalone/multi-repo).
          </InfoBox>

          <StepList
            steps={[
              {
                title: '1. Tambah komponen di monorepo',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Tambah komponen Shadcn (otomatis export ke barrel)
pnpm add:ui datepicker

# Atau buat komponen custom:
# libs/ui-kit/src/components/Datepicker.tsx
# Lalu export di libs/ui-kit/src/index.ts`}
                  />
                ),
              },
              {
                title: '2. Verifikasi build berhasil',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Pastikan komponen baru tidak merusak build
pnpm libs:build`}
                  />
                ),
              },
              {
                title: '3. Bump versi (recommended)',
                content: (
                  <div className="space-y-2 mt-2">
                    <CodeBlock
                      language="json"
                      codeString={`// libs/ui-kit/package.json
"version": "0.2.0"  // bump dari 0.1.0`}
                    />
                    <p className="text-xs text-neutral-500">
                      Tanpa bump, Verdaccio akan menolak re-publish versi yang sama. Alternatif:
                      hapus storage lama <code>rm -rf tools/verdaccio/storage/@synapse/ui-kit</code>
                      .
                    </p>
                  </div>
                ),
              },
              {
                title: '4. Publish ke Verdaccio',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`# Pastikan Verdaccio jalan (terminal lain)
# pnpm run verdaccio:start

pnpm run libs:publish:local`}
                  />
                ),
              },
              {
                title: '5. Update di MFE standalone',
                content: (
                  <CodeBlock
                    language="bash"
                    codeString={`cd ../my-standalone-mfe

# Update versi di package.json (jika bump)
# "@synapse/ui-kit": "^0.2.0"

pnpm install  # Pull versi terbaru dari Verdaccio

# Sekarang bisa import:
# import { Datepicker } from '@synapse/ui-kit';`}
                  />
                ),
              },
            ]}
          />

          <InfoBox variant="emerald" title="Berlaku untuk Semua Shared Libs!">
            Workflow ini sama untuk semua 6 shared libs: <code>ui-kit</code>,{' '}
            <code>shared-types</code>, <code>shared-api</code>, <code>shared-components</code>,{' '}
            <code>shared-monitoring</code>, <code>mock-api</code>.
          </InfoBox>
        </CardContent>
      </Card>
    </div>
  );
}
