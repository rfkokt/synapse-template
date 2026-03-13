import { ExampleTabs, ComparisonTable } from '@synapse/shared-components';
import { Card, CardContent } from '@synapse/ui-kit';
import {
  LuCircleCheck as CircleCheck,
  LuTriangleAlert as AlertTriangle,
  LuCircleX as CircleX,
} from 'react-icons/lu';

export function ComparisonTableSection() {
  const iconClass = 'h-4 w-4';
  const ok = (text: string) => (
    <span className="inline-flex items-center gap-1">
      <CircleCheck className={`${iconClass} text-emerald-500`} />
      {text}
    </span>
  );
  const warn = (text: string) => (
    <span className="inline-flex items-center gap-1">
      <AlertTriangle className={`${iconClass} text-amber-500`} />
      {text}
    </span>
  );
  const bad = (text: string) => (
    <span className="inline-flex items-center gap-1">
      <CircleX className={`${iconClass} text-red-500`} />
      {text}
    </span>
  );

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
            { criteria: 'Bundle Size', values: [ok('~1KB'), warn('~7KB'), ok('~2KB')] },
            { criteria: 'Boilerplate', values: [ok('Minimal'), bad('Banyak'), ok('Minimal')] },
            { criteria: 'DevTools', values: [ok('Ada'), ok('Superior'), warn('Basic')] },
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
        <ExampleTabs
          preview={
            <div className="w-full max-w-3xl">
              <ComparisonTable
                columns={[
                  { header: 'Option A', highlight: true },
                  { header: 'Option B' },
                  { header: 'Option C' },
                ]}
                rows={[
                  { criteria: 'Speed', values: [ok('Fast'), bad('Slow'), warn('Medium')] },
                  { criteria: 'Cost', values: [ok('Free'), warn('Paid'), ok('Free')] },
                ]}
              />
            </div>
          }
          code={`import { ComparisonTable } from '@synapse/shared-components';
import { LuCircleCheck as CircleCheck, LuTriangleAlert as AlertTriangle, LuCircleX as CircleX } from 'react-icons/lu';

const ok = (text) => (
  <span className="inline-flex items-center gap-1">
    <CircleCheck className="h-4 w-4 text-emerald-500" />
    {text}
  </span>
);
const warn = (text) => (
  <span className="inline-flex items-center gap-1">
    <AlertTriangle className="h-4 w-4 text-amber-500" />
    {text}
  </span>
);
const bad = (text) => (
  <span className="inline-flex items-center gap-1">
    <CircleX className="h-4 w-4 text-red-500" />
    {text}
  </span>
);

<ComparisonTable
  columns={[
    { header: 'Option A', highlight: true },
    { header: 'Option B' },
    { header: 'Option C' },
  ]}
  rows={[
    { criteria: 'Speed', values: [ok('Fast'), bad('Slow'), warn('Medium')] },
    { criteria: 'Cost', values: [ok('Free'), warn('Paid'), ok('Free')] },
  ]}
/>`}
          previewClassName="w-full items-start justify-center"
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
