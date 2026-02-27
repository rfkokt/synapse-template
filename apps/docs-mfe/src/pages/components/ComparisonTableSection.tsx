import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';
import { ComparisonTable } from '@synapse/shared-components';

export function ComparisonTableSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            ComparisonTable
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Tabel perbandingan dengan kolom yang bisa di-highlight sebagai pilihan utama.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Basic</h3>
        <ComparisonTable
          columns={[
            { header: 'Zustand', highlight: true },
            { header: 'Redux' },
            { header: 'Jotai' },
          ]}
          rows={[
            { criteria: 'Bundle Size', values: ['✅ ~1KB', '⚠️ ~7KB', '✅ ~2KB'] },
            { criteria: 'Boilerplate', values: ['✅ Minimal', '❌ Banyak', '✅ Minimal'] },
            { criteria: 'DevTools', values: ['✅ Ada', '✅ Superior', '⚠️ Basic'] },
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Tanpa Highlight
        </h3>
        <ComparisonTable
          columns={[{ header: 'Vite' }, { header: 'Webpack' }]}
          rows={[
            { criteria: 'Speed', values: ['~200ms', '~2s'] },
            { criteria: 'ESM', values: ['Native', 'Plugin'] },
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock
          codeString={`import { ComparisonTable } from '@synapse/shared-components';

<ComparisonTable
  columns={[
    { header: 'Option A', highlight: true },
    { header: 'Option B' },
    { header: 'Option C' },
  ]}
  rows={[
    { criteria: 'Speed', values: ['✅ Fast', '❌ Slow', '⚠️ Medium'] },
    { criteria: 'Cost', values: ['✅ Free', '⚠️ Paid', '✅ Free'] },
  ]}
/>`}
          language="tsx"
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-800">
                <th className="px-4 py-2 text-left font-medium">Prop</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Default</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  columns
                </td>
                <td className="px-4 py-2">{'ComparisonColumn[]'}</td>
                <td className="px-4 py-2">—</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  rows
                </td>
                <td className="px-4 py-2">{'ComparisonRow[]'}</td>
                <td className="px-4 py-2">—</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  className
                </td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
