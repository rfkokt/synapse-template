import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function UndocumentedSection({ name }: { name: string }) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{name}</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Tidak ada dokumentasi.</p>
        </div>

        <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl p-8 text-center">
          <p className="text-4xl mb-4">📝</p>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Dokumentasi Belum Tersedia
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-4">
            Komponen{' '}
            <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">
              {name}
            </code>{' '}
            sudah terdeteksi dari package{' '}
            <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">
              @synapse/shared-components
            </code>{' '}
            tapi belum ada docs page khusus.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 text-left max-w-lg mx-auto">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Cara menambahkan dokumentasi:
            </p>
            <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">1.</span> Buat
                file docs page:
                <code className="ml-1 text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  apps/docs-mfe/src/pages/components/{name}Section.tsx
                </code>
              </li>
              <li>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">2.</span>{' '}
                Tambahkan export komponen dari:
                <code className="ml-1 text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  libs/shared-components/src/index.ts
                </code>
              </li>
              <li>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">3.</span>{' '}
                Import + daftarkan section ke{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  COMPONENTS_SECTION_MAP
                </code>{' '}
                di App.tsx
              </li>
            </ol>

            <CodeBlock>{`// App.tsx
import { ${name}Section } from './pages/components/${name}Section';

const COMPONENTS_SECTION_MAP = {
  ...
  ${name.toLowerCase()}: ${name}Section,
};`}</CodeBlock>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
