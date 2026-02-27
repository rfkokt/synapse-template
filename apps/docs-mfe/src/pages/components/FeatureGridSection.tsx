import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';
import { FeatureGrid } from '@synapse/shared-components';

export function FeatureGridSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            FeatureGrid
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Grid kartu icon + title + deskripsi. Mendukung 2, 3, atau 4 kolom.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          2 Kolom (default)
        </h3>
        <FeatureGrid
          items={[
            { icon: '👥', title: 'Tim Paralel', desc: 'Beberapa tim bekerja bersamaan' },
            { icon: '🚀', title: 'Deploy Independen', desc: 'Deploy tanpa rebuild keseluruhan' },
            { icon: '🔒', title: 'Isolasi', desc: 'Kegagalan satu modul tidak menyebar' },
            { icon: '⚡', title: 'Performa', desc: 'Build time cepat' },
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">3 Kolom</h3>
        <FeatureGrid
          columns={3}
          items={[
            { icon: '🎨', title: 'Design System', desc: 'Shared UI kit' },
            { icon: '🔄', title: 'Hot Reload', desc: 'Instant feedback' },
            { icon: '📦', title: 'Lazy Load', desc: 'Remote on-demand' },
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock
          codeString={`import { FeatureGrid } from '@synapse/shared-components';

<FeatureGrid
  columns={3}  // 2 | 3 | 4
  items={[
    { icon: '🎨', title: 'Design System', desc: 'Shared UI kit' },
    { icon: '🔄', title: 'Hot Reload', desc: 'Instant feedback' },
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
                  items
                </td>
                <td className="px-4 py-2">{'FeatureItem[]'}</td>
                <td className="px-4 py-2">—</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  columns
                </td>
                <td className="px-4 py-2">2 | 3 | 4</td>
                <td className="px-4 py-2">2</td>
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
