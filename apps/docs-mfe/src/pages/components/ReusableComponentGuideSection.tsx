import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock, InfoBox, KeyValueCard, StepList } from '@synapse/shared-components';

const createComponentCode = `// libs/shared-components/src/MyStatusBadge.tsx
import type { ReactNode } from 'react';

export interface MyStatusBadgeProps {
  tone?: 'success' | 'warning' | 'danger';
  children: ReactNode;
}

export function MyStatusBadge({ tone = 'success', children }: MyStatusBadgeProps) {
  const toneClass =
    tone === 'danger'
      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      : tone === 'warning'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';

  return <span className={\`inline-flex rounded-full px-2 py-1 text-xs font-medium \${toneClass}\`}>{children}</span>;
}`;

const exportCode = `// libs/shared-components/src/index.ts
export { MyStatusBadge } from './MyStatusBadge';
export type { MyStatusBadgeProps } from './MyStatusBadge';`;

const dependencyCode = `// apps/<nama-mfe>/package.json
{
  "dependencies": {
    "@synapse/shared-components": "workspace:*"
  }
}`;

const usageCode = `// apps/<nama-mfe>/src/pages/OrderList.tsx
import { MyStatusBadge } from '@synapse/shared-components';

<MyStatusBadge tone="warning">Menunggu Approval</MyStatusBadge>;`;

const verifyCode = `pnpm install
pnpm -C apps/<nama-mfe> run typecheck
pnpm -C apps/<nama-mfe> run build`;

export function ReusableComponentGuideSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Build Reusable Component
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Panduan membuat komponen baru di <code>@synapse/shared-components</code> supaya bisa
            dipakai lintas MFE.
          </p>
        </div>

        <InfoBox variant="blue" title="Alur Standar">
          Simpan source komponen di <code>libs/shared-components/src</code>, export di{' '}
          <code>index.ts</code>, lalu pakai dari package <code>@synapse/shared-components</code>{' '}
          pada MFE mana pun.
        </InfoBox>

        <StepList
          steps={[
            {
              title: 'Buat file komponen baru di shared-components',
              content: (
                <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                  libs/shared-components/src/MyStatusBadge.tsx
                </code>
              ),
            },
            {
              title: 'Export komponen dan type dari entrypoint',
              content: (
                <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                  libs/shared-components/src/index.ts
                </code>
              ),
            },
            {
              title: 'Pastikan MFE tujuan punya dependency workspace',
              content: (
                <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                  {'{"@synapse/shared-components": "workspace:*"}'}
                </code>
              ),
            },
            {
              title: 'Import dari package di halaman MFE tujuan',
              content: 'Jangan import dari path relatif antar app.',
            },
            {
              title: 'Verifikasi typecheck dan build MFE',
              content: 'Jalankan typecheck/build sebelum merge.',
            },
          ]}
        />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            1) Contoh file komponen
          </h3>
          <CodeBlock codeString={createComponentCode} language="tsx" />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            2) Export dari index.ts
          </h3>
          <CodeBlock codeString={exportCode} language="ts" />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            3) Tambahkan dependency di MFE pemakai
          </h3>
          <CodeBlock codeString={dependencyCode} language="json" />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            4) Cara pakai di MFE lain
          </h3>
          <CodeBlock codeString={usageCode} language="tsx" />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            5) Verifikasi
          </h3>
          <CodeBlock codeString={verifyCode} language="bash" />
        </section>

        <KeyValueCard
          entries={[
            { label: 'Source folder', value: 'libs/shared-components/src' },
            { label: 'Import path', value: '@synapse/shared-components' },
            { label: 'Tujuan', value: 'Satu komponen bisa dipakai di banyak MFE' },
          ]}
        />
      </CardContent>
    </Card>
  );
}
