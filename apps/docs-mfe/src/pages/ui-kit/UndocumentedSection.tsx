import { Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, CodeBlock } from './shared';

export function UndocumentedSection({ name }: { name: string }) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader title={name} description="Komponen ini belum memiliki dokumentasi." />
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
            sudah terdeteksi di{' '}
            <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">
              libs/ui-kit/src/components/
            </code>{' '}
            tapi belum ada dokumentasinya.
          </p>
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 text-left max-w-lg mx-auto">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Cara menambahkan dokumentasi:
            </p>
            <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">1.</span> Buat
                file{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  apps/docs-mfe/src/pages/ui-kit/{name}Section.tsx
                </code>
              </li>
              <li>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">2.</span> Buat
                function{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  {name}Section()
                </code>{' '}
                dengan preview + code usage
              </li>
              <li>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">3.</span>{' '}
                Import dan tambahkan ke{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  UIKIT_SECTION_MAP
                </code>{' '}
                di App.tsx:
              </li>
            </ol>
            <CodeBlock>{`// Di App.tsx UIKIT_SECTION_MAP, tambahkan:
import { ${name}Section } from './pages/ui-kit/${name}Section';

const UIKIT_SECTION_MAP = {
  ...
  ${name.toLowerCase()}: ${name}Section,
};`}</CodeBlock>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
