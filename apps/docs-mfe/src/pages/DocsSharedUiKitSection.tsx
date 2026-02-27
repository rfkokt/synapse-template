import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsSharedUiKitSection() {
  return (
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
          Lihat galeri lengkap di halaman <strong>/ui-kit</strong> di sidebar.
        </p>
      </CardContent>
    </Card>
  );
}
